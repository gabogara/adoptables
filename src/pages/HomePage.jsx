import React from "react";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { searchAnimals } from "../shared/api/petfinder.js";

export default function HomePage() {
  const [animals, setAnimals] = React.useState([]);
  const [status, setStatus] = React.useState("idle"); // idle|loading|ready|error
  const [error, setError] = React.useState("");

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
    }; // cleanup
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
              <strong>{a.name || "Unnamed"}</strong> — {a.type} · {a.age} ·{" "}
              {a.gender}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
