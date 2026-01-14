import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
    alignItems: "center", // Centrar contenido horizontalmente
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#f8e5b8",
    textAlign: "center",
    marginBottom: 40,
    width: "80%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B140A",
  },
  loaderText: {
    color: "#f8e5b8",
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
