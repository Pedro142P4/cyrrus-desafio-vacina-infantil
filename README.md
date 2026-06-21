# Crescer em Dia

Aplicação Ionic + Angular para acompanhamento da jornada vacinal infantil. A proposta resolve o desafio com uma experiência centrada em pais e responsáveis que acompanham mais de uma criança.

## O que a solução contempla

- Acompanhamento individual de crianças da mesma família.
- Histórico vacinal com doses aplicadas, programadas, próximas do prazo e atrasadas.
- Indicadores visuais para facilitar a leitura da situação vacinal.
- Catálogo de vacinas com informações de prevenção, doses e faixa indicada.
- Campanhas de vacinação ativas e programadas por público infantil.
- Layout responsivo para desktop, tablet e mobile.

## Cenários cobertos

1. Uma criança com vacinas previstas consegue visualizar doses aplicadas e pendentes no painel.
2. Doses com data prevista ultrapassada aparecem como `Atrasada` e ganham destaque de prioridade.
3. Campanhas ativas são exibidas no painel da criança e na página de campanhas.
4. A família possui Sofia, Theo e Luna, cada um com idade, histórico e pendências diferentes.

## Stack

- Ionic Framework 8
- Angular 21
- TypeScript
- SCSS
- Dados simulados em serviço Angular, prontos para futura troca por Firestore

## Paleta obrigatória

- `#ABC270`
- `#FEC868`
- `#FDA769`
- `#473C33`

## Como executar

```bash
pnpm install
pnpm start
```

A aplicação ficará disponível em `http://127.0.0.1:4200`.

## Build de produção

```bash
pnpm build
```

Os arquivos finais serão gerados em `dist/crescer-em-dia`.

## Próximos passos possíveis

- Conectar os dados ao Firestore.
- Criar autenticação para responsáveis.
- Adicionar cadastro/edição de crianças e registros vacinais.
- Publicar no Firebase Hosting, Netlify ou Vercel.
