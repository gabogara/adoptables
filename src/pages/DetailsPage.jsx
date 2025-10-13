import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { getAnimalById } from "../shared/api/petfinder.js";
import { useFavoritesContext } from "../features/favorites/FavoritesContext.jsx";
import { useRecentlyViewed } from "../features/recentlyViewed/useRecentlyViewed.js";

export default function DetailsPage() {
  const { id } = useParams();
  const locationRouter = useLocation();
  const backTo = locationRouter.state?.from || "/";
  const numericId = Number.parseInt(id, 10);

  const [animal, setAnimal] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesContext();
  const { addViewed } = useRecentlyViewed();

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus("loading");
      setError("");
      try {
        const data = await getAnimalById(numericId);
        if (!mounted) return;
        const a = data?.animal || null;
        setAnimal(a);
        setStatus("ready");
        if (a) addViewed(a);
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError(
          "Couldn't load pet details. Check your Petfinder credentials in .env.local."
        );
        setStatus("error");
      }
    }
    if (Number.isFinite(numericId)) load();
    else {
      setError("Invalid id.");
      setStatus("error");
    }
    return () => {
      mounted = false;
    };
  }, [numericId, addViewed]);

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
          <Link to={backTo}>Back to Search</Link>
        </p>{" "}
      </>
    );
  }

  if (!animal) {
    return (
      <>
        <h2>Details</h2>
        <p>No details found.</p>
        <p>
          <Link to={backTo}>Back to Search</Link>
        </p>{" "}
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
          style={{ maxWidth: 320, display: "block", marginBottom: 12 }}
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
      {!favorite ? (
        <div className="btnRow mb-12">
          <button onClick={() => addFavorite(animal)}>Add to Favorites</button>
          <Link to={backTo} className="btnLike">
            Back to Search
          </Link>
        </div>
      ) : (
        <div className="btnRow mb-12">
          <button onClick={() => removeFavorite(animal.id)}>
            Remove from Favorites
          </button>
          <Link to={backTo} className="btnLike">
            Back to Search
          </Link>
        </div>
      )}
    </>
  );
}
