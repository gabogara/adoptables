import React from "react";

export default function Modal({
  title = "Confirm",
  children,
  onClose,
  onConfirm,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 16,
          maxWidth: 420,
          width: "100%",
          borderRadius: 6,
        }}
      >
        <h3 id="modal-title" style={{ marginTop: 0 }}>
          {title}
        </h3>
        <div style={{ marginBottom: 12 }}>{children}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
