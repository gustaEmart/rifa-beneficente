# Rifa Beneficente - Sistema de Rifas Online

Sistema completo de gerenciamento de rifas beneficentes desenvolvido para o Hospital de Câncer de Rio Verde.

## 🎯 Sobre o Projeto

Este sistema permite:
- Gerenciar rifas beneficentes online
- Controlar vendas de números
- Administrar sorteios
- Acompanhar compradores

## 📁 Estrutura do Projeto

```
rifa-beneficente/
├── backend/          # API REST com Node.js + Express + SQLite
│   ├── src/
│   │   ├── database/     # Configuração e seed do banco
│   │   ├── middleware/   # Autenticação JWT
│   │   ├── routes/       # Endpoints da API
│   │   └── server.js     # Servidor principal
│   ├── data/             # Banco SQLite (gitignored)
│   ├── uploads/          # Imagens das rifas (gitignored)
│   └── README.md         # Documentação da API
└── README.md         # Este arquivo
```

## 🚀 Início Rápido

### Backend

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Credenciais Padrão

- **Usuário:** admin
- **Senha:** admin123

## 📚 Documentação

Para mais informações sobre a API, consulte o [README do Backend](./backend/README.md).

## 🛠️ Tecnologias

### Backend
- Node.js
- Express.js
- SQLite3 (better-sqlite3)
- JWT para autenticação
- bcryptjs para hash de senhas

## ⚠️ Security Considerations

### Current Implementation
The current implementation includes basic security features:
- JWT-based authentication
- Bcrypt password hashing
- CORS configuration
- Input validation on critical endpoints

### Recommended Improvements for Production
For a production deployment, consider adding:
- **Rate Limiting**: Implement rate limiting on authentication and API endpoints to prevent brute force attacks (e.g., using `express-rate-limit`)
- **Environment Variables**: Use proper environment variable management (never commit .env to production repos)
- **HTTPS**: Always use HTTPS in production
- **Input Sanitization**: Add additional input sanitization and validation
- **Logging**: Implement proper security logging and monitoring
- **Database Security**: Use parameterized queries (already implemented) and regular backups

## 📋 Funcionalidades

### Implementadas
- ✅ Sistema de autenticação com JWT
- ✅ CRUD completo de rifas
- ✅ Sistema de compra de números
- ✅ Controle de números disponíveis
- ✅ Seed automático do banco de dados
- ✅ API REST completa

### Endpoints Principais

- `POST /api/auth/login` - Login de usuário
- `GET /api/raffles` - Listar rifas
- `POST /api/raffles` - Criar rifa (autenticado)
- `POST /api/purchases` - Comprar número
- `GET /api/purchases/raffle/:id` - Ver números vendidos

## 📝 Licença

Este projeto foi desenvolvido para fins beneficentes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Contato

Para mais informações sobre o projeto, entre em contato através do repositório GitHub.