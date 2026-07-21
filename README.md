# Império 022 — Sistema de Gestão de Lava-Jato

Aplicativo completo de gestão para lava-jatos, com app Android (Flutter) e painel web administrativo (React + Node.js).

## Funcionalidades

### App Android (Flutter)
- Login e registro de usuários (admin / funcionário)
- Fila de veículos com status em tempo real
- Registro de ordens de serviço com fotos
- Caixa: controle de entradas e saídas
- Relatórios de faturamento (diário, semanal, mensal)
- Exportação de relatórios em PDF
- Notificações locais

### Painel Web
- Dashboard com estatísticas do dia
- Gerenciamento da fila de serviços
- Cadastro de clientes e veículos
- Relatórios financeiros por período e forma de pagamento
- Autenticação via OAuth

## Credenciais padrão (app Android)

> Altere as senhas após o primeiro acesso.

| Usuário    | Email                      | Senha        | Perfil     |
|------------|----------------------------|--------------|------------|
| Andrepita  | andrepita@imperio022.com   | Neoqeav2020! | Admin      |
| Miguel     | miguel@imperio022.com      | miguel123    | Funcionário|

## Configuração

### App Android

1. Clone o repositório e instale as dependências:
   ```bash
   flutter pub get
   ```

2. Para build de release (necessário para Play Store), configure a assinatura:
   ```bash
   # Gere o keystore (apenas uma vez)
   keytool -genkey -v -keystore android/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

   # Crie android/key.properties com:
   storePassword=<senha-do-keystore>
   keyPassword=<senha-da-chave>
   keyAlias=upload
   storeFile=../upload-keystore.jks
   ```

3. Execute o app:
   ```bash
   flutter run
   ```

### CI/CD (GitHub Actions)

Adicione os seguintes secrets no repositório:

| Secret           | Descrição                                    |
|------------------|----------------------------------------------|
| `KEYSTORE_BASE64`| Keystore codificado em base64 (`base64 -i upload-keystore.jks`) |
| `STORE_PASSWORD` | Senha do keystore                            |
| `KEY_ALIAS`      | Alias da chave (ex: `upload`)                |
| `KEY_PASSWORD`   | Senha da chave                               |

O CI roda testes (`flutter test`), análise estática (`flutter analyze`) e gera o APK automaticamente em cada push na branch `main`.

### Painel Web

1. Copie `.env.example` para `.env` e preencha as variáveis
2. Instale as dependências: `pnpm install`
3. Rode as migrações: `pnpm --filter @workspace/db run push`
4. Inicie o servidor: `pnpm --filter @workspace/api-server run dev`

## Stack

### Android
- Flutter 3.x + Dart
- SQLite local (`sqflite`)
- Provider (state management)
- PDF, Notificações locais, WhatsApp

### Web
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express 5 + tRPC
- Banco: MySQL + Drizzle ORM
- Autenticação: OAuth (sessão em cookie seguro)

## Segurança

- Senhas armazenadas com SHA-256 + salt aleatório por usuário
- Usuários antigos têm o hash migrado automaticamente no primeiro login
- Sessões web via cookie HttpOnly com CSRF protection
- Keystore de release **nunca** commitado no repositório
