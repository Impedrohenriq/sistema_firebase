// ============================================================
// SERVIÇO DE AUTENTICAÇÃO (authService.js)
// ============================================================
// Isola todas as funções relacionadas ao Login/Logout/Cadastro
// de usuários no Firebase Authentication.
//
// Métodos disponíveis:
// - cadastrarUsuario(email, senha) → Cria um novo usuário
// - fazerLogin(email, senha)       → Autentica o usuário
// - fazerLogout()                  → Desloga o usuário
// - obterUsuarioAtual()            → Retorna o usuário logado
// ============================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// ------------------------------------------------------------
// CADASTRAR USUÁRIO
// createUserWithEmailAndPassword cria um novo usuário no
// Firebase Authentication com email e senha.
// Retorna um objeto UserCredential com dados do usuário criado.
// ------------------------------------------------------------
export const cadastrarUsuario = async (email, senha) => {
  const credencial = await createUserWithEmailAndPassword(auth, email, senha);
  return credencial.user;
};

// ------------------------------------------------------------
// FAZER LOGIN
// signInWithEmailAndPassword verifica as credenciais e
// autentica o usuário. Retorna os dados do usuário logado.
// Lança erro se email/senha estiverem incorretos.
// ------------------------------------------------------------
export const fazerLogin = async (email, senha) => {
  const credencial = await signInWithEmailAndPassword(auth, email, senha);
  return credencial.user;
};

// ------------------------------------------------------------
// FAZER LOGOUT
// signOut encerra a sessão do usuário atual.
// Após o logout, auth.currentUser retorna null.
// ------------------------------------------------------------
export const fazerLogout = async () => {
  await signOut(auth);
};

// ------------------------------------------------------------
// OBTER USUÁRIO ATUAL
// Retorna o objeto do usuário atualmente autenticado,
// ou null se não houver nenhum usuário logado.
// ------------------------------------------------------------
export const obterUsuarioAtual = () => {
  return auth.currentUser;
};
