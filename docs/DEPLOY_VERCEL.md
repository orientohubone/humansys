# Deploy no Vercel

## Arquitetura usada
- Frontend: Vite (saída em `dist/public`)
- Backend: Express em função serverless (`api/[...all].ts`) para atender `/api/*`

## Pré-requisitos
- Repositório no GitHub
- Conta no Vercel conectada ao GitHub
- Banco PostgreSQL em produção (URL pública)

## Variáveis de ambiente (Vercel)
Configurar em `Project Settings > Environment Variables`:

- `DATABASE_URL` (obrigatória)
- `ANTHROPIC_API_KEY` (obrigatória para recursos de IA Anthropic)
- `NODE_ENV=production`

Opcional:
- `VITE_API_URL` (deixe vazio para usar mesmo domínio em produção)

## Build e output
O projeto já está configurado com:
- `buildCommand`: `npm run build:client`
- `outputDirectory`: `dist/public`
- `functions`: `api/[...all].ts` (Node.js 20)

## Deploy
1. Importar o repositório no Vercel.
2. Confirmar que o arquivo `vercel.json` foi detectado.
3. Configurar as variáveis de ambiente.
4. Clicar em **Deploy**.

## Pós-deploy (checklist)
1. Abrir `/api/health` e validar resposta `200`.
2. Testar login.
3. Testar página `/app/onboarding`.
4. Validar navegação com dark mode.

## Observações
- Pasta `uploads/` em Vercel é efêmera (não persistente). Para produção, usar storage externo (ex.: S3, Supabase Storage, GCS).
