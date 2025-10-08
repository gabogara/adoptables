// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom"; // <-- add this
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { searchAnimals } from "../shared/api/petfinder.js";
import { useRecentlyViewed } from "../features/recentlyViewed/useRecentlyViewed.js";

export default function HomePage() {
  const [animals, setAnimals] = React.useState([]);
  const [status, setStatus] = React.useState("idle"); // idle|loading|ready|error
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
    }; // Cleanup
  }, []);

  return (
    <>
      <h1>Adoptables</h1>
      <p>Find pets by type and location.</p>

      {status === "loading" && <Loader text="Loading pets..." />}
      {status === "error" && <ErrorAlert message={error} />}
      {status === "ready" && animals.length === 0 && <p>No results.</p>}

      {status === "ready" && animals.length > 0 && (
        <ul>
          {animals.map((a) => (
            <li key={a.id}>
              {/* Link to details; DetailsPage calls addViewed(a) */}
              <Link to={`/details/${a.id}`}>
                <strong>{a.name || "Unnamed"}</strong>
              </Link>{" "}
              — {a.type} · {a.age} · {a.gender}
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>Recently viewed</h3>
      {recent.length === 0 ? (
        <p>No recently viewed pets yet.</p>
      ) : (
        <>
          <ul>
            {recent.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> — {r.type}
                {r.city ? ` • ${r.city}` : ""}
                {r.state ? `, ${r.state}` : ""}
              </li>
            ))}
          </ul>
          <button onClick={clearRecent}>Clear</button>
        </>
      )}
    </>
  );
}
