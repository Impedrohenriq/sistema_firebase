// ============================================================
// SERVIÇO DE USUÁRIOS - CRUD COMPLETO (userService.js)
// ============================================================
// Este arquivo isola TODAS as operações com o Firestore.
// Cada função representa uma operação CRUD separada:
//
// CREATE → cadastrarPessoa()
// READ   → listarPessoas() / buscarPessoaPorId()
// UPDATE → atualizarPessoa()
// DELETE → excluirPessoa()
//
// Coleção no Firestore: "pessoas"
// ============================================================

import {
  collection,    // Referência para uma coleção
  doc,           // Referência para um documento específico
  addDoc,        // Adiciona um novo documento (gera ID automático)
  getDocs,       // Busca todos os documentos de uma coleção
  getDoc,        // Busca um documento específico pelo ID
  updateDoc,     // Atualiza campos de um documento existente
  deleteDoc,     // Exclui um documento pelo ID
  orderBy,       // Ordena os resultados
  query,         // Cria uma consulta com filtros
  setDoc,
  serverTimestamp, // Timestamp do servidor Firebase
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Nome da coleção no Firestore
const COLECAO = 'pessoas';

// ------------------------------------------------------------
// CREATE - CADASTRAR PESSOA
// addDoc() adiciona um novo documento na coleção "pessoas".
// O ID é gerado automaticamente pelo Firestore.
// serverTimestamp() insere a data/hora do servidor.
// Retorna o ID gerado do novo documento.
// ------------------------------------------------------------
export const cadastrarPessoa = async (dados) => {
  const colecaoRef = collection(db, COLECAO);
  const docRef = await addDoc(colecaoRef, {
    ...dados,
    criadoEm: serverTimestamp(),
  });
  return docRef.id;
};

// ------------------------------------------------------------
// READ - LISTAR TODAS AS PESSOAS
// getDocs() busca todos os documentos da coleção.
// query() + orderBy() ordena pelo campo "nome" (A→Z).
// Retorna um array de objetos { id, ...dados }.
// ------------------------------------------------------------
export const listarPessoas = async () => {
  const colecaoRef = collection(db, COLECAO);
  const consulta = query(colecaoRef, orderBy('nome'));
  const snapshot = await getDocs(consulta);

  // Mapeia cada documento para { id, ...campos }
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ------------------------------------------------------------
// READ - BUSCAR PESSOA POR ID
// getDoc() busca um único documento pelo seu ID.
// Retorna null se o documento não existir.
// ------------------------------------------------------------
export const buscarPessoaPorId = async (id) => {
  const docRef = doc(db, COLECAO, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() };
};

// ------------------------------------------------------------
// UPDATE - ATUALIZAR PESSOA
// updateDoc() atualiza APENAS os campos informados no objeto.
// Campos não informados permanecem inalterados no Firestore.
// atualizadoEm registra quando a última alteração ocorreu.
// ------------------------------------------------------------
export const atualizarPessoa = async (id, dados) => {
  const docRef = doc(db, COLECAO, id);
  await updateDoc(docRef, {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
};

// ------------------------------------------------------------
// DELETE - EXCLUIR PESSOA
// deleteDoc() remove permanentemente o documento pelo ID.
// Esta operação é irreversível.
// ------------------------------------------------------------
export const excluirPessoa = async (id) => {
  const docRef = doc(db, COLECAO, id);
  await deleteDoc(docRef);
};

// ------------------------------------------------------------
// PERFIL DO USUÁRIO LOGADO (coleção: users)
// ------------------------------------------------------------
export const salvarPerfilUsuario = async (uid, dados) => {
  const docRef = doc(db, 'users', uid);
  await setDoc(
    docRef,
    {
      ...dados,
      atualizadoEm: serverTimestamp(),
      criadoEm: serverTimestamp(),
    },
    { merge: true }
  );
};

export const buscarPerfilUsuarioPorUid = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const listarPerfisUsuarios = async () => {
  const colecaoRef = collection(db, 'users');
  const consulta = query(colecaoRef, orderBy('nome'));
  const snapshot = await getDocs(consulta);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const atualizarPerfilUsuario = async (uid, dados) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
};

export const excluirPerfilUsuario = async (uid) => {
  const docRef = doc(db, 'users', uid);
  await deleteDoc(docRef);
};
