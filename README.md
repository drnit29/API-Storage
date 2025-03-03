# API Storage

Uma aplicação para gerenciar e armazenar informações sobre APIs, incluindo serviços, chaves de API e modelos.

## Características

- Gerenciamento de serviços de API
- Armazenamento de chaves de API
- Organização de modelos por serviço
- Interface de usuário intuitiva
- Pesquisa rápida de serviços e chaves
- Banco de dados MySQL para armazenamento persistente

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Bibliotecas**: Axios, React Router, Lucide React

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL Server

### Instalação

1. Clone o repositório
   ```
   git clone https://github.com/drnit29/api-storage.git
   cd api-storage
   ```

2. Instale as dependências
   ```
   npm install
   ```

3. Configure o banco de dados MySQL
   - Crie um banco de dados chamado `u313634068_api_storage`
   - Configure as credenciais no arquivo `server/database.js`

4. Inicie o servidor e o cliente
   ```
   npm run dev
   ```

## Estrutura do Projeto

- `/src` - Código fonte do frontend
  - `/components` - Componentes React
  - `/utils` - Funções utilitárias
  - `/types` - Definições de tipos TypeScript
- `/server` - Código fonte do backend
  - `database.js` - Configuração do banco de dados
  - `routes.js` - Rotas da API
  - `index.js` - Ponto de entrada do servidor

## Uso

1. Inicie a aplicação com `npm run dev`
2. Acesse a interface web em `http://localhost:5173`
3. Use a interface para gerenciar seus serviços de API e chaves

## Licença

Este projeto está licenciado sob a licença MIT.
