import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fazerLogout, obterUsuarioAtual } from '../services/authService';
import {
  buscarPerfilUsuarioPorUid,
  listarPerfisUsuarios,
  atualizarPerfilUsuario,
  excluirPerfilUsuario,
} from '../services/userService';
import InputField from '../components/InputField';

const HomeScreen = ({ navigation }) => {
  const [perfil, setPerfil] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [emailEdicao, setEmailEdicao] = useState('');
  const [telefoneEdicao, setTelefoneEdicao] = useState('');
  const [idadeEdicao, setIdadeEdicao] = useState('');
  const [carregando, setCarregando] = useState(true);

  const carregarPerfil = useCallback(async () => {
    try {
      const usuario = obterUsuarioAtual();
      if (!usuario) {
        navigation.replace('Login');
        return;
      }
      const dados = await buscarPerfilUsuarioPorUid(usuario.uid);
      setPerfil(dados);
      const lista = await listarPerfisUsuarios();
      setUsuarios(lista);
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel carregar seu perfil.');
    } finally {
      setCarregando(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregarPerfil();
    }, [carregarPerfil])
  );

  const handleLogout = async () => {
    await fazerLogout();
    navigation.replace('Login');
  };

  const iniciarEdicao = (item) => {
    setEditandoId(item.id);
    setNomeEdicao(item.nome || '');
    setEmailEdicao(item.email || '');
    setTelefoneEdicao(item.telefone || '');
    setIdadeEdicao(item.idade ? String(item.idade) : '');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeEdicao('');
    setEmailEdicao('');
    setTelefoneEdicao('');
    setIdadeEdicao('');
  };

  const salvarEdicao = async () => {
    if (!nomeEdicao.trim() || !emailEdicao.trim()) {
      Alert.alert('Atenção', 'Nome e email são obrigatórios.');
      return;
    }

    try {
      await atualizarPerfilUsuario(editandoId, {
        nome: nomeEdicao.trim(),
        email: emailEdicao.trim().toLowerCase(),
        telefone: telefoneEdicao.trim(),
        idade: idadeEdicao ? parseInt(idadeEdicao, 10) : null,
      });

      const usuarioAtual = obterUsuarioAtual();
      const listaAtualizada = await listarPerfisUsuarios();
      setUsuarios(listaAtualizada);

      if (usuarioAtual && usuarioAtual.uid === editandoId) {
        const meuPerfil = await buscarPerfilUsuarioPorUid(usuarioAtual.uid);
        setPerfil(meuPerfil);
      }

      cancelarEdicao();
      Alert.alert('Sucesso', 'Cadastro atualizado com sucesso.');
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel atualizar este usuario.');
    }
  };

  const confirmarExclusao = (item) => {
    Alert.alert(
      'Excluir usuário',
      `Deseja excluir ${item.nome || 'este usuario'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirPerfilUsuario(item.id);
              const listaAtualizada = await listarPerfisUsuarios();
              setUsuarios(listaAtualizada);

              const usuarioAtual = obterUsuarioAtual();
              if (usuarioAtual && usuarioAtual.uid === item.id) {
                await fazerLogout();
                navigation.replace('Login');
                return;
              }

              Alert.alert('Sucesso', 'Usuario excluido com sucesso.');
            } catch (erro) {
              Alert.alert('Erro', 'Nao foi possivel excluir este usuario.');
            }
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  return (
    <ScrollView
      style={Platform.OS === 'web' ? styles.scrollWeb : null}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator
    >
      <View style={styles.contentWrap}>
      <Text style={styles.titulo}>Home do Usuario</Text>
      <Text style={styles.subtitulo}>Dados cadastrados no Firebase</Text>

      <View style={styles.card}>
        <Text style={styles.linha}><Text style={styles.label}>Nome: </Text>{perfil?.nome || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Email: </Text>{perfil?.email || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Telefone: </Text>{perfil?.telefone || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Idade: </Text>{perfil?.idade ?? '-'}</Text>
      </View>

      <Text style={styles.listagemTitulo}>Listagem (com editar e excluir)</Text>
      <View style={styles.card}>
        {usuarios.length === 0 ? (
          <Text style={styles.semDados}>Nenhum usuário cadastrado.</Text>
        ) : (
          usuarios.map((item) => (
            <View key={item.id} style={styles.itemUsuario}>
              {editandoId === item.id ? (
                <>
                  <InputField label="Nome" value={nomeEdicao} onChangeText={setNomeEdicao} placeholder="Nome" />
                  <InputField label="Email" value={emailEdicao} onChangeText={setEmailEdicao} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
                  <InputField label="Telefone" value={telefoneEdicao} onChangeText={setTelefoneEdicao} placeholder="Telefone" keyboardType="phone-pad" />
                  <InputField label="Idade" value={idadeEdicao} onChangeText={setIdadeEdicao} placeholder="Idade" keyboardType="numeric" />
                  <View style={styles.rowAcoes}>
                    <TouchableOpacity style={styles.btnSalvar} onPress={salvarEdicao}>
                      <Text style={styles.btnTexto}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnCancelar} onPress={cancelarEdicao}>
                      <Text style={styles.btnTexto}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.linha}><Text style={styles.label}>Nome: </Text>{item.nome || '-'}</Text>
                  <Text style={styles.linha}><Text style={styles.label}>Email: </Text>{item.email || '-'}</Text>
                  <Text style={styles.linha}><Text style={styles.label}>Telefone: </Text>{item.telefone || '-'}</Text>
                  <Text style={styles.linha}><Text style={styles.label}>Idade: </Text>{item.idade ?? '-'}</Text>
                  <View style={styles.rowAcoes}>
                    <TouchableOpacity style={styles.btnEditar} onPress={() => iniciarEdicao(item)}>
                      <Text style={styles.btnTexto}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnExcluir} onPress={() => confirmarExclusao(item)}>
                      <Text style={styles.btnTexto}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.btnCadastro} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.btnTexto}>Atualizar Cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnTexto}>Sair</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollWeb: {
    overflowY: 'scroll',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 36,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 620,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  listagemTitulo: {
    fontSize: 16,
    color: '#1A237E',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  semDados: {
    color: '#666',
  },
  itemUsuario: {
    borderBottomWidth: 1,
    borderBottomColor: '#E7EAF6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  linha: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  btnCadastro: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 46,
    justifyContent: 'center',
  },
  rowAcoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  btnEditar: {
    flex: 1,
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnExcluir: {
    flex: 1,
    backgroundColor: '#D84315',
    borderRadius: 8,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSalvar: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#9E9E9E',
    borderRadius: 8,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLogout: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 46,
    justifyContent: 'center',
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;
