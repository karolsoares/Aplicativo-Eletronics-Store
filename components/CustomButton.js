// (Componente Reutilizável - CustomButton - Botão personalizado para uso em várias telas)
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';


const CustomButton = ({ onPress, title, style, textStyle, color = '#FFA500', disabled = false, loading = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        { backgroundColor: disabled || loading ? '#cccccc' : color }, // (Cor cinza se desabilitado ou carregando)
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// (Estilos padrão para o CustomButton)
const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50, // (Altura mínima para consistência)
    marginVertical: 10, // (Margem vertical padrão)
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// (Exporta o componente para ser usado em outras partes do aplicativo)
export default CustomButton;

