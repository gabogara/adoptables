import React from "react";
export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{ background: "#fee", border: "1px solid #f99", padding: 12 }}
    >
      <strong>Error: </strong>
      {message}
    </div>
  );
}
