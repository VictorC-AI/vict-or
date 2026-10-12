-- =====================================================================
-- Avisos por e-mail (curtida e feedback) e recados dos projetos
--
-- Depende de 20261008120000_curtidas.sql (já rodado).
--
-- Antes de rodar este arquivo, guarde a chave do Resend no Vault, numa
-- consulta separada (troque pela sua chave, que começa com re_):
--
--   select vault.create_secret('re_SUA_CHAVE', 'resend_api_key');
--
-- O e-mail sai de onboarding@resend.dev, que o Resend só entrega pro e-mail
-- dono da conta. Por isso a conta do Resend precisa ser criada com o mesmo
-- endereço de AVISO_PARA abaixo.
--
-- Sem a chave no Vault tudo continua funcionando, só não sai e-mail.
--
-- Rodar no SQL Editor do Supabase (uma vez).
-- =====================================================================

create extension if not exists pg_net;

-- ---------------------------------------------------------------- tabelas

-- feedback dos visitantes; não aparece no site
create table if not exists public.portfolio_recados (
  id         bigint generated always as identity primary key,
  projeto    text not null references public.portfolio_projetos (slug) on delete cascade,
  visitante  uuid not null,
  nome       text check (nome is null or char_length(nome) <= 60),
  texto      text not null check (char_length(texto) between 3 and 1000),
  criado_em  timestamptz not null default now()
);
create index if not exists portfolio_recados_visitante_idx
  on public.portfolio_recados (visitante, criado_em);

-- avisos já mandados: a mesma pessoa curtindo, descurtindo e curtindo de novo
-- não gera e-mail repetido, e o total do dia fica abaixo do limite do Resend
create table if not exists public.portfolio_avisos (
  id         bigint generated always as identity primary key,
  tipo       text not null check (tipo in ('curtida', 'recado')),
  projeto    text not null,
  visitante  uuid not null,
  criado_em  timestamptz not null default now()
);
create unique index if not exists portfolio_avisos_curtida_unica
  on public.portfolio_avisos (projeto, visitante) where tipo = 'curtida';

alter table public.portfolio_recados enable row level security;
alter table public.portfolio_avisos  enable row level security;
revoke all on public.portfolio_recados, public.portfolio_avisos from anon, authenticated;

-- ---------------------------------------------------------------- e-mail

-- Manda um e-mail pelo Resend. Nunca derruba quem chamou: sem chave, acima do
-- limite do dia ou com o Resend fora, o aviso só não sai.
create or replace function public.portfolio_mandar_aviso(
  p_tipo text, p_projeto text, p_visitante uuid, p_assunto text, p_texto text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  AVISO_PARA constant text := 'victordevv.ui@gmail.com';
  SITE constant text := 'https://victorc-ai.github.io/vict-or/projetos/';
  LIMITE_DIA constant int := 80;  -- o grátis do Resend é 100/dia
  chave text;
begin
  select decrypted_secret into chave
    from vault.decrypted_secrets
   where name = 'resend_api_key'
   limit 1;
  if chave is null then
    return;
  end if;

  if (select count(*) from public.portfolio_avisos
       where criado_em > now() - interval '1 day') >= LIMITE_DIA then
    return;
  end if;

  begin
    insert into public.portfolio_avisos (tipo, projeto, visitante)
    values (p_tipo, p_projeto, p_visitante);
  exception when unique_violation then
    return; -- essa pessoa já gerou aviso de curtida nesse projeto
  end;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || chave,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'vict.<OR> <onboarding@resend.dev>',
      'to', jsonb_build_array(AVISO_PARA),
      'subject', p_assunto,
      'text', p_texto || chr(10) || chr(10) || SITE || p_projeto || '/'
    )
  );
exception when others then
  return;
end;
$$;

-- ---------------------------------------------------------------- curtir (com aviso)

create or replace function public.curtir(p_projeto text, p_visitante uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  nova boolean;
  total int;
begin
  if not exists (select 1 from public.portfolio_projetos where slug = p_projeto) then
    raise exception 'Projeto desconhecido.' using errcode = 'P0001';
  end if;
  perform public.portfolio_registrar_clique();
  insert into public.portfolio_curtidas (projeto, visitante)
  values (p_projeto, p_visitante)
  on conflict do nothing;
  nova := found;

  if nova then
    select count(*)::int into total from public.portfolio_curtidas where projeto = p_projeto;
    perform public.portfolio_mandar_aviso(
      'curtida', p_projeto, p_visitante,
      'Nova curtida em ' || p_projeto,
      'Alguém curtiu o projeto ' || p_projeto || ' no portfólio.' || chr(10) ||
      'Total de curtidas agora: ' || total || '.'
    );
  end if;

  return public.portfolio_total_publico(p_projeto);
end;
$$;

-- ---------------------------------------------------------------- recado

-- Limites: o mesmo de cliques por IP (30/hora) e 5 recados por navegador por dia.
create or replace function public.deixar_recado(
  p_projeto text, p_visitante uuid, p_nome text, p_texto text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  nome  text := nullif(left(trim(coalesce(p_nome, '')), 60), '');
  texto text := trim(coalesce(p_texto, ''));
begin
  if not exists (select 1 from public.portfolio_projetos where slug = p_projeto) then
    raise exception 'Projeto desconhecido.' using errcode = 'P0001';
  end if;
  if char_length(texto) < 3 then
    raise exception 'Escreva um pouco mais.' using errcode = 'P0001';
  end if;
  if char_length(texto) > 1000 then
    raise exception 'Ficou longo demais: até 1000 caracteres.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.portfolio_recados
       where visitante = p_visitante and criado_em > now() - interval '1 day') >= 5 then
    raise exception 'Você já mandou vários hoje. Obrigado! Tente de novo amanhã.'
      using errcode = 'P0001';
  end if;

  perform public.portfolio_registrar_clique();

  insert into public.portfolio_recados (projeto, visitante, nome, texto)
  values (p_projeto, p_visitante, nome, texto);

  perform public.portfolio_mandar_aviso(
    'recado', p_projeto, p_visitante,
    'Feedback sobre ' || p_projeto || coalesce(' de ' || nome, ''),
    'Projeto: ' || p_projeto || chr(10) ||
    'De: ' || coalesce(nome, '(sem nome)') || chr(10) || chr(10) ||
    texto
  );
end;
$$;

-- ---------------------------------------------------------------- permissões

revoke all on function public.portfolio_mandar_aviso(text, text, uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.deixar_recado(text, uuid, text, text) from public;
grant execute on function public.deixar_recado(text, uuid, text, text) to anon, authenticated;
-- curtir foi recriada: as permissões do arquivo anterior continuam valendo,
-- mas repetir não custa nada
revoke all on function public.curtir(text, uuid) from public;
grant execute on function public.curtir(text, uuid) to anon, authenticated;
