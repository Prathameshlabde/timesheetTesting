import React from "react";
export function getButton(title, onClick) {
  return (
    <div style={{ width: "30%" }}>
      <button
        type="button"
        className="btn-style pro-popup-btn boxShadowSpecific"
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
}
