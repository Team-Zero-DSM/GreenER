BEGIN;

-- Impede novos cadastros durante a verificação de e-mails e a migração.
LOCK TABLE usuario IN ACCESS EXCLUSIVE MODE;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM usuario GROUP BY lower(email) HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Existem e-mails duplicados sem distinção de maiúsculas e minúsculas. Resolva os conflitos antes de aplicar a migração 002.';
    END IF;
END
$$;

ALTER TABLE usuario
    ALTER COLUMN papel SET DEFAULT 'visualizador',
    ADD COLUMN IF NOT EXISTS nome TEXT,
    ADD COLUMN IF NOT EXISTS acesso_ativo BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS versao_sessao INTEGER NOT NULL DEFAULT 0;

-- Preenche somente nomes ausentes, sem modificar e-mail, senha ou papel.
UPDATE usuario SET nome = LEFT(split_part(email, '@', 1), 100) WHERE nome IS NULL;
ALTER TABLE usuario ALTER COLUMN nome SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_usuario_email_lower ON usuario(lower(email));

CREATE TABLE IF NOT EXISTS redefinicao_senha (
    token_hash TEXT PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    expira_em TIMESTAMPTZ NOT NULL,
    usado_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_redefinicao_usuario ON redefinicao_senha(usuario_id);

COMMIT;
