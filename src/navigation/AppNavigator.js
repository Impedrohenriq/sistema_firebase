// ============================================================
// NAVEGAÇÃO DO APP (AppNavigator.js)
// ============================================================
// Define as rotas e a pilha de telas do aplicativo.
// Utiliza Stack Navigator do React Navigation.
//
// Fluxo de navegação:
// Login → Cadastro
// Login/Cadastro → Home
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Importação das telas
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

// Opções visuais padrão para o cabeçalho de cada tela
const headerPadrao = {
  headerStyle: { backgroundColor: '#3F51B5' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: 'bold' },
};

const AppNavigator = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [verificando, setVerificando] = useState(true);

  // Verifica se já existe usuário autenticado ao iniciar o app
  // onAuthStateChanged é um listener que monitora o estado de auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUsuarioLogado(usuario);
      setVerificando(false);
    });

    // Cancela o listener quando o componente é desmontado
    return unsubscribe;
  }, []);

  // Exibe loading enquanto verifica o estado de autenticação
  if (verificando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // Define a tela inicial baseada no estado de autenticação
        initialRouteName={usuarioLogado ? 'Home' : 'Login'}
      >
        {/* Tela de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '🔥 Firebase App', ...headerPadrao }}
        />

        {/* Tela de Cadastro */}
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: 'Novo Cadastro', ...headerPadrao }}
        />

        {/* Tela Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home do Usuario', ...headerPadrao }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
  },
});

export default AppNavigator;
