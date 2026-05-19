// ============================================================
// TELA DE CADASTRO (CadastroScreen.js)
// ============================================================
// Responsabilidades desta tela:
// - Exibir formulário para criar uma nova pessoa
// - Chamar cadastrarPessoa() do userService (Firestore)
// - Opcionalmente criar conta no Authentication
// - Navegar para Listagem após o cadastro
//
// OPERAÇÃO FIRESTORE: CREATE (addDoc)
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
import { cadastrarUsuario } from '../services/authService';
import { salvarPerfilUsuario } from '../services/userService';

const CadastroScreen = ({ navigation }) => {
  const emailValidoRegex = /^\S+@\S+\.\S+$/;

  // ── Estados do formulário ─────────────────────────────────
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [carregando, setCarregando] = useState(false);

  // ------------------------------------------------------------
  // FUNÇÃO: Salvar Cadastro
  // Valida os campos obrigatórios e chama cadastrarPessoa()
  // que utiliza addDoc() do Firestore para gravar o documento.
  // ------------------------------------------------------------
  const handleCadastrar = async () => {
    // Validação: nome e email são obrigatórios
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O campo Nome é obrigatório.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Atenção', 'O campo Email é obrigatório.');
      return;
    }
    if (!emailValidoRegex.test(email.trim())) {
      Alert.alert('Atenção', 'Informe um email válido. Ex: nome@email.com');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Atenção', 'O campo Senha é obrigatório.');
      return;
    }
    if (senha.trim().length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      // Monta o objeto com os dados da pessoa
      const dadosPerfil = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        idade: idade ? parseInt(idade, 10) : null,
      };

      const usuario = await cadastrarUsuario(dadosPerfil.email, senha);
      await salvarPerfilUsuario(usuario.uid, dadosPerfil);

      Alert.alert('Sucesso!', `"${nome}" foi cadastrado com sucesso.`, [
        {
          text: 'OK',
          onPress: () => navigation.replace('Home'),
        },
      ]);

      // Limpa o formulário
      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setIdade('');
    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      let mensagem = 'Não foi possível cadastrar. Tente novamente.';
      if (erro.code === 'auth/configuration-not-found') {
        mensagem = 'Ative Email/Senha no Firebase Authentication e autorize localhost.';
      }
      if (erro.code === 'auth/email-already-in-use') {
        mensagem = 'Este email já está em uso. Tente outro email.';
      }
      if (erro.code === 'auth/invalid-email') {
        mensagem = 'Email inválido.';
      }
      if (erro.code === 'auth/weak-password') {
        mensagem = 'Senha fraca. Use pelo menos 6 caracteres.';
      }
      if (erro.code === 'permission-denied') {
        mensagem = 'Sem permissao no Firestore. Ajuste as regras da colecao users.';
      }
      Alert.alert('Erro', mensagem);
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
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 36 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <View style={styles.contentWrap}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Nova Pessoa</Text>
          <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>
        </View>

        {/* Formulário de Cadastro */}
        <View style={styles.formulario}>
          <InputField
            label="Nome *"
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo"
          />
          <InputField
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Senha *"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite uma senha"
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.btnCadastrar, carregando && styles.btnDesabilitado]}
            onPress={handleCadastrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnTexto}>Enviar para o Firebase</Text>
            )}
          </TouchableOpacity>

          {/* Botão Voltar */}
          <TouchableOpacity
            style={styles.btnVoltar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnVoltarTexto}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.opcionalTitulo}>Campos opcionais</Text>

          <InputField
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />
          <InputField
            label="Idade"
            value={idade}
            onChangeText={setIdade}
            placeholder="Ex: 25"
            keyboardType="numeric"
          />

          <Text style={styles.obrigatorio}>* Campos obrigatórios</Text>
        </View>
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
    alignItems: 'center',
    padding: 24,
    paddingTop: 28,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 620,
  },
  header: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
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
  },
  obrigatorio: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  opcionalTitulo: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  btnCadastrar: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
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
  btnVoltar: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3F51B5',
    minHeight: 46,
    justifyContent: 'center',
  },
  btnVoltarTexto: {
    color: '#3F51B5',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CadastroScreen;
