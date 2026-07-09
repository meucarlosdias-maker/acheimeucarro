# Achei Meu Carro — Fase 2 (banco real + dados conectados)

## 1. Criar o projeto no Supabase
1. Acesse https://supabase.com e crie uma conta (dá pra usar login do GitHub/Google).
2. Clique em **New Project**, escolha um nome (ex: `achei-meu-carro`) e uma senha para o banco.
3. Aguarde ~2 minutos até o projeto ficar pronto.

## 2. Rodar o schema e os dados de exemplo
1. No painel do Supabase, vá em **SQL Editor**.
2. Cole o conteúdo de `db/schema.sql` e clique em **Run**.
3. Depois, cole o conteúdo de `db/seed.sql` e clique em **Run** novamente.
4. Confira em **Table Editor** se as tabelas `cidades`, `revendas`, `veiculos`, etc. foram criadas com dados.

## 3. Pegar as chaves do projeto
1. Vá em **Project Settings > API**.
2. Copie a **Project URL** e a **anon public key**.

## 4. Configurar o projeto localmente
```bash
cd achei-meu-carro
cp .env.local.example .env.local
```
Abra o `.env.local` e cole a URL e a chave que você copiou.

```bash
npm install
npm run dev
```
Acesse http://localhost:3000 — a Home já vai carregar os carros direto do seu banco Supabase.

## 5. Deploy na Vercel (quando quiser publicar)
1. Suba este projeto para um repositório no GitHub.
2. Em https://vercel.com, importe o repositório.
3. Nas configurações do projeto na Vercel, adicione as mesmas variáveis de ambiente do `.env.local`.
4. Deploy — pronto, site no ar.

## Estrutura de pastas
```
app/
  page.jsx          → Home (busca os dados no servidor)
  layout.jsx         → layout raiz, fontes, metadados
components/
  HomeClient.jsx      → toda a parte interativa (busca, filtros, carrossel)
lib/
  supabaseClient.js   → conexão com o Supabase
  queries.js          → funções que buscam veículos, marcas e banners
db/
  schema.sql          → estrutura das tabelas + regras de segurança (RLS)
  seed.sql            → dados de exemplo (Joinville, 3 revendas, 6 carros)
```

## Próximos passos (próximas fases do projeto)
- **Fase 3**: painel administrativo de cada revenda (login, cadastro de veículos, upload de fotos).
- **Fase 4**: painel master (aprovação de revendas, gestão de cidades e dos banners do Hero).
