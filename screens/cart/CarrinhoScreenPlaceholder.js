// (Exibe os produtos cadastrados no Supabase utilizando componentes reutilizáveis)
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native"; // (Removido ActivityIndicator, TouchableOpacity, Button que serão substituídos ou tratados por componentes)
import { supabase } from "../../services/supabaseClient"; // (Importa o cliente Supabase)
import { useFocusEffect } from "@react-navigation/native"; // ( Para recarregar dados ao focar na tela)

// (Importa os componentes reutilizáveis)
import ScreenContainer from "../../components/ScreenContainer";
import CartProduct from "../../components/cartProduct";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// (Componente principal da tela de Listagem de Produtos)
const ProductListScreen = ({ navigation }) => {
  // (Estados para armazenar a lista de produtos, carregamento e erros)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (Função para buscar os produtos no Supabase)
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

  // (Hook para buscar produtos quando a tela é focada/montada)
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  // (Renderiza cada item da lista de produtos usando CartProduct)
  const renderProductItem = ({ item }) => (
    <CartProduct
      product={item}
      onPress={() => navigation.navigate("CarrinhoScreenDetails", { productId: item.id })}
      onEdit={() => handleAddToCart(item.id)} // Aqui está o botão "Adicionar ao Carrinho"
    />
  );


 const handleAddToCart = async (productId) => {
  const { data, error: sessionError } = await supabase.auth.getSession();
  const user = data?.session?.user;

  if (!user) {
    Alert.alert("Erro", "Usuário não autenticado.");
    return;
  }

  const { error } = await supabase.from("Carrinho").insert([
    {
      id_produto: productId,
      created_user: user.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    Alert.alert("Erro ao adicionar ao carrinho", error.message);
  } else {
    Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
  }
};

  // (Exibe indicador de carregamento centralizado)
  if (loading && products.length === 0) {
    return <LoadingIndicator />;
  }

  // (Exibe mensagem de erro, se houver)
  if (error) {
    return (
      <ScreenContainer style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao carregar produtos: {error}</Text>
        <CustomButton title="Tentar Novamente" onPress={fetchProducts} />
      </ScreenContainer>
    );
  }

  return (
    // Utiliza ScreenContainer para padronização da tela)
    <ScreenContainer>
      {/* Cabeçalho da tela com título e botão para adicionar novo produto) */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Produtos</Text>
        <CustomButton 
          title="Ver Carrinho" 
          onPress={() => navigation.navigate("CarrinhoList")} 
          style={styles.addButton} 
          textStyle={styles.addButtonText}
          color="#28a745"
        />
      </View>
      
      {/* (Lista de produtos ou mensagem se estiver vazia) */}
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

// (Estilos para os componentes da tela)
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

// (Exporta o componente para ser usado na navegação)
export default ProductListScreen;