import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import ListaScreen from './src/screens/ListaScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [modoEscuroApp, setModoEscuroApp] = useState(false);
  const [nomeLoja, setNomeLoja] = useState('');
  const [tamanhoFonte, setTamanhoFonte] = useState(16);

  // Carregar configurações salvas
  useEffect(() => {
    (async () => {
      const dark = await AsyncStorage.getItem('modoEscuroApp');
      const nome = await AsyncStorage.getItem('nomeLoja');
      const fonte = await AsyncStorage.getItem('tamanhoFonte');

      if (dark !== null) setModoEscuroApp(JSON.parse(dark));
      if (nome !== null) setNomeLoja(nome);
      if (fonte !== null) setTamanhoFonte(parseInt(fonte));
    })();
  }, []);

  // Salvar configurações
  useEffect(() => {
    AsyncStorage.setItem('modoEscuroApp', JSON.stringify(modoEscuroApp));
  }, [modoEscuroApp]);

  useEffect(() => {
    AsyncStorage.setItem('nomeLoja', nomeLoja);
  }, [nomeLoja]);

  useEffect(() => {
    AsyncStorage.setItem('tamanhoFonte', tamanhoFonte.toString());
  }, [tamanhoFonte]);

  return (
    <NavigationContainer theme={modoEscuroApp ? DarkTheme : DefaultTheme}>
      <StatusBar
        barStyle={modoEscuroApp ? 'light-content' : 'dark-content'}
        backgroundColor={modoEscuroApp ? '#121212' : '#f0f2f5'}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: modoEscuroApp ? '#121212' : '#fff' },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Cadastro') iconName = 'create';
            else if (route.name === 'Lista') iconName = 'list';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              modoEscuroApp={modoEscuroApp}
              setModoEscuroApp={setModoEscuroApp}
              nomeLoja={nomeLoja}
              setNomeLoja={setNomeLoja}
              tamanhoFonte={tamanhoFonte}
              setTamanhoFonte={setTamanhoFonte}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Cadastro">
          {props => <CadastroScreen {...props} modoEscuroApp={modoEscuroApp} tamanhoFonte={tamanhoFonte} />}
        </Tab.Screen>
        <Tab.Screen name="Lista">
          {props => <ListaScreen {...props} modoEscuroApp={modoEscuroApp} tamanhoFonte={tamanhoFonte} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
