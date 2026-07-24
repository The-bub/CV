import { useEffect, useState } from "react";

// Live palette comparison. "" = sapin (default tokens in :root).
const OPTIONS = [
  { id: "", label: "Sapin", sw: "#4fa587" },
  { id: "vermillon", label: "Vermillon", sw: "#ff5a2d" },
  { id: "platine", label: "Platine", sw: "#c9cdc6" },
];

function apply(id) {
  const root = document.documentElement;
  if (id) root.setAttribute("data-palette", id);
  else root.removeAttribute("data-palette");
}

export default function PaletteSwitcher() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("cv-palette") || "";
    setActive(stored);
    apply(stored);
  }, []);

  const pick = (id) => {
    setActive(id);
    apply(id);
    localStorage.setItem("cv-palette", id);
  };

  return (
    <div className="palette-switch" role="group" aria-label="Choix de palette">
      <span className="palette-switch__label">Palette</span>
      {OPTIONS.map((o) => (
        <button
          key={o.id || "vermillon"}
          type="button"
          className={
            "palette-switch__sw" + (active === o.id ? " is-active" : "")
          }
          style={{ "--sw": o.sw }}
          onClick={() => pick(o.id)}
          aria-label={o.label}
          aria-pressed={active === o.id}
          title={o.label}
        />
      ))}
    </div>
  );
}
