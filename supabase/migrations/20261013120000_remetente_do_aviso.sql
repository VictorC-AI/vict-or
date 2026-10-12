-- =====================================================================
-- Corrige o remetente dos avisos por e-mail
--
-- Depende de 20261012120000_avisos_e_recados.sql (já rodado).
--
-- O nome 'vict.<OR>' no campo from fazia o Resend recusar o envio (422
-- "Invalid `from` field"): ele lê o <OR> como se fosse o endereço. Esta
-- migração recria só a função que manda o aviso, com o nome 'vict.or'.
-- Todo o resto (limite do dia, um aviso por curtida, chave no Vault) fica igual.
--
-- Rodar no SQL Editor do Supabase (uma vez).
-- =====================================================================

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
  -- sem < > no nome: o Resend leria como endereço
  REMETENTE constant text := 'vict.or <onboarding@resend.dev>';
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
      'from', REMETENTE,
      'to', jsonb_build_array(AVISO_PARA),
      'subject', p_assunto,
      'text', p_texto || chr(10) || chr(10) || SITE || p_projeto || '/'
    )
  );
exception when others then
  return;
end;
$$;

-- recriar mantém as permissões, mas repetir garante que ninguém de fora chama direto
revoke all on function public.portfolio_mandar_aviso(text, text, uuid, text, text)
  from public, anon, authenticated;
