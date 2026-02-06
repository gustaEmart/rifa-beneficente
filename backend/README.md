# Rifa Beneficente - Backend API

Sistema de gerenciamento de rifas beneficentes para o Hospital de Câncer de Rio Verde.

## Requisitos

- Node.js 18+ (recomendado)
- npm ou yarn

## Instalação

```bash
cd backend
npm install
```

## Configuração

O arquivo `.env` já está configurado com valores padrão:

```
PORT=3001
JWT_SECRET=hospital-cancer-rv-secret-key-2024
JWT_EXPIRES_IN=24h
```

## Execução

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Seed do Banco de Dados
O banco de dados é automaticamente populado na primeira execução. Para repopular manualmente:
```bash
npm run seed
```

## Credenciais Padrão

- **Username:** admin
- **Password:** admin123

## Estrutura do Banco de Dados

### Tabela `users`
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT - bcrypt hash)
- name (TEXT)
- created_at (DATETIME)

### Tabela `raffles`
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- images (TEXT - JSON array)
- price_per_number (REAL)
- total_numbers (INTEGER)
- draw_date (DATETIME)
- status (TEXT - 'active', 'completed', 'cancelled')
- winner_number (INTEGER)
- winner_name (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

### Tabela `purchases`
- id (INTEGER PRIMARY KEY)
- raffle_id (INTEGER - FK)
- buyer_name (TEXT)
- buyer_phone (TEXT)
- buyer_email (TEXT)
- number (INTEGER)
- created_at (DATETIME)
- UNIQUE(raffle_id, number)

## Endpoints da API

### Autenticação

#### POST `/api/auth/login`
Login de usuário
```json
{
  "username": "admin",
  "password": "admin123"
}
```
Resposta:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador"
  }
}
```

#### GET `/api/auth/me`
Obter informações do usuário autenticado (requer token)

### Rifas

#### GET `/api/raffles`
Listar todas as rifas (público)
- Query params: `status` (opcional) - 'active', 'completed', 'cancelled'

#### GET `/api/raffles/:id`
Obter detalhes de uma rifa específica (público)

#### POST `/api/raffles`
Criar nova rifa (requer autenticação)
```json
{
  "title": "Título da Rifa",
  "description": "Descrição detalhada",
  "images": ["/uploads/image.jpg"],
  "price_per_number": 10.0,
  "total_numbers": 1000,
  "draw_date": "2024-12-31T23:59:59Z"
}
```

#### PUT `/api/raffles/:id`
Atualizar rifa (requer autenticação)

#### DELETE `/api/raffles/:id`
Deletar rifa (requer autenticação)

### Compras

#### GET `/api/purchases/raffle/:raffleId`
Listar todas as compras de uma rifa (público)

#### POST `/api/purchases`
Criar nova compra (público)
```json
{
  "raffle_id": 1,
  "buyer_name": "João Silva",
  "buyer_phone": "(62) 99999-9999",
  "buyer_email": "joao@email.com",
  "number": 123
}
```

#### GET `/api/purchases/:id`
Obter detalhes de uma compra (requer autenticação)

#### GET `/api/purchases`
Listar todas as compras (requer autenticação)

#### DELETE `/api/purchases/:id`
Deletar compra (requer autenticação)

### Saúde

#### GET `/api/health`
Verificar status do servidor

#### GET `/`
Informações da API

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. 

Para acessar endpoints protegidos, inclua o token no header:
```
Authorization: Bearer seu-token-jwt
```

## CORS

O servidor está configurado para aceitar requisições de `http://localhost:5173` (frontend Vite/React padrão).

## Arquivos e Diretórios

```
backend/
├── src/
│   ├── database/
│   │   ├── init.js          # Inicialização do banco
│   │   └── seed.js          # Dados de exemplo
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── auth.js          # Rotas de autenticação
│   │   ├── raffles.js       # Rotas de rifas
│   │   └── purchases.js     # Rotas de compras
│   └── server.js            # Servidor Express
├── data/                    # Banco de dados SQLite (gitignored)
├── uploads/                 # Arquivos de upload (gitignored)
├── .env                     # Variáveis de ambiente
├── .gitignore
└── package.json
```

## Tecnologias Utilizadas

- **Express.js** - Framework web
- **better-sqlite3** - Banco de dados SQLite
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variáveis de ambiente
- **multer** - Upload de arquivos
