-- Adicionar novas colunas à tabela veiculos
ALTER TABLE veiculos 
ADD COLUMN IF NOT EXISTS preco_promocional numeric,
ADD COLUMN IF NOT EXISTS cor_interna text,
ADD COLUMN IF NOT EXISTS tracao text,
ADD COLUMN IF NOT EXISTS tipo_direcao text,
ADD COLUMN IF NOT EXISTS lugares integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS situacao text,
ADD COLUMN IF NOT EXISTS caracteristicas jsonb DEFAULT '{}'::jsonb;

-- Dropar check antigo de categoria se existir e recriar com novos valores
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_categoria_check;
ALTER TABLE veiculos ADD CONSTRAINT veiculos_categoria_check
  CHECK (categoria IN ('Hatch','Sedan','SUV','Picape','Conversível','Coupé','Van','Minivan','Elétrico','Híbrido'));
