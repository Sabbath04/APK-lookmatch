import React, { useState } from "react";
import { StyleSheet, ImageBackground } from "react-native";
import BackButton from "../Components/BackButton";
import ConfirmButton from "../Components/ConfirmButton";
import ImageGrid from "../Components/imageGrid/ImageGrid";
import { useAppNavigation } from "../Components/useAppNavigation";
import { mockAvatars } from "../Components/MockAvatars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSelection } from "../contexts/UserSelectionContext";


export default function SkinToneSelector() {
  const { navigateTo, route } = useAppNavigation<"SelectTone">();
  const { genero } = route.params ?? {};
  const { tono, setTono } = useUserSelection();

  const handleConfirm = () => {
    if(!tono){
      alert("Antes debes seleccionar algo");
      return;
    }
    navigateTo("SelectServices");
  };

  return (
   
      <ImageBackground
            source={require("../../assets/screen-standar-bg.png")}
            style={styles.container}
            resizeMode="cover"
          >
          
        <BackButton />
        <ImageGrid
        type="tono"
        title="Elige tu tono de piel"
          endpoint={__DEV__ ? `https://picsum.photos/v2/list?page=1&limit=60` : undefined}
          mockData={__DEV__ ? undefined : mockAvatars }
          />

        <ConfirmButton text="Confirm" onPress={handleConfirm} />
      
      </ImageBackground>
    
  );
}

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

});