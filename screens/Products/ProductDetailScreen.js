// (Tela de Detalhes do Produto: Exibe informações detalhadas de um produto específico do Supabase usando componentes reutilizáveis)
import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, Alert, View } from "react-native"; // (Removido ScrollView, ActivityIndicator, Button)
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../../components/ScreenContainer";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal da tela de Detalhes do Produto)
const ProductDetailScreen = ({ route, navigation }) => {
  // (Obtém o productId dos parâmetros da rota)
  const { productId } = route.params;

  // (Estados para armazenar os detalhes do produto, carregamento e erros)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (Função para buscar os detalhes do produto no Supabase)
  const fetchProductDetails = useCallback(async () => {
    if (!productId) {
      setError("ID do produto não fornecido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("PRODUTOS")
        .select("id, name, description, price, created_at") // (Seleciona os campos relevantes)
        .eq("id", productId)
        .single(); // (Espera um único resultado)

      if (fetchError) {
        throw fetchError;
      }
      setProduct(data);
    } catch (e) {
      setError(e.message);
      Alert.alert("Erro ao Buscar Detalhes do Produto", e.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // (Hook para buscar detalhes do produto quando a tela é focada/montada)
  useFocusEffect(
    useCallback(() => {
      fetchProductDetails();
    }, [fetchProductDetails])
  );

  // (Função para formatar a data)
  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        // hour: "2-digit", 
        // minute: "2-digit",
      });
    } catch (e) {
      return dateString; // (Retorna a string original se a formatação falhar)
    }
  };

  // (Exibe indicador de carregamento)
  if (loading) {
    return <LoadingIndicator />;
  }

  // (Exibe mensagem de erro, se houver)
  if (error || !product) {
    return (
      <ScreenContainer style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao carregar detalhes do produto: {error || "Produto não encontrado."}</Text>
        <CustomButton title="Tentar Novamente" onPress={fetchProductDetails} />
        <CustomButton title="Voltar" onPress={() => navigation.goBack()} color="#6c757d" />
      </ScreenContainer>
    );
  }

  return (
    // (Utiliza ScreenContainer com rolagem para exibir detalhes do produto)
    <ScreenContainer scrollable={true}>
      {/* (Nome do produto) */}
      <Text style={styles.productName}>{product.name}</Text>
      
      {/* (Descrição do produto) */}
      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{product.description || "Descrição não fornecida."}</Text>
      
      {/* (Preço do produto) */}
      <Text style={styles.label}>Preço:</Text>
      <Text style={styles.priceValue}>R$ {product.price !== null ? Number(product.price).toFixed(2).replace(".", ",") : "N/A"}</Text>
      
      {/* (Data de criação do produto) */}
      <Text style={styles.label}>Cadastrado em:</Text>
      <Text style={styles.value}>{formatDate(product.created_at)}</Text>

      {/* (Botão para editar o produto usando CustomButton) */}
      <CustomButton 
        title="Editar Produto"
        onPress={() => navigation.navigate("ProductFormScreen", { productId: product.id })}
        color="#007bff"
        style={styles.buttonStyle} // (Estilo para margem)
      />
      
      {/* (Botão para voltar para a lista usando CustomButton) */}
      <CustomButton 
        title="Voltar para Lista"
        onPress={() => navigation.goBack()}
        color="#6c757d"
        style={styles.buttonStyle}
      />
    </ScreenContainer>
  );
};

// (Estilos para os componentes da tela)
const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495057",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 10,
    lineHeight: 24,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 10,
  },
  buttonStyle: {
    marginTop: 10, // (Adiciona margem acima dos botões)
  }
});

// (Exporta o componente para ser usado na navegação)
export default ProductDetailScreen;