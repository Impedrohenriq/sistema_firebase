# Sistema Firebase

Aplicação feita com Expo + React Native + Firebase para cadastro, login e gerenciamento de usuários com Firestore.

## Funcionalidades

- Login com Firebase Authentication
- Cadastro de usuário com salvamento no Firestore
- Home com dados do usuário logado
- Listagem de todos os usuários cadastrados
- Edição e exclusão de registros diretamente na Home
- Botão de sair que volta para a tela de login
- Suporte para web e mobile via Expo

## Tecnologias

- Expo SDK 55
- React Native
- React Navigation
- Firebase Authentication
- Cloud Firestore

## Estrutura do projeto

- `App.js` - ponto de entrada do app
- `src/config/firebase.js` - configuração do Firebase
- `src/navigation/AppNavigator.js` - navegação entre telas
- `src/screens/LoginScreen.js` - tela de login
- `src/screens/CadastroScreen.js` - tela de cadastro
- `src/screens/HomeScreen.js` - tela principal com listagem
- `src/services/authService.js` - funções de autenticação
- `src/services/userService.js` - funções do Firestore
- `src/components/InputField.js` - componente reutilizável de input

## Pré-requisitos

- Node.js instalado
- Expo CLI ou `npx expo`
- Um projeto criado no Firebase
- Authentication com Email/Senha ativado
- Firestore criado no Firebase

## Instalação

1. Clone o repositório.
2. Entre na pasta do projeto.
3. Instale as dependências:

```bash
npm install
```

## Execução

Para iniciar o projeto no ambiente de desenvolvimento:

```bash
npm run web
```

Outras opções:

```bash
npm run start
npm run android
npm run ios
```

## Configuração do Firebase

O projeto já usa a configuração do Firebase no arquivo `src/config/firebase.js`.

Se você quiser trocar para outro projeto Firebase, substitua os dados do objeto `firebaseConfig` pelos valores do seu projeto.

Também verifique se:

- o login por Email/Senha está ativado no Firebase Authentication
- as regras do Firestore permitem leitura e escrita na coleção `users` conforme a necessidade do app

## Fluxo do app

1. O usuário faz login ou cria uma conta.
2. O cadastro salva o usuário no Authentication e cria o perfil no Firestore.
3. A Home exibe os dados do usuário logado e lista todos os registros.
4. Cada item da lista pode ser editado ou excluído.
5. O botão de sair encerra a sessão e volta para o login.

## Observações

- Este projeto foi pensado para funcionar no web e em dispositivos móveis.
- Se a listagem de todos os usuários não aparecer, revise as regras do Firestore.
- Se o login der erro, confirme se Email/Senha está habilitado no Firebase Authentication.
