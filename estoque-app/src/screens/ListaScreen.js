import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Alert, SafeAreaView, StatusBar, TextInput 
} from 'react-native';
import { api } from '../api';
import { useFocusEffect } from '@react-navigation/native';

export default function ListaScreen({ modoEscuroApp, tamanhoFonte }) {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaQtd, setNovaQtd] = useState('');

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
    Alert.alert("Confirmação", "Deseja excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/products/${id}`);
            carregarProdutos();
          } catch (err) {
            console.error(err);
            Alert.alert("Erro", "Não foi possível deletar o produto.");
          }
        } 
      }
    ]);
  };

  const salvarEdicao = async (id) => {
    try {
      await api.put(`/products/${id}`, {
        name: novoNome,
        price: parseFloat(novoPreco),
        quantity: parseInt(novaQtd),
      });
      setEditandoId(null);
      setNovoNome('');
      setNovoPreco('');
      setNovaQtd('');
      carregarProdutos();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível editar o produto.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoEscuroApp ? '#121212' : '#f0f2f5' }]}>
      <StatusBar 
        barStyle={modoEscuroApp ? 'light-content' : 'dark-content'} 
        backgroundColor={modoEscuroApp ? '#121212' : '#f0f2f5'} 
      />
      
      <Text style={[styles.title, { fontSize: tamanhoFonte + 2, color: modoEscuroApp ? '#fff' : '#4CAF50' }]}>
        Lista de Produtos
      </Text>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        data={produtos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: modoEscuroApp ? '#1e1e1e' : '#fff' }]}>
            {editandoId === item.id ? (
              <>
                <TextInput
                  style={[styles.input, { fontSize: tamanhoFonte, color: modoEscuroApp ? '#fff' : '#000' }]}
                  value={novoNome}
                  onChangeText={setNovoNome}
                  placeholder="Nome do produto"
                  placeholderTextColor={modoEscuroApp ? '#aaa' : '#555'}
                />
                <TextInput
                  style={[styles.input, { fontSize: tamanhoFonte, color: modoEscuroApp ? '#fff' : '#000' }]}
                  value={novoPreco}
                  onChangeText={setNovoPreco}
                  keyboardType="numeric"
                  placeholder="Preço"
                  placeholderTextColor={modoEscuroApp ? '#aaa' : '#555'}
                />
                <TextInput
                  style={[styles.input, { fontSize: tamanhoFonte, color: modoEscuroApp ? '#fff' : '#000' }]}
                  value={novaQtd}
                  onChangeText={setNovaQtd}
                  keyboardType="numeric"
                  placeholder="Quantidade"
                  placeholderTextColor={modoEscuroApp ? '#aaa' : '#555'}
                />
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: '#4CAF50' }]} 
                  onPress={() => salvarEdicao(item.id)}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: '#9e9e9e' }]} 
                  onPress={() => setEditandoId(null)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.cardText, { color: modoEscuroApp ? '#fff' : '#000', fontSize: tamanhoFonte }]}>
                  {item.name} | SKU: {item.sku}
                </Text>
                <Text style={{ color: modoEscuroApp ? '#ccc' : '#333', marginBottom: 10 }}>
                  💲 {item.price} | 📦 {item.quantity}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity 
                    style={[styles.button, { backgroundColor: '#2196F3', flex: 1, marginRight: 5 }]} 
                    onPress={() => { 
                      setEditandoId(item.id); 
                      setNovoNome(item.name);
                      setNovoPreco(item.price.toString());
                      setNovaQtd(item.quantity.toString());
                    }}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, { backgroundColor: '#f44336', flex: 1, marginLeft: 5 }]} 
                    onPress={() => deletarProduto(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 10,
    padding: 5,
    borderRadius: 6,
  },
  button: { padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
