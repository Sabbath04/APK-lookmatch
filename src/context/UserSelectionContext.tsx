import React, { createContext, useContext, useState } from "react";

type UserSelection = {
  genero?: string;
  tono?: string;
  corte?: string;
  color?: string;
  setGenero: (g: string) => void;
  setTono: (t: string) => void;
  setCorte: (c: string) => void;
  setColor: (c: string) => void;
  reset: () => void;
};

const UserSelectionContext = createContext<UserSelection | undefined>(undefined);

export const UserSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [genero, setGenero] = useState<string>();
  const [tono, setTono] = useState<string>();
  const [corte, setCorte] = useState<string>();
  const [color, setColor] = useState<string>();

  const reset = () => {
    setGenero(undefined);
    setTono(undefined);
    setCorte(undefined);
    setColor(undefined);
  };

  return (
    <UserSelectionContext.Provider value={{ genero, tono, corte, color, setGenero, setTono, setCorte, setColor, reset }}>
      {children}
    </UserSelectionContext.Provider>
  );
};

export const useUserSelection = () => {
  const context = useContext(UserSelectionContext);
  if (!context) throw new Error("useUserSelection debe usarse dentro de un UserSelectionProvider");
  return context;
};
