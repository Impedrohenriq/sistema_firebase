// ============================================================
// TELA DE LISTAGEM (ListagemScreen.js)
// ============================================================
// Responsabilidades desta tela:
// - Listar todas as pessoas do Firestore (READ)
// - Permitir excluir uma pessoa (DELETE)
// - Navegar para AlteracaoScreen ao clicar em Editar
// - Navegar para CadastroScreen para novo cadastro
// - Fazer logout do usuário
//
// OPERAÇÕES FIRESTORE: READ (getDocs) + DELETE (deleteDoc)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPessoas, excluirPessoa } from '../services/userService';
import { fazerLogout } from '../services/authService';

const ListagemScreen = ({ navigation }) => {
  const [pessoas, setPessoas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ------------------------------------------------------------
  // FUNÇÃO: Carregar Pessoas
  // Chama listarPessoas() do userService que usa getDocs().
  // useFocusEffect garante que a lista seja recarregada sempre
  // que a tela receber foco (ao voltar de outra tela).
  // ------------------------------------------------------------
  const carregarPessoas = useCallback(async () => {
    try {
      const lista = await listarPessoas();
      setPessoas(lista);
    } catch (erro) {
      console.error('Erro ao carregar pessoas:', erro);
      Alert.alert('Erro', 'Não foi possível carregar os registros.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega a lista sempre que esta tela fica em foco
  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      carregarPessoas();
    }, [carregarPessoas])
  );

  // ------------------------------------------------------------
  // FUNÇÃO: Excluir Pessoa
  // Chama excluirPessoa() do userService que usa deleteDoc().
  // Após excluir, remove o item da lista local (sem recarregar).
  // ------------------------------------------------------------
  const handleExcluir = async (id) => {
    try {
      await excluirPessoa(id);
      // Atualiza o state local removendo o item excluído
      setPessoas((prev) => prev.filter((p) => p.id !== id));
      Alert.alert('Sucesso', 'Registro excluído com sucesso.');
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
      Alert.alert('Erro', 'Não foi possível excluir o registro.');
    }
  };

  // ------------------------------------------------------------
  // FUNÇÃO: Navegar para Edição
  // Passa os dados da pessoa como parâmetro de navegação.
  // AlteracaoScreen recebe esses dados via route.params.
  // ------------------------------------------------------------
  const handleEditar = (pessoa) => {
    navigation.navigate('Alteracao', { pessoa });
  };

  // ------------------------------------------------------------
  // FUNÇÃO: Logout
  // ------------------------------------------------------------
  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await fazerLogout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // Componente renderizado quando a lista está vazia
  const ListaVazia = () => (
    <View style={styles.listaVazia}>
      <Text style={styles.listaVaziaIcone}>📋</Text>
      <Text style={styles.listaVaziaTexto}>Nenhuma pessoa cadastrada.</Text>
      <Text style={styles.listaVaziaSubtexto}>
        Toque em "+ Novo" para adicionar.
      </Text>
    </View>
  );

  const renderLinhaTabela = (pessoa, index) => (
    <View
      key={pessoa.id}
      style={[
        styles.linhaTabela,
        index % 2 === 0 ? styles.linhaPar : styles.linhaImpar,
      ]}
    >
      <Text style={styles.colunaSenha}>{pessoa.senha || '-'}</Text>
      <Text style={styles.colunaEmail}>{pessoa.email || '-'}</Text>
      <Text style={styles.colunaNome}>{pessoa.nome || '-'}</Text>
      <Text style={styles.colunaTelefone}>{pessoa.telefone || '-'}</Text>
      <Text style={styles.colunaIdade}>{pessoa.idade ?? '-'}</Text>
      <View style={styles.colunaAcoes}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => handleEditar(pessoa)}>
          <Text style={styles.btnAcaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => handleExcluir(pessoa.id)}>
          <Text style={styles.btnAcaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.carregandoTexto}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra superior com contador e botão Novo */}
      <View style={styles.barraSuperior}>
        <Text style={styles.contador}>
          {pessoas.length} {pessoas.length === 1 ? 'pessoa' : 'pessoas'}
        </Text>
        <TouchableOpacity
          style={styles.btnNovo}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.btnNovoTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Tabela de Pessoas */}
      <ScrollView contentContainerStyle={styles.lista}>
        {pessoas.length === 0 ? (
          <ListaVazia />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={styles.tabelaContainer}>
              <View style={styles.cabecalhoTabela}>
                <Text style={[styles.cabecalhoTexto, styles.colunaSenha]}>Senha</Text>
                <Text style={[styles.cabecalhoTexto, styles.colunaEmail]}>Email</Text>
                <Text style={[styles.cabecalhoTexto, styles.colunaNome]}>Nome</Text>
                <Text style={[styles.cabecalhoTexto, styles.colunaTelefone]}>Telefone</Text>
                <Text style={[styles.cabecalhoTexto, styles.colunaIdade]}>Idade</Text>
                <Text style={[styles.cabecalhoTexto, styles.colunaAcoes]}>Ações</Text>
              </View>
              {pessoas.map((pessoa, index) => renderLinhaTabela(pessoa, index))}
            </View>
          </ScrollView>
        )}
      </ScrollView>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
  },
  carregandoTexto: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  barraSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  contador: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  btnNovo: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnNovoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  lista: {
    padding: 16,
    flexGrow: 1,
  },
  tabelaContainer: {
    borderWidth: 1,
    borderColor: '#D9E2FF',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  cabecalhoTabela: {
    flexDirection: 'row',
    backgroundColor: '#3F51B5',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  cabecalhoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  linhaTabela: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E6EBFA',
  },
  linhaPar: {
    backgroundColor: '#FAFCFF',
  },
  linhaImpar: {
    backgroundColor: '#FFFFFF',
  },
  colunaSenha: {
    width: 120,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  colunaEmail: {
    width: 220,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  colunaNome: {
    width: 180,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  colunaTelefone: {
    width: 150,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  colunaIdade: {
    width: 80,
    fontSize: 13,
    color: '#333',
    paddingRight: 8,
  },
  colunaAcoes: {
    width: 170,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnEditar: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  btnExcluir: {
    backgroundColor: '#E74C3C',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  btnAcaoTexto: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listaVazia: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  listaVaziaIcone: {
    fontSize: 48,
    marginBottom: 12,
  },
  listaVaziaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  listaVaziaSubtexto: {
    fontSize: 14,
    color: '#999',
  },
  btnLogout: {
    margin: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnLogoutTexto: {
    color: '#E74C3C',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ListagemScreen;
