import React from "react";
import { Link } from "react-router-dom";
import { useFavoritesContext } from "../features/favorites/FavoritesContext.jsx";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesContext();

  return (
    <>
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet. Add some from any Details page.</p>
      ) : (
        <>
          <p>
            Total: <strong>{favorites.length}</strong>
          </p>
          <ul>
            {favorites.map((f) => (
              <li key={f.id} style={{ marginBottom: 8 }}>
                <Link to={`/details/${f.id}`}>
                  <strong>{f.name}</strong>
                </Link>{" "}
                — {f.type}
                {f.breeds ? ` • ${f.breeds}` : ""}{" "}
                {f.contact?.city ? ` • ${f.contact.city}` : ""}
                {f.contact?.state ? `, ${f.contact.state}` : ""}{" "}
                <button
                  onClick={() => removeFavorite(f.id)}
                  style={{ marginLeft: 8 }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
