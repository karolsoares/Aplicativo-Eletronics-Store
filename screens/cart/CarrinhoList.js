import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { supabase } from "../../services/supabaseClient";
import { useFocusEffect } from "@react-navigation/native";

// Componentes reutilizáveis
import ScreenContainer from "../../components/ScreenContainer";
import ProductCard from "../../components/ProductCard";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

const CarrinhoList = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        throw new Error("Usuário não autenticado.");
      }

      const userId = sessionData.session.user.id;

      const { data, error: fetchError } = await supabase
        .from("Carrinho")
        .select(`
          id,
          created_at,
          id_produto,
          created_user,
          PRODUTOS (
            id,
            name,
            description,
            price
          )
        `)
        .eq("created_user", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setCartItems(data || []);
    } catch (e) {
      setError(e.message);
      Alert.alert("Erro ao Buscar Carrinho", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );

  const handleRemoveFromCart = async (cartItemId) => {
    Alert.alert(
      "Remover Item",
      "Deseja remover este item do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("Carrinho")
              .delete()
              .match({ id: cartItemId });

            if (error) {
              Alert.alert("Erro ao remover", error.message);
            } else {
              fetchCartItems();
            }
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => {
    const product = item.PRODUTOS;
    if (!product) return null;

    return (
      <ProductCard
        product={product}
        showActions={true}
        onDelete={() => handleRemoveFromCart(item.id)}
        onEdit={null} // desativa o botão de edição
        onPress={() => {}} // pode remover ou deixar vazio
      />
    );
  };

  if (loading && cartItems.length === 0) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ScreenContainer style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao carregar carrinho: {error}</Text>
        <CustomButton title="Tentar Novamente" onPress={fetchCartItems} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Meu Carrinho</Text>
      </View>

      {cartItems.length === 0 && !loading ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Nenhum item no carrinho.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          refreshing={loading}
          onRefresh={fetchCartItems}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343a40",
  },
  listContentContainer: {
    paddingBottom: 20,
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

export default CarrinhoList;
