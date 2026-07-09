-- ==========================================================
-- ACHEI MEU CARRO — DADOS DE EXEMPLO (seed)
-- Rode DEPOIS do schema.sql, no SQL Editor do Supabase
-- ==========================================================

-- CIDADE ------------------------------------------------------------
insert into cidades (nome, uf, slug, ativa)
values ('Joinville', 'SC', 'joinville-sc', true)
on conflict (slug) do nothing;

-- MARCAS --------------------------------------------------------------
insert into marcas (nome) values
  ('Volkswagen'), ('Fiat'), ('Chevrolet'), ('Toyota'), ('Hyundai'), ('Jeep')
on conflict (nome) do nothing;

-- MODELOS ---------------------------------------------------------------
insert into modelos (marca_id, nome)
select m.id, x.modelo
from marcas m
join (values
  ('Volkswagen', 'T-Cross 200 TSI'),
  ('Fiat', 'Argo Drive 1.3'),
  ('Chevrolet', 'Onix Plus LTZ'),
  ('Toyota', 'Hilux SRV 2.8'),
  ('Hyundai', 'HB20 Comfort'),
  ('Jeep', 'Compass Longitude')
) as x(marca, modelo) on x.marca = m.nome
on conflict (marca_id, nome) do nothing;

-- REVENDAS ------------------------------------------------------------
insert into revendas (cidade_id, nome, slug, endereco, telefone, whatsapp, status)
select c.id, x.nome, x.slug, x.endereco, x.telefone, x.whatsapp, 'aprovada'
from cidades c
join (values
  ('Norte Motors', 'norte-motors', 'Rua XV de Novembro, 1200 - Centro', '(47) 3422-1000', '5547999990000'),
  ('AutoCenter Joinville', 'autocenter-joinville', 'Av. José Vieira, 300 - América', '(47) 3433-2000', '5547999991111'),
  ('Costa & Filhos Veículos', 'costa-filhos-veiculos', 'Rua Blumenau, 555 - Bucarein', '(47) 3444-3000', '5547999992222')
) as x(nome, slug, endereco, telefone, whatsapp) on true
where c.slug = 'joinville-sc'
on conflict (slug) do nothing;

-- VEÍCULOS ---------------------------------------------------------------
-- 1) T-Cross — Norte Motors
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2022, 2023, 18400, 118900, 'Flex', 'Automático', 'Branco', 4, 'SUV',
  'Veículo único dono, revisões em dia, todo o histórico de manutenção disponível.', 'ativo', 't-cross-200-tsi-2023-norte-motors'
from revendas r, modelos mo
where r.slug = 'norte-motors' and mo.nome = 'T-Cross 200 TSI'
on conflict (slug) do nothing;

-- 2) Argo — AutoCenter Joinville
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2021, 2021, 32100, 68900, 'Flex', 'Manual', 'Prata', 4, 'Hatch',
  'Ótimo custo-benefício, ideal para o dia a dia na cidade.', 'ativo', 'argo-drive-1-3-2021-autocenter-joinville'
from revendas r, modelos mo
where r.slug = 'autocenter-joinville' and mo.nome = 'Argo Drive 1.3'
on conflict (slug) do nothing;

-- 3) Onix Plus — Costa & Filhos
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2023, 2023, 9800, 92500, 'Flex', 'Automático', 'Cinza', 4, 'Sedã',
  'Praticamente zero km, garantia de fábrica vigente.', 'ativo', 'onix-plus-ltz-2023-costa-filhos'
from revendas r, modelos mo
where r.slug = 'costa-filhos-veiculos' and mo.nome = 'Onix Plus LTZ'
on conflict (slug) do nothing;

-- 4) Hilux — Norte Motors
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2020, 2021, 54200, 219900, 'Diesel', 'Automático', 'Preto', 4, 'Picape',
  'Tração 4x4, pacote SRV completo, pneus novos.', 'ativo', 'hilux-srv-2-8-2021-norte-motors'
from revendas r, modelos mo
where r.slug = 'norte-motors' and mo.nome = 'Hilux SRV 2.8'
on conflict (slug) do nothing;

-- 5) HB20 — AutoCenter Joinville
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2022, 2022, 21000, 74900, 'Flex', 'Manual', 'Vermelho', 4, 'Hatch',
  'Baixa quilometragem, revisado na concessionária.', 'ativo', 'hb20-comfort-2022-autocenter-joinville'
from revendas r, modelos mo
where r.slug = 'autocenter-joinville' and mo.nome = 'HB20 Comfort'
on conflict (slug) do nothing;

-- 6) Compass — Costa & Filhos
insert into veiculos (revenda_id, marca_id, modelo_id, versao, ano_fab, ano_modelo, km, preco, combustivel, cambio, cor, portas, categoria, descricao, status, slug)
select r.id, mo.marca_id, mo.id, null, 2021, 2022, 38700, 138500, 'Flex', 'Automático', 'Branco', 4, 'SUV',
  'Completo, bancos em couro, teto solar.', 'ativo', 'compass-longitude-2022-costa-filhos'
from revendas r, modelos mo
where r.slug = 'costa-filhos-veiculos' and mo.nome = 'Compass Longitude'
on conflict (slug) do nothing;

-- FOTOS (uma foto de capa por veículo, usando as mesmas imagens do protótipo) ---
insert into veiculo_fotos (veiculo_id, url, ordem)
select v.id, x.url, 0
from veiculos v
join (values
  ('t-cross-200-tsi-2023-norte-motors', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop'),
  ('argo-drive-1-3-2021-autocenter-joinville', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'),
  ('onix-plus-ltz-2023-costa-filhos', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800&auto=format&fit=crop'),
  ('hilux-srv-2-8-2021-norte-motors', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'),
  ('hb20-comfort-2022-autocenter-joinville', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop'),
  ('compass-longitude-2022-costa-filhos', 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=800&auto=format&fit=crop')
) as x(slug, url) on x.slug = v.slug
on conflict do nothing;

-- BANNERS DO HERO --------------------------------------------------------
insert into banners_hero (ordem, imagem_url, eyebrow, titulo, subtitulo, texto_botao, link_botao, ativo)
values
  (0, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop',
   'REVENDAS DE JOINVILLE, EM UM SÓ LUGAR', 'Seu próximo carro está aqui perto.',
   'Anúncios direto das revendas cadastradas na sua cidade — sem cadastro de particular, sem intermediário.',
   null, null, true),
  (1, 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1600&auto=format&fit=crop',
   'PRA QUEM TEM REVENDA', 'Coloque sua revenda na vitrine certa.',
   'Cadastre seu estoque e apareça pra quem já está procurando carro em Joinville agora.',
   'Anunciar minha revenda', '/anuncie', true),
  (2, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1600&auto=format&fit=crop',
   'TODA SEMANA TEM NOVIDADE', 'Carros novos chegando direto das lojas.',
   'Confira os anúncios mais recentes antes que saiam do estoque.',
   'Ver destaques da semana', '/carros', true);
