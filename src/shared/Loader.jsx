import React from "react";

export default function Loader({ text = "Loading..." }) {
  return <p aria-live="polite">{text}</p>;
}
