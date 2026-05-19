// ============================================================
// COMPONENTE REUTILIZÁVEL: UserCard
// ============================================================
// Exibe os dados de uma pessoa na lista.
// Recebe callbacks para Editar e Excluir.
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const UserCard = ({ pessoa, onEditar, onExcluir }) => {

  // Exibe confirmação antes de excluir
  const confirmarExclusao = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir "${pessoa.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onExcluir(pessoa.id) },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nome}>{pessoa.nome}</Text>
        <Text style={styles.detalhe}>📧 {pessoa.email}</Text>
        {pessoa.telefone ? (
          <Text style={styles.detalhe}>📞 {pessoa.telefone}</Text>
        ) : null}
        {pessoa.idade ? (
          <Text style={styles.detalhe}>🎂 {pessoa.idade} anos</Text>
        ) : null}
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => onEditar(pessoa)}>
          <Text style={styles.btnTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir} onPress={confirmarExclusao}>
          <Text style={styles.btnTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  info: {
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  detalhe: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  acoes: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEditar: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnExcluir: {
    flex: 1,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default UserCard;
