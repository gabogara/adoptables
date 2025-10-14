import React from "react";
import PetCard from "../shared/PetCard.jsx";
import list from "../shared/List.module.css";
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

          <ul className={list.list}>
            {favorites.map((f) => {
              const shaped = {
                id: f.id,
                name: f.name,
                type: f.type,
                photos:
                  Array.isArray(f.photos) && f.photos.length
                    ? f.photos
                    : f.photo
                    ? [{ small: f.photo, medium: f.photo }]
                    : [],
                contact: {
                  address: {
                    city: f.contact?.city || f.contact?.address?.city || "",
                    state: f.contact?.state || f.contact?.address?.state || "",
                  },
                },
                breeds: { primary: f.breeds?.primary || f.breeds || "" },
                videos: f.videos || [],
              };

              const isEditing = editingId === f.id;

              return (
                <PetCard
                  key={f.id}
                  animal={shaped}
                  to={`/details/${f.id}`}
                  favorite={true}
                  onToggleFavorite={() => removeFavorite(f.id)}
                >
                  {isEditing ? (
                    <div style={{ width: "100%" }}>
                      <label
                        htmlFor={`note-${f.id}`}
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        Note
                      </label>
                      <textarea
                        id={`note-${f.id}`}
                        rows={3}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        style={{ width: "100%", maxWidth: 480 }}
                      />
                      <div className="btnRow mt-12">
                        <button type="button" onClick={saveEdit}>
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <p style={{ margin: 0 }}>
                        <em>{f.note ? f.note : "No note yet."}</em>
                      </p>
                      <div className="btnRow mt-12">
                        <button type="button" onClick={() => startEdit(f)}>
                          Edit note
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(f.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </PetCard>
              );
            })}
          </ul>
        </>
      )}

      {confirmId != null && (
        <Modal
          title="Remove favorite?"
          onClose={() => setConfirmId(null)}
          onConfirm={() => {
            removeFavorite(confirmId);
            setConfirmId(null);
          }}
        >
          <p>This action cannot be undone.</p>
        </Modal>
      )}
    </>
  );
}
