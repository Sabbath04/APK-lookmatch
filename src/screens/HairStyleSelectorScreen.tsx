// screens/HairStyleSelectorScreen.tsx
import { StyleSheet, ImageBackground } from "react-native";
import BackButton from "../Components/BackButton";
import ConfirmButton from "../Components/ConfirmButton";
import ImageGrid from "../Components/imageGrid/ImageGrid";
import { useAppNavigation } from "../Components/useAppNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSelection } from "../contexts/UserSelectionContext";




export default function HairStyleSelectorScreen() {
  const {navigateTo, route} = useAppNavigation<"Peinado">();
  const { peinado, setPeinado} = useUserSelection();
  
  const handleConfirm = () => {
    if(!peinado)
    {
      alert("Primero debes seleccionar algo");
      return;
    }
  navigateTo("VistaPrevia");
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
           type="peinado"
           title="Elige tu peinado"
            catalogType="styles"
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
