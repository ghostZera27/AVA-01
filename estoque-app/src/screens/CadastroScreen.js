import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { api } from '../api';

export default function CadastroScreen({ modoEscuroApp, tamanhoFonte }) {
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const salvarProduto = async () => {
    if (!nome) return Alert.alert('Erro', 'Digite o nome do produto');
    try {
      await api.post('/products', {
        name: nome,
        sku,
        price: parseFloat(preco) || 0,
        quantity: parseInt(quantidade) || 0
      });
      Alert.alert('Sucesso', 'Produto cadastrado!');
      setNome(''); setSku(''); setPreco(''); setQuantidade('');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoEscuroApp ? '#121212' : '#f0f2f5' }]}>
      <StatusBar barStyle={modoEscuroApp ? 'light-content' : 'dark-content'} backgroundColor={modoEscuroApp ? '#121212' : '#f0f2f5'} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { fontSize: tamanhoFonte + 2, color: modoEscuroApp ? '#fff' : '#4CAF50' }]}>Cadastrar Produto</Text>
        <TextInput style={[styles.input, { backgroundColor: modoEscuroApp ? '#333' : '#fff', color: modoEscuroApp ? '#fff' : '#000' }]} placeholder="Nome" placeholderTextColor={modoEscuroApp ? '#aaa' : '#666'} value={nome} onChangeText={setNome} />
        <TextInput style={[styles.input, { backgroundColor: modoEscuroApp ? '#333' : '#fff', color: modoEscuroApp ? '#fff' : '#000' }]} placeholder="Código" placeholderTextColor={modoEscuroApp ? '#aaa' : '#666'} value={sku} onChangeText={setSku} />
        <TextInput style={[styles.input, { backgroundColor: modoEscuroApp ? '#333' : '#fff', color: modoEscuroApp ? '#fff' : '#000' }]} placeholder="Preço" placeholderTextColor={modoEscuroApp ? '#aaa' : '#666'} value={preco} onChangeText={setPreco} keyboardType="numeric" />
        <TextInput style={[styles.input, { backgroundColor: modoEscuroApp ? '#333' : '#fff', color: modoEscuroApp ? '#fff' : '#000' }]} placeholder="Quantidade" placeholderTextColor={modoEscuroApp ? '#aaa' : '#666'} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={salvarProduto}>
          <Text style={styles.buttonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  button: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
