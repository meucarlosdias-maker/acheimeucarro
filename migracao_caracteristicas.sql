-- 1. Dropar check antigo PRIMEIRO (senão os UPDATES abaixo são barrados)
ALTER TABLE veiculos DROP CONSTRAINT IF EXISTS veiculos_categoria_check;

-- 2. Normalizar categorias antigas para os novos valores
UPDATE veiculos SET categoria = 'Sedan' WHERE categoria = 'Sedã';
UPDATE veiculos SET categoria = NULL    WHERE categoria = 'Utilitário';

-- 3. Adicionar novas colunas
ALTER TABLE veiculos
ADD COLUMN IF NOT EXISTS preco_promocional numeric,
ADD COLUMN IF NOT EXISTS cor_interna text,
ADD COLUMN IF NOT EXISTS tracao text,
ADD COLUMN IF NOT EXISTS tipo_direcao text,
ADD COLUMN IF NOT EXISTS lugares integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS situacao text,
ADD COLUMN IF NOT EXISTS caracteristicas jsonb DEFAULT '{}'::jsonb;

-- 4. Recriar check com os novos valores + permitir NULL
ALTER TABLE veiculos ADD CONSTRAINT veiculos_categoria_check
  CHECK (categoria IS NULL OR categoria IN ('Hatch','Sedan','SUV','Picape','Conversível','Coupé','Van','Minivan','Elétrico','Híbrido'));
