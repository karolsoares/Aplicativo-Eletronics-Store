// (Componente Reutilizável - LoadingIndicator - Indicador de carregamento centralizado)
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// (Props esperadas pelo componente LoadingIndicator)
// size: Tamanho do indicador (ex: 'small', 'large')
// color: Cor do indicador
// style: Estilos adicionais para o container do indicador

const LoadingIndicator = ({ size = 'large', color = '#FFA500', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

// Estilos padrão para o LoadingIndicator
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Padding para não ficar colado nas bordas se usado em um container menor
  },
});

// Exporta o componente para ser usado em outras partes do aplicativo
export default LoadingIndicator;