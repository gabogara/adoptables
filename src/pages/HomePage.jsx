import React from "react";
import PetCard from "../shared/PetCard.jsx";
import list from "../shared/List.module.css";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { searchAnimals } from "../shared/api/petfinder.js";
import { useRecentlyViewed } from "../features/recentlyViewed/useRecentlyViewed.js";

export default function HomePage() {
  const [animals, setAnimals] = React.useState([]);
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");
  const { recent, clearRecent } = useRecentlyViewed();

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus("loading");
      setError("");
      try {
        // Simple first search: dogs near San Francisco (94103)
        const data = await searchAnimals({
          type: "dog",
          location: "94103",
          limit: 12,
          page: 1,
        });
        if (!mounted) return;
        setAnimals(Array.isArray(data?.animals) ? data.animals : []);
        setStatus("ready");
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError(
          "Couldn't load the initial list. Check your Petfinder credentials in .env.local."
        );
        setStatus("error");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <h1>Adoptables</h1>
      <p>Find pets by type and location.</p>

      {status === "loading" && <Loader text="Loading pets..." />}
      {status === "error" && <ErrorAlert message={error} />}

      {status === "ready" && animals.length === 0 && <p>No results.</p>}

      {status === "ready" && animals.length > 0 && (
        <>
          <h3>Featured near 94103</h3>
          <ul className={list.list}>
            {animals.map((a) => (
              <PetCard key={a.id} animal={a} to={`/details/${a.id}`} />
            ))}
          </ul>
        </>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>Recently viewed</h3>
      {recent.length === 0 ? (
        <p>No recently viewed pets yet.</p>
      ) : (
        <>
          <ul className={list.list}>
            {recent.map((r) => {
              const shaped = {
                id: r.id,
                name: r.name,
                type: r.type,
                photos: r.photo ? [{ small: r.photo, medium: r.photo }] : [],
                contact: { address: { city: r.city, state: r.state } },
                breeds: { primary: "" },
              };
              return (
                <PetCard key={r.id} animal={shaped} to={`/details/${r.id}`} />
              );
            })}
          </ul>
          <button type="button" onClick={clearRecent}>
            Clear
          </button>
        </>
      )}
    </>
  );
}
