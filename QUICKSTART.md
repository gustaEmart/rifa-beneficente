# Guia de Início Rápido - Rifa Beneficente

## 🎯 O que foi implementado?

Este PR adiciona **TODO o código backend** do sistema de rifas beneficentes, que estava completamente vazio.

### ✅ Arquivos Criados

**Configuração:**
- `backend/package.json` - Dependências e scripts
- `backend/.env` - Variáveis de ambiente
- `backend/.env.example` - Template de configuração
- `backend/.gitignore` - Arquivos ignorados pelo Git

**Código Backend:**
- `backend/src/server.js` - Servidor Express principal
- `backend/src/database/init.js` - Inicialização do banco SQLite
- `backend/src/database/seed.js` - Dados de exemplo
- `backend/src/middleware/auth.js` - Autenticação JWT
- `backend/src/routes/auth.js` - Endpoints de autenticação
- `backend/src/routes/raffles.js` - CRUD de rifas
- `backend/src/routes/purchases.js` - Gerenciamento de compras

**Documentação:**
- `README.md` - Visão geral do projeto
- `backend/README.md` - Documentação completa da API
- `SECURITY.md` - Considerações de segurança

## 🚀 Como Testar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```
Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

### 3. Testar a API

O servidor estará rodando em `http://localhost:3001`

#### Verificar Saúde do Servidor
```bash
curl http://localhost:3001/api/health
```

#### Fazer Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Listar Rifas
```bash
curl http://localhost:3001/api/raffles
```

#### Comprar um Número
```bash
curl -X POST http://localhost:3001/api/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "raffle_id": 1,
    "buyer_name": "João Silva",
    "buyer_phone": "(62) 99999-9999",
    "buyer_email": "joao@email.com",
    "number": 123
  }'
```

## 📊 Dados de Exemplo

O sistema é automaticamente populado com:
- **1 usuário admin**: username=`admin`, password=`admin123`
- **3 rifas de exemplo** com sorteios em 30, 60 e 90 dias
- **10 compras de exemplo** na primeira rifa

## 🗄️ Banco de Dados

O banco de dados SQLite é criado automaticamente em `backend/data/rifas.db`

**Tabelas:**
- `users` - Usuários do sistema
- `raffles` - Rifas cadastradas
- `purchases` - Números vendidos

## 📋 Endpoints Principais

### Públicos
- `GET /api/health` - Status do servidor
- `POST /api/auth/login` - Login
- `GET /api/raffles` - Listar rifas
- `GET /api/raffles/:id` - Detalhes de uma rifa
- `POST /api/purchases` - Comprar número
- `GET /api/purchases/raffle/:id` - Ver números vendidos

### Autenticados (requer token JWT)
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/raffles` - Criar rifa
- `PUT /api/raffles/:id` - Atualizar rifa
- `DELETE /api/raffles/:id` - Deletar rifa
- `GET /api/purchases` - Listar todas as compras
- `DELETE /api/purchases/:id` - Deletar compra

## 🔐 Segurança

### Recursos Implementados
- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Proteção contra SQL injection
- ✅ CORS configurado
- ✅ Validação de entrada

### Para Produção
Antes de colocar em produção, **você DEVE**:
1. Gerar um JWT_SECRET único: `openssl rand -base64 32`
2. Implementar rate limiting (veja `SECURITY.md`)
3. Usar HTTPS
4. Alterar a senha do admin

Consulte `SECURITY.md` para mais detalhes.

## 📦 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Multer 2.0** - Upload de arquivos (sem vulnerabilidades)

## ✨ Próximos Passos

1. **Frontend**: Criar interface web (React, Vue, ou similar)
2. **Deploy**: Configurar servidor de produção
3. **Segurança**: Implementar rate limiting
4. **Features**: Adicionar notificações, pagamento online, etc.

## 🤝 Contribuindo

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação em `backend/README.md`
- Veja considerações de segurança em `SECURITY.md`

---

**Desenvolvido para o Hospital de Câncer de Rio Verde** ❤️
