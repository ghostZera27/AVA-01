import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { api } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export default function ListaScreen({ modoEscuroApp, tamanhoFonte }) {
  const [produtos, setProdutos] = useState([]);

  const carregarProdutos = async () => {
    try {
      const res = await api.get('/products');
      setProdutos(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  };

  useFocusEffect(useCallback(() => { carregarProdutos(); }, []));

  const deletarProduto = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível deletar o produto.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoEscuroApp ? '#121212' : '#f0f2f5' }]}>
      <StatusBar barStyle={modoEscuroApp ? 'light-content' : 'dark-content'} backgroundColor={modoEscuroApp ? '#121212' : '#f0f2f5'} />
      
      <Text style={[styles.title, { fontSize: tamanhoFonte + 2, color: modoEscuroApp ? '#fff' : '#4CAF50' }]}>
        Lista de Produtos
      </Text>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        data={produtos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: modoEscuroApp ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.cardText, { color: modoEscuroApp ? '#fff' : '#000', fontSize: tamanhoFonte }]}>
              {item.name} | SKU: {item.sku}
            </Text>
            <Text style={{ color: modoEscuroApp ? '#ccc' : '#333', marginBottom: 10 }}>
              💲 {item.price} | 📦 {item.quantity}
            </Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={() => deletarProduto(item.id)}>
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardText: { fontWeight: 'bold', marginBottom: 5 },
  button: { padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
