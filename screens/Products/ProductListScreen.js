// (Tela de Listagem de Produtos: Exibe os produtos cadastrados no Supabase utilizando componentes reutilizáveis)
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)
import { useFocusEffect } from "@react-navigation/native"; // (Para recarregar dados ao focar na tela)

import ScreenContainer from "../../components/ScreenContainer";
import ProductCard from "../../components/ProductCard";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal da tela de Listagem de Produtos)
const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("PRODUTOS") // (Nome da tabela conforme fornecido pelo usuário)
        .select("id, name, description, price") // (Seleciona os campos relevantes)
        .order("name", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }
      setProducts(data || []);
    } catch (e) {
      setError(e.message);
      Alert.alert("Erro ao Buscar Produtos", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true); // (Idealmente, um loading específico para a ação de deletar)
            const { error: deleteError } = await supabase
              .from("PRODUTOS")
              .delete()
              .match({ id: productId });
            setLoading(false);
            if (deleteError) {
              Alert.alert("Erro ao Excluir", deleteError.message);
            } else {
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              fetchProducts(); // (Recarrega a lista após a exclusão)
            }
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate("ProductDetailScreen", { productId: item.id })}
      onEdit={() => navigation.navigate("ProductFormScreen", { productId: item.id })}
      onDelete={() => handleDeleteProduct(item.id)}
    />
  );

  if (loading && products.length === 0) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ScreenContainer style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao carregar produtos: {error}</Text>
        <CustomButton title="Tentar Novamente" onPress={fetchProducts} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Produtos</Text>
        <CustomButton 
          title="Adicionar Produto" 
          onPress={() => navigation.navigate("ProductFormScreen")} 
          style={styles.addButton} 
          textStyle={styles.addButtonText}
          color="#28a745"
        />
      </View>
      
      {products.length === 0 && !loading ? (
        <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          refreshing={loading} // (Mostra o indicador de refresh do FlatList)
          onRefresh={fetchProducts} // (Permite puxar para atualizar)
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20, // (Espaçamento abaixo do cabeçalho)
  },
  title: {
    fontSize: 26, // (Tamanho de título maior)
    fontWeight: "bold",
    color: "#343a40",
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    minHeight: 0, // (Remove altura mínima para botão menor)
  },
  addButtonText: {
    fontSize: 14,
  },
  listContentContainer: {
    paddingBottom: 20, // (Espaço no final da lista)
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
});

export default ProductListScreen;