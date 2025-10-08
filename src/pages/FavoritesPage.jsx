import React from "react";
import { Link } from "react-router-dom";
import { useFavoritesContext } from "../features/favorites/FavoritesContext.jsx";
import Modal from "../shared/Modal.jsx";

export default function FavoritesPage() {
  const { favorites, removeFavorite, updateFavoriteNote } =
    useFavoritesContext();

  const [editingId, setEditingId] = React.useState(null);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [confirmId, setConfirmId] = React.useState(null);

  function startEdit(fav) {
    setEditingId(fav.id);
    setNoteDraft(fav.note || "");
  }
  function cancelEdit() {
    setEditingId(null);
    setNoteDraft("");
  }
  function saveEdit() {
    if (editingId == null) return;
    updateFavoriteNote(editingId, noteDraft);
    setEditingId(null);
    setNoteDraft("");
  }
  function askDelete(id) {
    setConfirmId(id);
  }
  function confirmDelete() {
    if (confirmId != null) {
      removeFavorite(confirmId);
      setConfirmId(null);
    }
  }

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
              <li key={f.id} style={{ marginBottom: 12 }}>
                <Link to={`/details/${f.id}`}>
                  <strong>{f.name}</strong>
                </Link>{" "}
                — {f.type}
                {f.breeds ? ` • ${f.breeds}` : ""}{" "}
                {f.contact?.city ? ` • ${f.contact.city}` : ""}
                {f.contact?.state ? `, ${f.contact.state}` : ""}
                <div style={{ marginTop: 6 }}>
                  {editingId === f.id ? (
                    <>
                      <label
                        htmlFor={`note-${f.id}`}
                        style={{ display: "block" }}
                      >
                        Note
                      </label>
                      <textarea
                        id={`note-${f.id}`}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={3}
                        style={{ width: "100%", maxWidth: 420 }}
                      />
                      <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <em>{f.note ? f.note : "No note yet."}</em>
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(f)}>Edit note</button>
                        <button onClick={() => askDelete(f.id)}>Remove</button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {confirmId != null && (
        <Modal
          title="Remove favorite?"
          onClose={() => setConfirmId(null)}
          onConfirm={confirmDelete}
        >
          <p>This action cannot be undone.</p>
        </Modal>
      )}
    </>
  );
}
