// ============================================================
// TELA DE LOGIN (LoginScreen.js)
// ============================================================
// Responsabilidades desta tela:
// - Receber email e senha do usuário
// - Chamar fazerLogin() do authService
// - Em caso de sucesso → navegar para ListagemScreen
// - Em caso de erro → exibir mensagem de alerta
//
// O estado do formulário é controlado com useState.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import InputField from '../components/InputField';
import { fazerLogin } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const emailValidoRegex = /^\S+@\S+\.\S+$/;

  // Estado dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado de carregamento (mostra spinner durante a requisição)
  const [carregando, setCarregando] = useState(false);

  // ------------------------------------------------------------
  // FUNÇÃO: Realizar Login
  // Chama fazerLogin() do authService com email e senha.
  // Se bem-sucedido, navega para a Listagem.
  // Se falhar, exibe uma mensagem de erro amigável.
  // ------------------------------------------------------------
  const handleLogin = async () => {
    // Validação básica dos campos
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha para continuar.');
      return;
    }
    if (!emailValidoRegex.test(email.trim())) {
      Alert.alert('Atenção', 'Informe um email válido. Ex: nome@email.com');
      return;
    }
    if (senha.trim().length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await fazerLogin(email.trim(), senha);
      // Navega para Home e remove a tela de Login da pilha
      navigation.replace('Home');
    } catch (erro) {
      // Traduz códigos de erro do Firebase para mensagens amigáveis
      let mensagem = 'Erro ao fazer login. Tente novamente.';
      if (erro.code === 'auth/user-not-found') mensagem = 'Usuário não encontrado.';
      if (erro.code === 'auth/wrong-password') mensagem = 'Senha incorreta.';
      if (erro.code === 'auth/invalid-email') mensagem = 'Email inválido.';
      if (erro.code === 'auth/too-many-requests') mensagem = 'Muitas tentativas. Aguarde e tente novamente.';
      if (erro.code === 'auth/configuration-not-found') mensagem = 'Ative Email/Senha no Firebase Authentication e autorize localhost.';
      Alert.alert('Erro no Login', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <View style={styles.contentWrap}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>🔥 Firebase App</Text>
          <Text style={styles.subtitulo}>Faça login para continuar</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formulario}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Botão de Login */}
          <TouchableOpacity
            style={[styles.btnLogin, carregando && styles.btnDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnTexto}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Link para Cadastro */}
        <TouchableOpacity
          style={styles.linkCadastro}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.linkTexto}>Não tem conta? Cadastre-se aqui</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollWeb: {
    overflowY: 'scroll',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 520,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
  },
  formulario: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  btnLogin: {
    backgroundColor: '#3F51B5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
  },
  btnDesabilitado: {
    opacity: 0.6,
  },
  btnTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkCadastro: {
    alignItems: 'center',
    padding: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  linkTexto: {
    color: '#3F51B5',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
