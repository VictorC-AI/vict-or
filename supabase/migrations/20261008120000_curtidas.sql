-- =====================================================================
-- Curtidas dos projetos do portfólio
--
-- O site (chave publishable, papel `anon`) NÃO lê nem escreve nas tabelas:
-- só chama as funções abaixo. Elas conferem tudo antes de gravar:
--   - o projeto existe (lista em portfolio_projetos)
--   - um voto por navegador (id aleatório que o navegador guarda)
--   - limite de cliques por hora por IP (o IP não é guardado: só um hash)
-- A contagem só sai do banco a partir de 10.
--
-- Rodar no SQL Editor do Supabase (uma vez). Projeto novo no portfólio:
--   insert into public.portfolio_projetos (slug) values ('slug-do-projeto');
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- tabelas

create table if not exists public.portfolio_projetos (
  slug text primary key check (slug ~ '^[a-z0-9-]{1,60}$')
);

create table if not exists public.portfolio_curtidas (
  projeto    text not null references public.portfolio_projetos (slug) on delete cascade,
  visitante  uuid not null,
  criado_em  timestamptz not null default now(),
  primary key (projeto, visitante)
);

-- registro de cliques pro limite por hora (curtir e descurtir contam)
create table if not exists public.portfolio_curtidas_cliques (
  id         bigint generated always as identity primary key,
  ip_hash    text not null,
  criado_em  timestamptz not null default now()
);
create index if not exists portfolio_curtidas_cliques_ip_idx
  on public.portfolio_curtidas_cliques (ip_hash, criado_em);

insert into public.portfolio_projetos (slug) values
  ('beacreative'), ('laeg-estoque'), ('beacreative-aprovacao')
on conflict do nothing;

-- RLS ligado e nenhuma política: ninguém acessa as tabelas direto pela API
alter table public.portfolio_projetos         enable row level security;
alter table public.portfolio_curtidas         enable row level security;
alter table public.portfolio_curtidas_cliques enable row level security;
revoke all on public.portfolio_projetos, public.portfolio_curtidas, public.portfolio_curtidas_cliques
  from anon, authenticated;

-- ---------------------------------------------------------------- limite

-- Limites: por IP, 30 cliques/hora (uma casa ou escritório inteiro cabe);
-- por navegador o próprio par (projeto, visitante) já impede voto duplo.
create or replace function public.portfolio_registrar_clique()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  cabecalhos json := coalesce(current_setting('request.headers', true), '{}')::json;
  ip text := coalesce(
    nullif(cabecalhos ->> 'cf-connecting-ip', ''),
    split_part(coalesce(cabecalhos ->> 'x-forwarded-for', ''), ',', 1),
    'desconhecido'
  );
  -- hash com sal fixo do banco: dá pra contar cliques do mesmo IP sem guardar o IP
  hash text := encode(extensions.digest(trim(ip) || current_database() || 'vict-or', 'sha256'), 'hex');
  recentes int;
begin
  select count(*) into recentes
    from public.portfolio_curtidas_cliques
   where ip_hash = hash and criado_em > now() - interval '1 hour';

  if recentes >= 30 then
    raise exception 'Muitas curtidas seguidas. Tente de novo mais tarde.'
      using errcode = 'P0001', hint = 'limite';
  end if;

  insert into public.portfolio_curtidas_cliques (ip_hash) values (hash);

  -- faxina: registro com mais de um dia não serve mais pra nada
  delete from public.portfolio_curtidas_cliques where criado_em < now() - interval '1 day';
end;
$$;

-- ---------------------------------------------------------------- funções públicas

-- total "público": nulo abaixo de 10, pra número pequeno nem sair do banco
create or replace function public.portfolio_total_publico(p_projeto text)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  -- abaixo de 10 o having não devolve linha, e a função devolve nulo
  select count(*)::int
    from public.portfolio_curtidas
   where projeto = p_projeto
  having count(*) >= 10
$$;

create or replace function public.curtir(p_projeto text, p_visitante uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.portfolio_projetos where slug = p_projeto) then
    raise exception 'Projeto desconhecido.' using errcode = 'P0001';
  end if;
  perform public.portfolio_registrar_clique();
  insert into public.portfolio_curtidas (projeto, visitante)
  values (p_projeto, p_visitante)
  on conflict do nothing;
  return public.portfolio_total_publico(p_projeto);
end;
$$;

create or replace function public.descurtir(p_projeto text, p_visitante uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.portfolio_registrar_clique();
  delete from public.portfolio_curtidas
   where projeto = p_projeto and visitante = p_visitante;
  return public.portfolio_total_publico(p_projeto);
end;
$$;

-- contagem de todos os projetos (só os que passaram de 10 aparecem com número)
create or replace function public.contagem_curtidas()
returns table (projeto text, total int)
language sql
stable
security definer
set search_path = ''
as $$
  select p.slug, public.portfolio_total_publico(p.slug)
    from public.portfolio_projetos p
$$;

-- só as funções públicas ficam acessíveis pelo site
revoke all on function public.portfolio_registrar_clique() from public, anon, authenticated;
revoke all on function public.portfolio_total_publico(text) from public, anon, authenticated;
revoke all on function public.curtir(text, uuid) from public;
revoke all on function public.descurtir(text, uuid) from public;
revoke all on function public.contagem_curtidas() from public;
grant execute on function public.curtir(text, uuid) to anon, authenticated;
grant execute on function public.descurtir(text, uuid) to anon, authenticated;
grant execute on function public.contagem_curtidas() to anon, authenticated;
