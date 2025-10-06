import React from "react";

export default function NavBar({ children }) {
  return (
    <nav style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
      {children}
    </nav>
  );
}
