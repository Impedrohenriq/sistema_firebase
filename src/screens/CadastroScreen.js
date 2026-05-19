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
import { cadastrarPessoa } from '../services/userService';

const CadastroScreen = ({ navigation }) => {
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
    if (!senha.trim()) {
      Alert.alert('Atenção', 'O campo Senha é obrigatório.');
      return;
    }

    setCarregando(true);
    try {
      // Monta o objeto com os dados da pessoa
      const dadosPessoa = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        telefone: telefone.trim(),
        idade: idade ? parseInt(idade, 10) : null,
      };

      // Chama o service que faz addDoc() no Firestore
      const idGerado = await cadastrarPessoa(dadosPessoa);
      console.log('Pessoa cadastrada com ID:', idGerado);

      Alert.alert('Sucesso!', `"${nome}" foi cadastrado com sucesso.`, [
        {
          text: 'OK',
          // Após confirmar, volta para a listagem
          onPress: () => navigation.navigate('Listagem'),
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
      Alert.alert('Erro', 'Não foi possível cadastrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    padding: 24,
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
    marginBottom: 16,
  },
  btnCadastrar: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
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
  },
  btnVoltarTexto: {
    color: '#3F51B5',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CadastroScreen;
