# Gympass App - Desafio Fullstack

🎆🎉🎆🎉🎆**Feliz ano novo e boas festas** 🎆🎉🎆🎉🎆



Este é um projeto desenvolvido como parte de um desafio técnico Fullstack. O objetivo foi criar um aplicativo para gestão de check-ins de academias, simulando um sistema como o Gympass, que permite o uso de academias por meio de assinatura.

**Você pode ver esse app em produção aqui:** https://angeloabrita.github.io/gympass-app/


## Funcionalidades

O aplicativo implementa as seguintes funcionalidades:

*   **Autenticação:**
    *   Cadastro de usuário com nome, email e senha.
    *   Autenticação de usuário usando email e senha.
    *   Identificação de usuário por meio de JWT.
*   **Gerenciamento de Academias:**
    *   Cadastro de academias (Nome, Descrição, Telefone, Latitude e Longitude), apenas por administradores.
    *   Listagem de academias com paginação (20 itens por página).
    *   Busca de academias por nome.
*   **Check-ins:**
    *   Realização de check-in em uma academia.
    *   Histórico de check-ins do usuário.
*   **Perfil de Usuário:**
    *   Obtenção do perfil do usuário logado (nome, email e id).
*    **Permissões e controle**
  * Usuários admin e usuário comum para criar academias, e gerenciar roles para outro users
   * **um admin padrão criado com as seguinte props** `id=1, email:"admin@gympass.com", name="Admin User",  role = 'admin' password ='admin123'`


## Regras de Negócio (RN)

*   O usuário não pode se cadastrar com um e-mail duplicado.
*   O usuário não pode fazer 2 check-ins no mesmo dia.
*   A academia só pode ser cadastrada por administradores.
*   Usuário  por padrão é do tipo user e seu role deve ser modificado somente pelos admin da aplicação
  * Todos usuários usam  `token` do `JSON web token (JWT)` com seu response das proprias req  e props para ter controle nas paginas  (em conjunto localStorage , contexts da authenticaçao, `id` , `email`,`name`  e   `roles`.
*  O projeto foi implementado para sempre persistir user na local store caso nao use uma das actions `/auth`
## Requisitos Não Funcionais (RNF)

*   A senha do usuário é criptografada com `bcryptjs`.
*   As listas de dados são paginadas com 20 itens por página.
*   O usuário é identificado por um JWT (simulação básica de JWT utilizando assinatura  do formato header.payload.secret ), o jwt  também armazena no localstore os props (id email role) em todos requests no formato padrao. O id , email,  e props do objeto  do response(user, name etc) do servidor também são passados pelas actions da interface via props .
   

## Tecnologias Utilizadas

*   **Frontend:**
    *   ReactJS
    *   React Router DOM
    *   React Bootstrap
    *    React-Leaflet (Maps)
    * `customize-cra react-app-rewired` - Modificar config default de CreateReactApp
   *`jwt-decode`,
    *   `bcrypt-react`: Criptografia de senhas
     * `process` : módulo usado para bibliotecas principais do webpack (crypto, buffer etc.) e ajuda polyfil da implementação antiga do webpack em versões antigas do navegador (navegador ou celular ou outras plataformas)
   * `buffer`, `crypto-browserify`,`stream-browserify`, `util`: Lib usada para garantir compatibilidade no navegador (core libs do nodeJs) e versões antigas de lib com polyfill para criar aplicativos baseados no framework react
* `semver`,` randomfill`,` process-nextick-args`,`pbkdf2`,`readable-stream`,`jws`,`jwa`,`safe-buffer` libs internas para suporte
* `alasql`: Simulação de banco de dados (inMemory database) para testar requisitos de projeto de api, paginação e outras lógicas como recursos SQL.
*  Node, React app , Html,Css , Json , js  core concepts

## Como Executar

1.  Clone este repositório:

   ```bash
        git clone https://github.com/Angeloabrita/gympass-app.git
   ```
    

2.  Acesse a pasta do projeto:

  ```bash
   cd gympass-app
   ```

3. Instale as dependências:

```bash
 npm install
```

4. Execute o projeto em modo desenvolvimento

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

*   `src/components/`: Componentes reutilizáveis da interface (AuthForm, GymCard, LoadingSpinner, Pagination e NavBar).
*   `src/contexts/`: Contexto para gerenciamento de estado de autenticação (`AuthContext`).
*  `src/hooks/`: Hooks personalizados (`useAuth`).
*  `src/pages/`: Componentes que fazem rota , cada um representa suas telas principais da aplicacão (`AuthPage`,  `DashboardPage`,`ProfilePage`, `GymDetailPage`  , `CreateGymPage`). `HomePage ( land page  com rota por /).`
*   `src/services/`: Simulações do backend. (`api.js `e  `db.js ( para acesso ao banco)`,  responsável pelas regras de negócios e acessos as models por props
* `src/utils`:  utils (`jwt`) usado para criar jwt payload e simular token e segurança, para evitar problemas complexos de outras bibliotecas complexas e seguir valores essenciais como simplicidade no núcleo para criar tokens para autenticação (no texto formatado 'header.payload.signature'.)

* **Arquivo `package.json`** Para todos seus scripts com requisições da aplicação, e dependencies usadas nesse projecto
**Arquivos Adicionais:**

 *   `App.js`, `index.js`,  Arquivos principal da API do react para rodar a aplicação.
   *`app.css`: Folha principal que tem os style e layouts para  o layout em todo o projeto (em diferentes areas responsivo com classes reutilizadas).

## Próximos Passos

*  Implementar  test unit, testes integração
   * Impletamentação de validacão com yup.


## Autor
Angelo Abrita: 

resume: https://angeloabrita.github.io/resume/ 

Linkedin: https://www.linkedin.com/in/angelo-gabriel-tavares-abrita/