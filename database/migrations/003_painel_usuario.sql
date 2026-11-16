BEGIN;

-- Painel de monitoramento de cada usuário (US17). Cada usuário tem no máximo um
-- painel: o template escolhido, os widgets com a posição no desktop e os
-- arranjos opcionais do tablet e do celular, todos em JSONB.
CREATE TABLE IF NOT EXISTS painel_usuario (
    usuario_id BIGINT PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    template TEXT NOT NULL,
    widgets JSONB NOT NULL CHECK (jsonb_typeof(widgets) = 'array'),
    posicoes_tablet JSONB CHECK (posicoes_tablet IS NULL OR jsonb_typeof(posicoes_tablet) = 'object'),
    ordem_mobile JSONB CHECK (ordem_mobile IS NULL OR jsonb_typeof(ordem_mobile) = 'array'),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
