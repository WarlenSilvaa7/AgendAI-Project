# RotinAI

RotinAI é um assistente de rotinas pessoais que ajuda a organizar tarefas e blocos de horário.

## Desenvolvimento local

Pré-requisitos: Node.js (versão LTS) e npm.

```sh
# Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Variáveis de ambiente

A função de geração de rotinas (Supabase Functions) utiliza as seguintes variáveis de ambiente:

- `AI_GATEWAY_API_KEY` — chave da API do provedor de IA (obrigatória)
- `AI_GATEWAY_URL` — URL do endpoint de geração (opcional; caso não definida, um placeholder é usado)

Configure-as conforme seu provedor de IA preferido.

## Deploy

Empacote e faça deploy usando a sua plataforma preferida (Vercel, Netlify, Fly, etc.). Configure as variáveis de ambiente no painel da plataforma.

---

> Observação: este repositório foi limpo de referências e URLs da plataforma de scaffolding para ficar independente e pronto para manutenção local.
