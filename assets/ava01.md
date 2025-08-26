# Avaliação Prática 01: CRUD Fullstack - Gerenciador de Estoque

**Disciplina:** Desenvolvimento de Aplicações Móveis  
**Professor(a):** Airton Lima Marinho
**Data de Entrega:** 23/08/2025
**Repositório:** `ava01`

---

## Objetivo

Desenvolver uma aplicação **fullstack** para um "Gerenciador de Estoque" de produtos. A aplicação deverá permitir ao usuário realizar as quatro operações básicas do **CRUD (Create, Read, Update, Delete)** através de uma interface mobile em React Native, consumindo dados de uma API REST criada com Node.js e Express.

## Funcionalidades Obrigatórias

-   **Listagem de Produtos (Read):** A tela inicial deve exibir todos os produtos cadastrados, mostrando seu nome, quantidade e preço.
-   **Adição de Produto (Create):** O usuário deve poder navegar para uma nova tela e, através de um formulário, adicionar um novo produto ao estoque.
-   **Edição de Produto (Update):** A partir da lista, o usuário deve poder selecionar um produto para editar suas informações em uma tela de formulário pré-preenchida.
-   **Exclusão de Produto (Delete):** O usuário deve poder remover um produto do estoque diretamente da tela de listagem, com uma caixa de diálogo para confirmação.

## Especificações Técnicas

### 1. Backend (API)
-   O projeto deve estar em uma pasta chamada `api-estoque`.
-   A API deve gerenciar uma lista de produtos.
-   **Estrutura do Objeto `produto`:**
    > 
    > {
    >   "id": 1678912345,
    >   "nome": "Teclado Mecânico",
    >   "quantidade": 25,
    >   "preco": 350.50
    > }
    >
-   **Rotas Obrigatórias:**
    -   `GET /produtos`: Retorna a lista completa de produtos.
    -   `GET /produtos/:id`: Retorna os dados de um único produto.
    -   `POST /produtos`: Adiciona um novo produto. Recebe `nome`, `quantidade` e `preco` no `req.body`.
    -   `PUT /produtos/:id`: Atualiza um produto. Recebe `nome`, `quantidade` e `preco` no `req.body`.
    -   `DELETE /produtos/:id`: Remove um produto da lista.

### 2. Frontend (Aplicativo)
-   O projeto deve estar em uma pasta chamada `app-estoque`.
-   **Navegação:**
    -   Utilizar **React Navigation** (`StackNavigator`).
    -   Deve conter no mínimo 3 telas: `ListaProdutosScreen`, `AddProdutoScreen`, `EditProdutoScreen`.
-   **Tela de Listagem (`ListaProdutosScreen`):**
    -   Buscar e exibir os dados da API com `useEffect` e `axios`.
    -   Renderizar a lista com o componente `<FlatList>`.
    -   Cada item deve ter botões para "Editar" e "Excluir".
    -   Deve haver um botão principal para navegar para a tela de "Adicionar Produto".
    -   A lista deve ser atualizada automaticamente após qualquer operação de C, U ou D.
-   **Telas de Formulário (`AddProdutoScreen` e `EditProdutoScreen`):**
    -   Usar componentes `<TextInput>` para os campos.
    -   Utilizar a propriedade `keyboardType="numeric"` para os campos de `quantidade` e `preco`.
    -   A tela de edição deve receber o `id` do produto via parâmetro de navegação.

## Como Executar o Projeto

Para testar a aplicação, ambos os servidores (backend e frontend) precisam estar rodando simultaneamente.

### API - `api-estoque`
1.  Abra um terminal e navegue até a pasta da API:
    
    cd api-estoque
    

2.  Inicie o servidor:
    
    node index.js
    
    O terminal deve exibir a mensagem `Servidor da API... rodando...`. Deixe este terminal aberto.

### App - `app-estoque`
1.  Abra um **segundo terminal** e navegue até a pasta do aplicativo:

    cd app-estoque
 
2.  Inicie o servidor do Expo:

    npx expo start

3.  Escaneie o QR Code com o aplicativo Expo Go no seu celular.



## Instruções de Entrega

-   Faça o `commit` de todo o seu código para este repositório `ava01`.
-   Garanta que as pastas `api-estoque` e `app-estoque` estejam na raiz do repositório.
-   A entrega será a versão final presente na `branch main` na data e horário estipulados.
-   Não inclua a pasta `node_modules` nos commits (utilize um arquivo `.gitignore`).
-   Envie o link do repositório `ava01` no sigaa
