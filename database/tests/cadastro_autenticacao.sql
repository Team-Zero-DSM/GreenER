-- Executar em um banco de teste com o schema atual ou a migração 002 aplicada.
-- As inserções são desfeitas ao final; sequências podem avançar.
BEGIN;

DO $$
DECLARE
    conta usuario%ROWTYPE;
    token redefinicao_senha%ROWTYPE;
BEGIN
    INSERT INTO usuario (email, senha_hash, nome)
    VALUES ('Teste-156@example.invalid', 'hash-de-teste', 'Teste')
    RETURNING * INTO conta;

    IF conta.papel <> 'visualizador' OR NOT conta.acesso_ativo OR conta.versao_sessao <> 0 THEN
        RAISE EXCEPTION 'Valores padrão da conta incorretos';
    END IF;

    BEGIN
        INSERT INTO usuario (email, senha_hash, nome)
        VALUES ('teste-156@EXAMPLE.INVALID', 'outro-hash', 'Duplicado');
        RAISE EXCEPTION 'E-mail duplicado foi aceito';
    EXCEPTION WHEN unique_violation THEN
        NULL;
    END;

    BEGIN
        INSERT INTO usuario (email, senha_hash)
        VALUES ('sem-nome@example.invalid', 'hash');
        RAISE EXCEPTION 'Conta sem nome foi aceita';
    EXCEPTION WHEN not_null_violation THEN
        NULL;
    END;

    BEGIN
        INSERT INTO usuario (email, senha_hash, nome, papel)
        VALUES ('papel-invalido@example.invalid', 'hash', 'Teste', 'invalido');
        RAISE EXCEPTION 'Papel inválido foi aceito';
    EXCEPTION WHEN check_violation THEN
        NULL;
    END;

    INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
    VALUES (repeat('a', 64), conta.id, now() + interval '30 minutes')
    RETURNING * INTO token;

    IF token.usado_em IS NOT NULL OR token.expira_em <= now() THEN
        RAISE EXCEPTION 'Dados iniciais do token incorretos';
    END IF;

    BEGIN
        INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
        VALUES (token.token_hash, conta.id, now());
        RAISE EXCEPTION 'Hash de token duplicado foi aceito';
    EXCEPTION WHEN unique_violation THEN
        NULL;
    END;

    UPDATE redefinicao_senha SET usado_em = now() WHERE token_hash = token.token_hash;
    IF NOT EXISTS (
        SELECT 1 FROM redefinicao_senha WHERE token_hash = token.token_hash AND usado_em IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Uso do token não foi registrado';
    END IF;

    DELETE FROM usuario WHERE id = conta.id;
    IF EXISTS (SELECT 1 FROM redefinicao_senha WHERE usuario_id = conta.id) THEN
        RAISE EXCEPTION 'Tokens não foram removidos junto com a conta';
    END IF;

    BEGIN
        INSERT INTO redefinicao_senha (token_hash, usuario_id, expira_em)
        VALUES (repeat('b', 64), conta.id, now());
        RAISE EXCEPTION 'Token sem usuário foi aceito';
    EXCEPTION WHEN foreign_key_violation THEN
        NULL;
    END;
END
$$;

ROLLBACK;
