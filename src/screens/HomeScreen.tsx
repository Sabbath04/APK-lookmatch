import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

console.log("T")

const HomeScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      {user?.picture && <Image source={{ uri: user.picture }} style={styles.avatar} />}
      <Text style={styles.welcome}>Hola, {user?.name || 'usuario'} 👋</Text>
      <Button title="Cerrar sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

console.log("U")

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 20, marginTop: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
});

console.log("V")

export default HomeScreen;

console.log("W")
