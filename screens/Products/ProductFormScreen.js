// (Tela de Formulário de Produto: Permite adicionar ou editar produtos no Supabase usando componentes reutilizáveis)
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Alert } from "react-native"; // (Removido View, TextInput, Button, ScrollView, ActivityIndicator)
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)

import ScreenContainer from "../../components/ScreenContainer";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal do formulário de produto)
const ProductFormScreen = ({ route, navigation }) => {
  const { productId } = route.params || {}; 
  const isEditing = !!productId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // (Preço será tratado como string no input, convertido para número ao salvar)
  const [created_at] = useState("")
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(isEditing); // (Carregando detalhes se estiver editando)

  useEffect(() => {
    if (isEditing) {
      const fetchProductDetails = async () => {
        setFetchingDetails(true);
        const { data, error } = await supabase
          .from("PRODUTOS")
          .select("name, description, price")
          .eq("id", productId)
          .single();
        setFetchingDetails(false);
        if (error) {
          Alert.alert("Erro ao Buscar Detalhes", error.message);
          navigation.goBack();
        } else if (data) {
          setName(data.name || "");
          setDescription(data.description || "");
          setPrice(data.price !== null ? String(data.price) : ""); // (Converte preço numérico para string para o input)
        }
      };
      fetchProductDetails();
    }
  }, [productId, isEditing, navigation]);

  const handleSaveProduct = async () => {
    if (!name || !description || !price) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    const numericPrice = parseFloat(price.replace(",", ".")); // (Converte preço para número, aceitando vírgula ou ponto)
    if (isNaN(numericPrice) || numericPrice < 0) {
        Alert.alert("Erro", "Por favor, insira um preço válido.");
        return;
    }

    setLoading(true);
    let response;
    const productData = {
      name,
      description,
      price: numericPrice, // (Salva o preço como número)
      created_at: new Date().toISOString(),
    };

    if (isEditing) {
      response = await supabase
        .from("PRODUTOS")
        .update(productData)
        .match({ id: productId });
    } else {
      response = await supabase
        .from("PRODUTOS")
        .insert([productData]);
    }
    setLoading(false);

    const { error } = response;
    if (error) {
      Alert.alert(isEditing ? "Erro ao Atualizar" : "Erro ao Salvar", error.message);
    } else {
      Alert.alert("Sucesso", `Produto ${isEditing ? "atualizado" : "salvo"} com sucesso!`);
      navigation.goBack(); // (Volta para a tela anterior após salvar)
    }
  };

  if (fetchingDetails) {
    return <LoadingIndicator />;
  }

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.contentContainer}>
      {/* (Título da tela, dinâmico para edição ou adição) */}
      <Text style={styles.title}>{isEditing ? "Editar Produto" : "Adicionar Novo Produto"}</Text>
      
      {/* (Utiliza CustomTextInput para o nome do produto) */}
      <CustomTextInput
        label="Nome do Produto:"
        placeholder="Ex: Camiseta Branca"
        value={name}
        onChangeText={setName}
        disabled={loading}
      />
      
      {/* (Utiliza CustomTextInput para a descrição do produto) */}
      <CustomTextInput
        label="Descrição:"
        placeholder="Ex: Camiseta de algodão, confortável e estilosa..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        disabled={loading}
      />
      
      {/* (Utiliza CustomTextInput para o preço do produto) */}
      <CustomTextInput
        label="Preço (R$):"
        placeholder="Ex: 49.90"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        disabled={loading}
      />
      
      {/* (Utiliza CustomButton para salvar o produto) */}
      <CustomButton 
        title={isEditing ? "Atualizar Produto" : "Adicionar Produto"}
        onPress={handleSaveProduct} 
        loading={loading} 
        disabled={loading} 
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // ScreenContainer já aplica padding, então podemos remover daqui se não for específico
    // padding: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#343a40",
    textAlign: "center",
  },
  // Os estilos de label e input agora são gerenciados pelos componentes CustomTextInput
});

export default ProductFormScreen;