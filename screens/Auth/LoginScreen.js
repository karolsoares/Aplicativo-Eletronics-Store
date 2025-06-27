// (Tela de Login: Esta tela permite a autenticação de usuários existentes com Supabase)
import React, { useState } from "react";
import { Text, TouchableOpacity, Alert, StyleSheet } from "react-native"; // (Removido View e TextInput, Button que serão substituídos)
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)

import ScreenContainer from "../../components/ScreenContainer";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal da tela de Login)
const LoginScreen = ({ navigation }) => {
  // (Estados para armazenar e-mail, senha e carregamento)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // (Estado para feedback de carregamento)

  // (Função para lidar com o processo de login via Supabase)
  const handleLogin = async () => {
    // (Validação básica dos campos)
    if (!email || !password) {
      Alert.alert("Erro de Login", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); // (Ativa o indicador de carregamento)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false); // (Desativa o indicador de carregamento)

    if (error) {
      Alert.alert("Erro de Login", error.message);
    } else if (data.user) {
      Alert.alert("Login Bem-sucedido!", `Bem-vindo, ${data.user.email}!`);
      // (A navegação para a tela principal após login bem-sucedido é gerenciada pelo AppNavigator)
      console.log("Usuário logado:", data.user);
    } else {
      Alert.alert("Erro de Login", "Ocorreu um erro inesperado durante o login.");
    }
  };

  return (
    // (Utiliza o ScreenContainer para padronização)
    <ScreenContainer style={styles.container}>
      {/* (Título da tela) */}
      <Text style={styles.title}>Login</Text>
      
      {/* (Utiliza CustomTextInput para o campo de e-mail) */}
      <CustomTextInput
        label="E-mail"
        placeholder="seuemail@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
      />
      
      {/* (Utiliza CustomTextInput para o campo de senha) */}
      <CustomTextInput
        label="Senha"
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        disabled={loading}
      />
      
      {/* (Utiliza CustomButton para o botão de login) */}
      <CustomButton 
        title="Entrar" 
        onPress={handleLogin} 
        loading={loading} 
        disabled={loading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate("CadastroScreen")} disabled={loading}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

// (Estilos para os componentes da tela de Login)
const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // (Centraliza o conteúdo dentro do ScreenContainer)
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  linkText: {
    marginTop: 20,
    color: "#FFA500",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;