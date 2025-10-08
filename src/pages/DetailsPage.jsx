import React from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { getAnimalById } from "../shared/api/petfinder.js";
import { useFavoritesContext } from "../features/favorites/FavoritesContext.jsx";

export default function DetailsPage() {
  const { id } = useParams();
  const numericId = Number.parseInt(id, 10);
  const [animal, setAnimal] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle|loading|ready|error
  const [error, setError] = React.useState("");
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesContext();

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus("loading");
      setError("");
      try {
        const data = await getAnimalById(numericId);
        if (!mounted) return;
        setAnimal(data?.animal || null);
        setStatus("ready");
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError(
          "Couldn't load pet details. Check your Petfinder credentials in .env.local."
        );
        setStatus("error");
      }
    }
    if (Number.isFinite(numericId)) {
      load();
    } else {
      setError("Invalid id.");
      setStatus("error");
    }
    return () => {
      mounted = false;
    };
  }, [numericId]);

  if (status === "loading") {
    return (
      <>
        <h2>Details</h2>
        <Loader text="Loading details..." />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <h2>Details</h2>
        <ErrorAlert message={error} />
        <p>
          <Link to="/search">Back to Search</Link>
        </p>
      </>
    );
  }

  if (!animal) {
    return (
      <>
        <h2>Details</h2>
        <p>No details found.</p>
        <p>
          <Link to="/search">Back to Search</Link>
        </p>
      </>
    );
  }

  const photo =
    animal.photos?.[0]?.medium || animal.primary_photo_cropped?.medium || "";

  const location = [
    animal.contact?.address?.city || "",
    animal.contact?.address?.state || "",
  ]
    .filter(Boolean)
    .join(", ");

  const favorite = isFavorite(animal.id);

  return (
    <>
      <h2>{animal.name || "Unnamed"}</h2>
      {photo ? (
        <img
          src={photo}
          alt={`${animal.name || "Pet"} photo`}
          style={{ maxWidth: "320px", display: "block", marginBottom: 12 }}
        />
      ) : (
        <p>No photo available.</p>
      )}

      <ul>
        <li>
          <strong>Type:</strong> {animal.type}
        </li>
        {animal.breeds?.primary && (
          <li>
            <strong>Breed:</strong> {animal.breeds.primary}
          </li>
        )}
        {animal.age && (
          <li>
            <strong>Age:</strong> {animal.age}
          </li>
        )}
        {animal.gender && (
          <li>
            <strong>Gender:</strong> {animal.gender}
          </li>
        )}
        {location && (
          <li>
            <strong>Location:</strong> {location}
          </li>
        )}
      </ul>

      {!favorite && (
        <button onClick={() => addFavorite(animal)} style={{ marginRight: 8 }}>
          Add to Favorites
        </button>
      )}
      {favorite && (
        <button
          onClick={() => removeFavorite(animal.id)}
          style={{ marginRight: 8 }}
        >
          Remove from Favorites
        </button>
      )}

      <Link to="/search">Back to Search</Link>
    </>
  );
}
