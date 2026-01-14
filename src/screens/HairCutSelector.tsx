// screens/HairCutSelector.tsx
import { StyleSheet, ImageBackground } from "react-native";
import BackButton from "../Components/BackButton";
import ConfirmButton from "../Components/ConfirmButton";
import ImageGrid from "../Components/imageGrid/ImageGrid";
import { useAppNavigation } from "../Components/useAppNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSelection } from "../contexts/UserSelectionContext";




export default function HairCutSelector() {
  const {navigateTo, route} = useAppNavigation<"Corte">();
  const { corte, setCorte} = useUserSelection();
  
  const handleConfirm = () => {
    if(!corte){
      alert("Antes debes seleccionar una opción");
      return;
    }
  navigateTo("ColorCorte"); // Navegar a selección de color después del corte
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <ImageBackground
              source={require("../../assets/screen-standar-bg.png")}
              style={styles.container}
              resizeMode="cover"
              
            >
             
          <BackButton />
           <ImageGrid
           type="corte"
           title="Elige tu corte"
            catalogType="cuts"
            />
    
          <ConfirmButton text="Confirm" onPress={handleConfirm} />
        
        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

});
