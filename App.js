// ============================================================
// PONTO DE ENTRADA DO APP (App.js)
// ============================================================
// Este é o componente raiz do aplicativo.
// Responsável por:
// 1. Importar o GestureHandlerRootView (obrigatório para
//    @react-navigation/stack funcionar corretamente)
// 2. Renderizar o AppNavigator que gerencia todas as telas
// ============================================================

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
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
  },
});
