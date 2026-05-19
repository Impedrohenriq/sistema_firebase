// ============================================================
// TELA DE ALTERAÇÃO (AlteracaoScreen.js)
// ============================================================
// Responsabilidades desta tela:
// - Receber os dados da pessoa via route.params
// - Pré-preencher o formulário com os dados existentes
// - Chamar atualizarPessoa() do userService (UPDATE)
// - Retornar para Listagem após salvar
//
// OPERAÇÃO FIRESTORE: UPDATE (updateDoc)
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
import { atualizarPessoa } from '../services/userService';

const AlteracaoScreen = ({ route, navigation }) => {
  // Recebe os dados da pessoa passados pela ListagemScreen
  // via navigation.navigate('Alteracao', { pessoa })
  const { pessoa } = route.params;

  // Pré-preenche o formulário com os dados existentes
  const [nome, setNome] = useState(pessoa.nome || '');
  const [email, setEmail] = useState(pessoa.email || '');
  const [senha, setSenha] = useState(pessoa.senha || '');
  const [telefone, setTelefone] = useState(pessoa.telefone || '');
  const [idade, setIdade] = useState(pessoa.idade ? String(pessoa.idade) : '');
  const [carregando, setCarregando] = useState(false);

  // ------------------------------------------------------------
  // FUNÇÃO: Salvar Alterações
  // Chama atualizarPessoa() do userService que usa updateDoc().
  // O updateDoc() atualiza APENAS os campos enviados.
  // O campo "criadoEm" NÃO é alterado.
  // ------------------------------------------------------------
  const handleAtualizar = async () => {
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
      // Monta apenas os campos que serão atualizados
      const dadosAtualizados = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        telefone: telefone.trim(),
        idade: idade ? parseInt(idade, 10) : null,
      };

      // Chama o service passando o ID e os novos dados
      await atualizarPessoa(pessoa.id, dadosAtualizados);

      Alert.alert('Sucesso!', 'Registro atualizado com sucesso.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      Alert.alert('Erro', 'Não foi possível atualizar. Tente novamente.');
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
        {/* Cabeçalho com ID do documento */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Editar Pessoa</Text>
          <Text style={styles.idTexto}>ID: {pessoa.id}</Text>
        </View>

        {/* Formulário pré-preenchido */}
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
            placeholder="Digite a senha"
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

          {/* Botão Salvar Alterações */}
          <TouchableOpacity
            style={[styles.btnSalvar, carregando && styles.btnDesabilitado]}
            onPress={handleAtualizar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnTexto}>Atualizar no Firebase</Text>
            )}
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => navigation.goBack()}
            disabled={carregando}
          >
            <Text style={styles.btnCancelarTexto}>Cancelar</Text>
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
  idTexto: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
  btnSalvar: {
    backgroundColor: '#FF9800',
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
  btnCancelar: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  btnCancelarTexto: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AlteracaoScreen;
