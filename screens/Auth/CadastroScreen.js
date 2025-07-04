// (Tela de Cadastro: Esta tela permite o registro de novos usuários com Supabase)
import React, { useState } from "react";
import { Text, TouchableOpacity, Alert, StyleSheet } from "react-native"; // (Removido View e TextInput, Button que serão substituídos)
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)

import ScreenContainer from "../../components/ScreenContainer";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal da tela de Cadastro)
const CadastroScreen = ({ navigation }) => {
  // (Estados para armazenar nome, e-mail, senha e carregamento)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // (Estado para feedback de carregamento)

  // (Função para lidar com o processo de cadastro via Supabase)
  const handleCadastro = async () => {
    // (Validação básica dos campos)
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert("Erro de Cadastro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro de Cadastro", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro de Cadastro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true); // (Ativa o indicador de carregamento)
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: nome, // (Supabase espera full_name em options.data para metadados do usuário)
        },
      },
    });
    setLoading(false); // (Desativa o indicador de carregamento)

    if (error) {
      Alert.alert("Erro de Cadastro", error.message);
    } else if (data.user && data.session === null) {
      Alert.alert(
        "Cadastro Quase Concluído!",
        "Verifique seu e-mail para confirmar sua conta antes de fazer login."
      );
      navigation.navigate("LoginScreen");
    } else if (data.user && data.session) {
      Alert.alert("Cadastro Concluído!", "Você foi cadastrado e logado com sucesso!");
      // (A navegação para a tela principal é gerenciada pelo AppNavigator)
    } else {
      // (Fallback caso o Supabase retorne um estado inesperado, mas geralmente um dos acima deve ocorrer)
      Alert.alert(
        "Cadastro Enviado",
        "Se um e-mail de confirmação for necessário, verifique sua caixa de entrada."
      );
      navigation.navigate("LoginScreen");
    }
  };
  
  // (Se estiver carregando, poderia exibir um LoadingIndicator sobreposto ou no lugar do botão)

  return (
    // (Utiliza o ScreenContainer para padronização)
    <ScreenContainer style={styles.container} scrollable={true}>
      {/* (Título da tela) */}
      <Text style={styles.title}>Cadastro - ComprasOnline</Text>
      
      {/* (Utiliza CustomTextInput para o campo de nome) */}
      <CustomTextInput
        label="Nome Completo"
        placeholder="Seu nome completo"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        disabled={loading}
      />
      
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
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        disabled={loading}
      />
      
      {/* (Utiliza CustomTextInput para o campo de confirmação de senha) */}
      <CustomTextInput
        label="Confirmar Senha"
        placeholder="Repita a senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        disabled={loading}
      />
      
      {/* (Utiliza CustomButton para o botão de cadastro) */}
      <CustomButton 
        title="Cadastrar"
        onPress={handleCadastro} 
        loading={loading} 
        disabled={loading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} disabled={loading}>
        <Text style={styles.linkText}>Já tem uma conta? Faça Login</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

// (Estilos para os componentes da tela de Cadastro)
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

export default CadastroScreen;