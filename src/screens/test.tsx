import { useEffect } from "react";
import * as FileSystem from "expo-file-system";

export default function App() {
  useEffect(() => {
    console.log("📂 FileSystem keys:", Object.keys(FileSystem));
  }, []);

  return null;
}

