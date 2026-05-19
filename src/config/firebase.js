// ============================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================
// Este arquivo inicializa o Firebase com suas credenciais.
// Para obter essas credenciais:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto (ou use um existente)
// 3. Adicione um app Web (</> ícone)
// 4. Copie o objeto firebaseConfig gerado
// 5. Substitua os valores abaixo pelos seus
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8pavCotOuPMdzzTzb-cOSXXv984tZXLE",
  authDomain: "sistemanode.firebaseapp.com",
  projectId: "sistemanode",
  storageBucket: "sistemanode.firebasestorage.app",
  messagingSenderId: "459205323146",
  appId: "1:459205323146:web:c10d5f0cc36533f89fc073",
  measurementId: "G-PEFY0WP11C",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (banco de dados)
// getFirestore() retorna uma instância do banco de dados
export const db = getFirestore(app);

// No Web, use getAuth(app). Em React Native, use initializeAuth
// com persistência em AsyncStorage para manter o usuário logado.
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export default app;
