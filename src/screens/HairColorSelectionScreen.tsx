import { StyleSheet, ImageBackground } from "react-native";
import BackButton from "../Components/BackButton";
import ConfirmButton from "../Components/ConfirmButton";
import ImageGrid from "../Components/imageGrid/ImageGrid";
import { useAppNavigation } from "../Components/useAppNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSelection } from "../contexts/UserSelectionContext";




export default function HairColorSelectionScreen() {
  const {navigateTo, route} = useAppNavigation<"ColorCorte">();
  const { color, setColor} = useUserSelection();
  
  const handleConfirm = () => {
    if(!color){
      alert("Antes debes seleccionar algo");
      return;
    }
  navigateTo("PhotoSource");
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
           type="color"
           title="Elige el color de tu corte"
            catalogType="colors"
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
