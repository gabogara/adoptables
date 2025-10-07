import React from "react";
import { Link } from "react-router-dom";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { searchAnimals } from "../shared/api/petfinder.js";
import { isZip5 } from "../shared/utils.js";

const TYPES = [
  "dog",
  "cat",
  "rabbit",
  "small-furry",
  "bird",
  "horse",
  "scales-fins-other",
  "barnyard",
];

export default function SearchPage() {
  // form state (controlled)
  const [type, setType] = React.useState("dog");
  const [location, setLocation] = React.useState(""); // 5-digit ZIP (optional but validated if filled)
  const [limit, setLimit] = React.useState("12");

  // data state
  const [animals, setAnimals] = React.useState([]);
  const [pagination, setPagination] = React.useState(null); // { current_page, total_pages, ... }
  const [page, setPage] = React.useState(1);

  // ui state
  const [status, setStatus] = React.useState("idle"); // idle|loading|ready|error
  const [error, setError] = React.useState("");
  const [formError, setFormError] = React.useState(""); // validation message

  // Build Petfinder query params (memoized)
  const buildParams = React.useCallback(() => {
    const params = {
      type,
      page,
      limit: Number.parseInt(limit, 10) || 12,
    };
    const loc = location.trim();
    if (loc) params.location = loc; // Only send if provided
    return params;
  }, [type, location, page, limit]);

  async function fetchAnimals(targetPage = page) {
    setStatus("loading");
    setError("");
    try {
      const params = buildParams();
      params.page = targetPage; // ensure we use the latest page
      const data = await searchAnimals(params);
      setAnimals(Array.isArray(data?.animals) ? data.animals : []);
      setPagination(data?.pagination || null);
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setError(
        "Couldn't fetch results. Check your Petfinder credentials in .env.local."
      );
      setStatus("error");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation: type required, location if present must be ZIP5
    if (!type) {
      setFormError("Please select a type.");
      return;
    }
    if (location.trim() && !isZip5(location)) {
      setFormError(
        "Please enter a valid 5-digit ZIP code (or leave it blank)."
      );
      return;
    }
    setFormError("");
    setPage(1);
    fetchAnimals(1);
  }

  function handlePrev() {
    if (!pagination) return;
    const next = Math.max(1, (pagination.current_page || page) - 1);
    setPage(next);
    fetchAnimals(next);
  }

  function handleNext() {
    if (!pagination) return;
    const total = pagination.total_pages || 1;
    const next = Math.min(total, (pagination.current_page || page) + 1);
    setPage(next);
    fetchAnimals(next);
  }

  const disabledPrev = !pagination || (pagination?.current_page || 1) <= 1;
  const disabledNext =
    !pagination ||
    (pagination?.current_page || 1) >= (pagination?.total_pages || 1);

  return (
    <>
      <h2>Search</h2>
      <p>Find adoptable pets by type and location.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="type">Type</label>
          <br />
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="location">ZIP (optional)</label>
          <br />
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 94103"
            aria-invalid={
              location.trim() && !isZip5(location) ? "true" : "false"
            }
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="limit">Results per page</label>
          <br />
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>

        {formError && (
          <div role="alert" style={{ color: "#b00020", marginBottom: 8 }}>
            {formError}
          </div>
        )}

        <button type="submit">Search</button>
      </form>

      {status === "loading" && <Loader text="Loading results..." />}
      {status === "error" && <ErrorAlert message={error} />}

      {status === "ready" && animals.length === 0 && (
        <p>No results found. Try a different type or ZIP.</p>
      )}

      {status === "ready" && animals.length > 0 && (
        <>
          <p>
            Showing page <strong>{pagination?.current_page || page}</strong> of{" "}
            <strong>{pagination?.total_pages || "?"}</strong>
          </p>
          <ul>
            {animals.map((a) => (
              <li key={a.id} style={{ marginBottom: 8 }}>
                <Link to={`/details/${a.id}`}>
                  <strong>{a.name || "Unnamed"}</strong>
                </Link>{" "}
                — {a.type}
                {a.breeds?.primary ? ` • ${a.breeds.primary}` : ""}{" "}
                {a.contact?.address?.city ? ` • ${a.contact.address.city}` : ""}
                {a.contact?.address?.state
                  ? `, ${a.contact.address.state}`
                  : ""}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handlePrev} disabled={disabledPrev}>
              Prev
            </button>
            <button onClick={handleNext} disabled={disabledNext}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}
