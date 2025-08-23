import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Switch, TouchableOpacity, Modal, Image, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ modoEscuroApp, setModoEscuroApp, nomeLoja, setNomeLoja, tamanhoFonte, setTamanhoFonte }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    // Carregar foto salva
    AsyncStorage.getItem('fotoLoja').then(uri => {
      if (uri) setFoto(uri);
    });
  }, []);

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
      await AsyncStorage.setItem('fotoLoja', result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoEscuroApp ? '#121212' : '#f0f2f5' }]}>
      <StatusBar
        barStyle={modoEscuroApp ? 'light-content' : 'dark-content'}
        backgroundColor={modoEscuroApp ? '#121212' : '#f0f2f5'}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={escolherFoto}>
          <Image
            source={{
              uri: foto || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
            }}
            style={styles.foto}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: tamanhoFonte + 4, color: modoEscuroApp ? '#fff' : '#4CAF50' }]}>
          {nomeLoja || 'Mercadinho do Ghost'}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={30} color={modoEscuroApp ? '#fff' : '#4CAF50'} />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: modoEscuroApp ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: modoEscuroApp ? '#fff' : '#000' }]}>Configurações</Text>

            <Text style={[styles.label, { color: modoEscuroApp ? '#fff' : '#000' }]}>Nome da Loja</Text>
            <TextInput
              style={[styles.input, { backgroundColor: modoEscuroApp ? '#333' : '#f0f0f0', color: modoEscuroApp ? '#fff' : '#000' }]}
              placeholder="Digite o nome da loja"
              placeholderTextColor={modoEscuroApp ? '#aaa' : '#666'}
              value={nomeLoja}
              onChangeText={setNomeLoja}
            />

            <Text style={[styles.label, { color: modoEscuroApp ? '#fff' : '#000' }]}>Tamanho da Fonte: {tamanhoFonte}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={14}
              maximumValue={28}
              step={1}
              value={tamanhoFonte}
              onValueChange={setTamanhoFonte}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#ccc"
            />

            <View style={styles.switchContainer}>
              <Text style={{ color: modoEscuroApp ? '#fff' : '#000', fontWeight: 'bold' }}>Modo Escuro</Text>
              <Switch value={modoEscuroApp} onValueChange={setModoEscuroApp} />
            </View>

            <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#4CAF50' }]} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.box}>
        <Text style={[styles.subtitle, { fontSize: tamanhoFonte, color: modoEscuroApp ? '#fff' : '#333' }]}>
          Use as abas abaixo para cadastrar e ver os produtos.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  title: { fontWeight: 'bold', flexShrink: 1 },
  box: { marginTop: 40, alignItems: 'center' },
  subtitle: { textAlign: 'center' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: { padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  closeButton: { padding: 12, borderRadius: 8, alignItems: 'center' },
  foto: { width: 60, height: 60, borderRadius: 30, marginRight: 10 }
});
