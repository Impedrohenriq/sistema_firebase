import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fazerLogout, obterUsuarioAtual } from '../services/authService';
import { buscarPerfilUsuarioPorUid } from '../services/userService';

const HomeScreen = ({ navigation }) => {
  const [perfil, setPerfil] = useState(null);
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

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Home do Usuario</Text>
      <Text style={styles.subtitulo}>Dados cadastrados no Firebase</Text>

      <View style={styles.card}>
        <Text style={styles.linha}><Text style={styles.label}>Nome: </Text>{perfil?.nome || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Email: </Text>{perfil?.email || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Telefone: </Text>{perfil?.telefone || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Idade: </Text>{perfil?.idade ?? '-'}</Text>
      </View>

      <TouchableOpacity style={styles.btnCadastro} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.btnTexto}>Atualizar Cadastro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    padding: 24,
    justifyContent: 'center',
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
  },
  btnLogout: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;
