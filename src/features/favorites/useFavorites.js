import React from "react";

const STORAGE_KEY = "adoptables.favorites";

export function useFavorites() {
  const [favorites, setFavorites] = React.useState([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to parse favorites:", e);
      setFavorites([]);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  const addFavorite = React.useCallback((animal) => {
    setFavorites((prev) => {
      if (!animal || prev.some((f) => f.id === animal.id)) return prev;
      const minimal = {
        id: animal.id,
        name: animal.name || "Unnamed",
        type: animal.type || "",
        breeds: animal.breeds?.primary || "",
        photo:
          animal.photos?.[0]?.small ||
          animal.primary_photo_cropped?.small ||
          "",
        contact: {
          city: animal.contact?.address?.city || "",
          state: animal.contact?.address?.state || "",
        },
        note: "",
      };
      return [minimal, ...prev];
    });
  }, []);

  const removeFavorite = React.useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFavoriteNote = React.useCallback((id, note) => {
    setFavorites((prev) => prev.map((f) => (f.id === id ? { ...f, note } : f)));
  }, []);

  const isFavorite = React.useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavoriteNote,
    isFavorite,
  };
}
