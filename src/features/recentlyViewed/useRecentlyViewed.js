import React from "react";

const STORAGE_KEY = "adoptables.recent";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recent, setRecent] = React.useState([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      setRecent(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to parse recent:", e);
      setRecent([]);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
      console.error("Failed to save recent:", e);
    }
  }, [recent]);

  React.useEffect(() => {
    function onStorage(ev) {
      if (ev.key === STORAGE_KEY) {
        try {
          const data = ev.newValue ? JSON.parse(ev.newValue) : [];
          setRecent(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("Failed to sync recent:", e);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addViewed = React.useCallback((animal) => {
    if (!animal || !animal.id) return;
    const item = {
      id: animal.id,
      name: animal.name || "Unnamed",
      type: animal.type || "",
      photo:
        animal.photos?.[0]?.small || animal.primary_photo_cropped?.small || "",
      city: animal.contact?.address?.city || "",
      state: animal.contact?.address?.state || "",
      viewedISO: new Date().toISOString(),
    };
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      const next = [item, ...filtered].slice(0, MAX_ITEMS);
      return next;
    });
  }, []);

  const clearRecent = React.useCallback(() => {
    setRecent([]);
  }, []);

  return { recent, addViewed, clearRecent };
}
