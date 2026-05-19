// ============================================================
// PONTO DE ENTRADA DO APP (App.js)
// ============================================================
// Este é o componente raiz do aplicativo.
// Responsável por:
// 1. Importar o GestureHandlerRootView (obrigatório para
//    @react-navigation/stack funcionar corretamente)
// 2. Renderizar o AppNavigator que gerencia todas as telas
// ============================================================

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const body = document.body;
    const html = document.documentElement;
    const root = document.getElementById('root');

    body.style.overflowY = 'auto';
    body.style.height = 'auto';
    body.style.minHeight = '100%';
    html.style.overflowY = 'auto';
    html.style.height = 'auto';
    html.style.minHeight = '100%';
    if (root) {
      root.style.height = 'auto';
      root.style.minHeight = '100vh';
      root.style.overflowY = 'auto';
      root.style.display = 'flex';
      root.style.flexDirection = 'column';
    }

    return () => {
      body.style.overflowY = '';
      body.style.height = '';
      body.style.minHeight = '';
      html.style.overflowY = '';
      html.style.height = '';
      html.style.minHeight = '';
      if (root) {
        root.style.height = '';
        root.style.minHeight = '';
        root.style.overflowY = '';
        root.style.display = '';
        root.style.flexDirection = '';
      }
    };
  }, []);

  return (
    // GestureHandlerRootView deve envolver todo o app
    // para que gestos de navegação funcionem corretamente
    <GestureHandlerRootView style={styles.flex}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minHeight: '100%',
  },
});
