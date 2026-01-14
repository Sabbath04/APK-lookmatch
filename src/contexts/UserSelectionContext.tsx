import React, { createContext, useContext, useState } from "react";

type UserSelection = {
  genero?: string;
  tono?: string;
  corte?: string;
  color?: string;
  peinado?: string;
  userPhoto?: string; // URI de la foto del usuario
  generatedPhoto?: string; // URI de la foto generada por el backend
  setPeinado:(g:string) => void;
  setGenero: (g: string) => void;
  setTono: (t: string) => void;
  setCorte: (c: string) => void;
  setColor: (c: string) => void;
  setUserPhoto: (uri: string) => void;
  setGeneratedPhoto: (uri: string) => void;
  reset: () => void;
};

const UserSelectionContext = createContext<UserSelection | undefined>(undefined);

export const UserSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [genero, setGenero] = useState<string>();
  const [tono, setTono] = useState<string>();
  const [corte, setCorte] = useState<string>();
  const [color, setColor] = useState<string>();
  const [peinado, setPeinado] = useState<string>();
  const [userPhoto, setUserPhoto] = useState<string>();
  const [generatedPhoto, setGeneratedPhoto] = useState<string>();

  const reset = () => {
    setGenero(undefined);
    setTono(undefined);
    setCorte(undefined);
    setColor(undefined);
    setPeinado(undefined);
    setUserPhoto(undefined);
    setGeneratedPhoto(undefined);
  };

  return (
    <UserSelectionContext.Provider value={{ 
      genero, 
      tono, 
      corte, 
      color, 
      peinado, 
      userPhoto,
      generatedPhoto,
      setGenero, 
      setTono, 
      setCorte, 
      setColor,
      setPeinado,
      setUserPhoto,
      setGeneratedPhoto,
      reset 
    }}>
      {children}
    </UserSelectionContext.Provider>
  );
};

export const useUserSelection = () => {
  const context = useContext(UserSelectionContext);
  if (!context) throw new Error("useUserSelection debe usarse dentro de un UserSelectionProvider");
  return context;
};
