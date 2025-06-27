// (Componente Reutilizável - ScreenContainer - Container padrão para telas)
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const ScreenContainer = ({ children, style, scrollable = false, safeArea = true, contentContainerStyle }) => {
  const ContainerComponent = safeArea ? SafeAreaView : View;
  const InnerComponent = scrollable ? ScrollView : View;

  return (
    <ContainerComponent style={[styles.safeArea, style]}>
      <InnerComponent 
        style={[styles.innerContainer, scrollable && styles.scrollFlex]} 
        contentContainerStyle={scrollable ? [styles.scrollContent, contentContainerStyle] : contentContainerStyle}
        keyboardShouldPersistTaps="handled" // Ajuda com interações de teclado em ScrollViews
      >
        {children}
      </InnerComponent>
    </ContainerComponent>
  );
};

// Estilos padrão para o ScreenContainer
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Cor de fundo padrão para consistência
  },
  innerContainer: {
    flex: 1,
    padding: 20, // Padding padrão para o conteúdo da tela
  },
  scrollFlex: {
    flexGrow: 1, // Garante que o ScrollView possa crescer
  },
  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo dentro do ScrollView se expanda
    justifyContent: 'flex-start', // Alinha o conteúdo no início por padrão
  },
});

// Exporta o componente para ser usado em outras partes do aplicativo
export default ScreenContainer;
