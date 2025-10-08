import React from "react";

export default function Pagination({ current = 1, total = 1, onPrev, onNext }) {
  const atStart = current <= 1;
  const atEnd = current >= total;

  return (
    <div
      aria-label="Pagination"
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={atStart}
        aria-disabled={atStart}
      >
        Prev
      </button>
      <span aria-live="polite">
        Page <strong>{current}</strong> of <strong>{total}</strong>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        aria-disabled={atEnd}
      >
        Next
      </button>
    </div>
  );
}
