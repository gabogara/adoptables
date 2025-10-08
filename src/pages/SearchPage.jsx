import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../shared/Loader.jsx";
import ErrorAlert from "../shared/ErrorAlert.jsx";
import { searchAnimals } from "../shared/api/petfinder.js";
import { isZip5 } from "../shared/utils.js";
import Pagination from "../shared/Pagination.jsx";

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
  const [type, setType] = React.useState("dog");
  const [location, setLocation] = React.useState("");
  const [limit, setLimit] = React.useState("12");
  const [page, setPage] = React.useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const [animals, setAnimals] = React.useState([]);
  const [pagination, setPagination] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const buildParams = React.useCallback(
    (overrides = {}) => {
      const t = overrides.type ?? type;
      const l = overrides.location ?? location;
      const lim = overrides.limit ?? limit;
      const p = overrides.page ?? page;

      const params = {
        type: t,
        page: p,
        limit: Number.parseInt(lim, 10) || 12,
      };
      const loc = String(l || "").trim();
      if (loc) params.location = loc;
      return params;
    },
    [type, location, limit, page]
  );

  function pushUrlParams(nextPage) {
    const params = {
      type,
      limit,
      page: String(nextPage),
    };
    const loc = location.trim();
    if (loc) params.location = loc;
    setSearchParams(params);
  }

  async function fetchAnimals(targetPage = page, overrides = {}) {
    setStatus("loading");
    setError("");
    try {
      const params = buildParams({ ...overrides, page: targetPage });
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

  React.useEffect(() => {
    const t = searchParams.get("type");
    const loc = searchParams.get("location") || "";
    const lim = searchParams.get("limit") || "12";
    const pg = Number.parseInt(searchParams.get("page") || "1", 10) || 1;

    if (t || loc || searchParams.get("page") || searchParams.get("limit")) {
      setType(t || "dog");
      setLocation(loc);
      setLimit(lim);
      setPage(pg);
      fetchAnimals(pg, { type: t || "dog", location: loc, limit: lim });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
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
    pushUrlParams(1);
    fetchAnimals(1);
  }

  function handlePrev() {
    if (!pagination) return;
    const next = Math.max(1, (pagination.current_page || page) - 1);
    setPage(next);
    pushUrlParams(next);
    fetchAnimals(next);
  }

  function handleNext() {
    if (!pagination) return;
    const total = pagination.total_pages || 1;
    const next = Math.min(total, (pagination.current_page || page) + 1);
    setPage(next);
    pushUrlParams(next);
    fetchAnimals(next);
  }

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
                <Link
                  to={`/details/${a.id}`}
                  state={{ from: `/search?${searchParams.toString()}` }}
                >
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

          <Pagination
            current={pagination?.current_page || page}
            total={pagination?.total_pages || 1}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}
    </>
  );
}
