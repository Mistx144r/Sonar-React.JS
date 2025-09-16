# 🎧 Sonar Frontend

Aplicativo web desenvolvido com **React.js + Vite**, que consome a **API do Sonar Backend** para oferecer uma experiência de streaming de música (nível MVP). O projeto foi feito para demonstrar habilidades em desenvolvimento frontend moderno, consumo de APIs REST, gerenciamento de estado e boas práticas em React.  

## Objetivo
O **Sonar Frontend** permite ao usuário:  
- Visualizar e gerenciar **usuários e artistas**.  
- Criar e gerenciar **playlists**.  
- Navegar por **álbuns e músicas**.  
- Ler **letras de músicas sincronizadas** em tempo real.  
- Reproduzir músicas com **player integrado**.  
- Visualizar um **mini vídeo de demonstração** de reprodução.  

> ⚡ O frontend consome a API do [Sonar Backend](https://github.com/Mistx144r/Sonar-Backend)  

---

## Índice

- [Tecnologias & Dependências](#tecnologias--dependências)  
- [Funcionalidades](#funcionalidades)  
- [Instalação e Configuração](#instalação-e-configuração)  
- [Variáveis de Ambiente](#variáveis-de-ambiente)  
- [Futuro do Projeto](#futuro-do-projeto)  
- [Contribuição](#contribuição)  
- [Autor](#autor)

- [Sonar-Front](https://github.com/Mistx144r/Sonar-React.JS/tree/main)

---

## Tecnologias & Dependências
[![My Skills](https://skillicons.dev/icons?i=react,vite,js,css,html&perline=6)](https://skillicons.dev)  

- **React.js** + **Vite**  
- **React Router** → navegação entre páginas
- **Axios** → consumo da API  
- **Tailwind** → estilização inline

> (Parte Do Projeto Esta Usando O Metodo De Fetch Com UseEffect, UseState Loading E Error, Mas Com O Tempo Vou Migrar Todos Eles Para ReactQuery.)

**Principais libs (package.json)**:  
```json
{
  "axios": "^1.6.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "vite": "^5.2.0"
}
```

---

## Funcionalidades
- **Visualização de álbuns, artistas e músicas**.  
- **Reprodução de música** com player integrado.  
- **Visualização de letras sincronizadas**.  
- **Mini vídeo demonstrativo** do player.  
- Consumo de **API REST** do [Sonar Backend](https://github.com/Mistx144r/Sonar-Backend).  

---

## Instalação e Configuração

### Pré-requisitos
- Node.js (v18+ recomendado)  
- NPM ou Yarn  

### Passo a passo
```bash
# Clone o repositório
git clone https://github.com/Mistx144r/Sonar-React.JS.git
cd Sonar-React.JS

# Instale as dependências
npm install
# ou yarn install

# Configure o arquivo .env
echo "VITE_SERVER_IP=http://localhost:3000" > .env

# Rode o frontend
npm run dev
# ou yarn dev
```

> O frontend estará disponível no endereço que o Vite fornecer, geralmente `http://localhost:5173`.

---

## Variáveis de Ambiente
```env
VITE_SERVER_IP=http://localhost:3000
```
> Endereço da API do Sonar Backend.

---

## Futuro do Projeto
Algumas melhorias planejadas para as próximas versões do frontend:  

- **Integração com Redis** → para cache de dados mais rápido e acesso a músicas e artistas mais rápido.
- **Integração OAuth** → login com provedores externos (Google, etc.).
- **Integração De Um Dashboard Para Os Artistas** → Para facilitar a adição de músicas ao Banco De Dados.

---

## Contribuição
Pull Requests são bem-vindos!  
- Abra uma PR explicando **o que mudou** e **o motivo da mudança**.  
- Mantenha o padrão de código e a organização do projeto.  

---

## Autor
**Lucas Mendonça (Mistx144)**  
- GitHub: [@Mistx144r](https://github.com/Mistx144r)  
- LinkedIn: [@lucasmendoncadev](https://www.linkedin.com/in/lucasmendoncadev/)  

### Agradecimentos
- Inspiração e referência: **Spotify** ♥
