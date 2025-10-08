import React from "react";
import { useFavorites } from "./useFavorites";

const FavoritesContext = React.createContext(null);

export function FavoritesProvider({ children }) {
  const value = useFavorites();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) {
    throw new Error(
      "useFavoritesContext must be used within FavoritesProvider"
    );
  }
  return ctx;
}
