// (Configura a navegação principal e o estado de autenticação)
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // (Importa o TabNavigator)
import { View, ActivityIndicator, StyleSheet, Text, Button } from 'react-native'; // (Adicionado Button)

// (Importa as telas de autenticação da nova localização)
import LoginScreen from '../screens/Auth/LoginScreen';
import CadastroScreen from '../screens/Auth/CadastroScreen';

// (Importa as telas de produtos da nova localização)
import ProductListScreen from '../screens/Products/ProductListScreen';
import ProductFormScreen from '../screens/Products/ProductFormScreen';
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
import CartDetailScreen from '../screens/cart/CarrinhoScreenDetails';
import CarrinhoList from '../screens/cart/CarrinhoList';

// (Importa a tela de carrinho)
import CarrinhoScreenPlaceholder from '../screens/cart/CarrinhoScreenPlaceholder';

// (Importa a tela de Informações do App da nova localização)
import InfoAppScreen from '../screens/InfoAppScreen';

// (Importa o cliente Supabase da nova localização)
import { supabase } from '../services/supabaseClient';

// (Cria os navegadores Stack e Tab)
const AuthStack = createStackNavigator();
const ProductStack = createStackNavigator();
const ProfileStack = createStackNavigator(); // (Stack para a aba de Perfil)
const MainAppTabs = createBottomTabNavigator();
const CarrinhoStack = createStackNavigator();

// (Navegador para as telas de autenticação)
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false}}>
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="CadastroScreen" component={CadastroScreen} />
  </AuthStack.Navigator>
);

// (Navegador Stack para as telas de Produtos)
const ProductNavigator = () => (
  <ProductStack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#9b09b4' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  }}>
    <ProductStack.Screen name="ProductListScreen" component={ProductListScreen} options={{ title: 'Produtos' }} />
    <ProductStack.Screen name="ProductFormScreen" component={ProductFormScreen} options={({ route }) => ({ title: route.params?.productId ? 'Editar Produto' : 'Adicionar Produto' })} />
    <ProductStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ title: 'Detalhes do Produto' }} />
  </ProductStack.Navigator>
);

// (Tela Placeholder para Carrinho)
const CarrinhoNavigator = () => (
  <CarrinhoStack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#9b09b4' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  }}>
    <CarrinhoStack.Screen name="CarrinhoScreenPlaceholder" component={CarrinhoScreenPlaceholder} options={{ title: 'Carrinho' }} />
    <CarrinhoStack.Screen name="CarrinhoList" component={CarrinhoList} options={{ title: 'Seu Carrinho' }} />
    <CarrinhoStack.Screen name="CarrinhoScreenDetails" component={CartDetailScreen} options={{ title: 'Detalhes do Produto' }} />
  </CarrinhoStack.Navigator>
);


// (Tela Placeholder para Perfil - esta irá navegar para InfoAppScreen)
const PerfilScreenPlaceholder = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* (Conteúdo da tela de perfil virá aqui) */}
    <Text>Tela de Perfil</Text>
    <Button title="Sobre o App" onPress={() => navigation.navigate('InfoAppScreen')} />
    <Button title="Logout" onPress={async () => await supabase.auth.signOut()} color="red" />
  </View>
);

// (Navegador Stack para a aba de Perfil, incluindo InfoAppScreen)
const ProfileNavigator = () => (
   <ProfileStack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#9b09b4' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  }}>
    <ProfileStack.Screen name="PerfilScreenPlaceholder" component={PerfilScreenPlaceholder} options={{ title: 'Meu Perfil' }}/>
    <ProfileStack.Screen name="InfoAppScreen" component={InfoAppScreen} options={{ title: 'Sobre o App' }}/>
  </ProfileStack.Navigator>
);


// (Navegador Principal com Abas para quando o usuário está logado)
const MainAppNavigator = () => (
  <MainAppTabs.Navigator screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      // (Ícones podem ser adicionados aqui - ex: usando @expo/vector-icons)
      let iconName = focused ? 'home' : 'home-outline'; // Exemplo, precisaria de uma lib de ícones
      return <Text style={{color: color}}>{iconName.substring(0,2)}</Text>; // Placeholder para ícone
    },
    tabBarActiveTintColor: '#9b09b4',
    tabBarInactiveTintColor: 'gray',
    headerShown: false, // (Os Stacks internos já têm seus próprios headers)
  })}>
    <MainAppTabs.Screen name="ProdutosTab" component={ProductNavigator} options={{ title: 'Produtos' }} />
    <MainAppTabs.Screen name="CarrinhoTab" component={CarrinhoNavigator} options={{ title: 'Carrinho' }} />
    <MainAppTabs.Screen name="PerfilTab" component={ProfileNavigator} options={{ title: 'Perfil' }} />
  </MainAppTabs.Navigator>
);

// (Componente principal do App que gerencia a navegação baseada na autenticação)
const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // (Se o evento for SIGNED_OUT, podemos explicitamente setar loading para false se necessário)
      // if (_event === 'SIGNED_OUT') setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && session.user ? <MainAppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;

