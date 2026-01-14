import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { mockCatalog } from "../api/catalogMock";

const IMAGES_DIR = `${FileSystem.documentDirectory}catalogImages/`;
const CATALOG_PATH = `${FileSystem.documentDirectory}catalog.json`;

export const useCatalog = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string | null>(null);

  const ensureImageDir = async () => {
    const info = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    }
  };

  const downloadImage = async (url: string, name: string) => {
    const path = `${IMAGES_DIR}${name}.jpg`;
    const info = await FileSystem.getInfoAsync(path);

    if (info.exists) return path;

    try {
      const { uri } = await FileSystem.downloadAsync(url, path);
      return uri;
    } catch (err) {
      console.warn(`Error descargando ${name}:`, err);
      return url;
    }
  };

  const refreshCatalog = async (force = false) => {
    setLoading(true);
    await ensureImageDir();

    const remote = await mockCatalog();
    const localInfo = await FileSystem.getInfoAsync(CATALOG_PATH);

    if (!force && localInfo.exists) {
      const json = await FileSystem.readAsStringAsync(CATALOG_PATH);
      const local = JSON.parse(json);

      if (local.version === remote.version) {
        setData(local.items);
        setVersion(local.version);
        setLoading(false);
        return;
      }
    }

    const updatedItems = await Promise.all(
      remote.items.map(async (item) => ({
        ...item,
        localUri: await downloadImage(item.url, `img_${item.id}`),
      }))
    );

    const toSave = {
      version: remote.version,
      items: updatedItems,
    };

    await FileSystem.writeAsStringAsync(CATALOG_PATH, JSON.stringify(toSave));

    setData(updatedItems);
    setVersion(remote.version);
    setLoading(false);
  };

  const loadCatalog = async () => {
    try {
      const info = await FileSystem.getInfoAsync(CATALOG_PATH);

      if (info.exists) {
        const json = await FileSystem.readAsStringAsync(CATALOG_PATH);
        const local = JSON.parse(json);

        setData(local.items);
        setVersion(local.version);
        setLoading(false);

        refreshCatalog();
      } else {
        await refreshCatalog(true);
      }
    } catch (err) {
      console.error("Error cargando catálogo:", err);
      await refreshCatalog(true);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  return { data, version, loading, refreshCatalog };
};
