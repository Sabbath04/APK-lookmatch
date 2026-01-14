// src/contexts/CatalogContext.tsx
import React, { createContext, useContext } from "react";
import { useCatalog } from "../hooks/useCatalog";

type CatalogContextType = {
  loading: boolean;
  data: any[];
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, refreshCatalog } = useCatalog();

  return (
    <CatalogContext.Provider value={{ loading, data, refresh: refreshCatalog }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalogContext debe usarse dentro de un CatalogProvider");
  return context;
};
