"use client";

import type { ReactElement } from "react";

export type FilterName =
  | "original"
  | "grayscale"
  | "sepia"
  | "invert"
  | "brightness-contrast"
  | "fade"
  | "cross-process"
  | "barrel"
  | "ripple"
  | "swirl";

export interface BrightnessContrastParams {
  brightness: number;
  contrast: number;
}

interface Props {
  active: FilterName;
  onSelect: (name: FilterName) => void;
  bcParams: BrightnessContrastParams;
  onBcChange: (params: BrightnessContrastParams) => void;
  onDownload: () => void;
}

// Inline SVG icons — 20×20 viewBox
const icons: Record<FilterName, ReactElement> = {
  original: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  grayscale: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v16A8 8 0 0 0 10 2z" fill="currentColor" />
    </svg>
  ),
  sepia: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 5V3M13 5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  invert: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="10" r="5" fill="currentColor" />
      <circle cx="13" cy="10" r="5" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "brightness-contrast": (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  fade: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="4" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="7" y="4" width="4" height="12" fill="currentColor" opacity="0.55" />
      <rect x="12" y="4" width="6" height="12" rx="1" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  "cross-process": (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  ),
  barrel: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 4C5 6 5 14 4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4C15 6 15 14 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 4C8 3 12 3 16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 16C8 17 12 17 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ripple: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M2 7 Q5 4 8 7 Q11 10 14 7 Q17 4 20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M2 13 Q5 10 8 13 Q11 16 14 13 Q17 10 20 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  ),
  swirl: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 10 Q14 6 14 10 Q14 15 10 15 Q5 15 5 10 Q5 4 11 4 Q17 4 17 10"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

const FILTERS: { name: FilterName; label: string; desc: string }[] = [
  { name: "original",           label: "Original",            desc: "No filter" },
  { name: "grayscale",          label: "Grayscale",           desc: "Luminance" },
  { name: "sepia",              label: "Sepia",               desc: "Vintage warm" },
  { name: "invert",             label: "Invert",              desc: "Negative" },
  { name: "brightness-contrast",label: "Brightness / Contrast", desc: "Sliders" },
  { name: "fade",               label: "Fade",                desc: "Washed-out film" },
  { name: "cross-process",      label: "Cross-Process",       desc: "Darkroom curves" },
  { name: "barrel",             label: "Barrel Distortion",   desc: "Lens warp" },
  { name: "ripple",             label: "Ripple / Wave",       desc: "Sine displacement" },
  { name: "swirl",              label: "Swirl",               desc: "Center rotation" },
];

export default function FilterPanel({ active, onSelect, bcParams, onBcChange, onDownload }: Props) {
  const bPct = ((bcParams.brightness + 100) / 200) * 100;
  const cPct = ((bcParams.contrast + 100) / 200) * 100;

  return (
    <div style={{
      width: "260px",
      flexShrink: 0,
      background: "linear-gradient(180deg, #0e0e1a 0%, #0a0a14 100%)",
      borderRight: "1px solid #1e1e2e",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: "22px 20px 18px",
        borderBottom: "1px solid #1e1e2e",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(124,58,237,0.4)",
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="5" stroke="white" strokeWidth="1.8" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{
              background: "linear-gradient(90deg, #a78bfa, #e879f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}>
              Filterforge
            </div>
            <div style={{ color: "#4b5563", fontSize: "0.65rem", letterSpacing: "0.06em" }}>
              STUDIO
            </div>
          </div>
        </div>
      </div>

      {/* Filter list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        <div style={{
          color: "#3d3d5c",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "4px 10px 10px",
        }}>
          Effects
        </div>

        {FILTERS.map(({ name, label, desc }) => {
          const isActive = active === name;
          return (
            <div key={name}>
              <button
                onClick={() => onSelect(name)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 400,
                  textAlign: "left",
                  transition: "all 0.18s ease",
                  position: "relative",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.12))"
                    : "transparent",
                  color: isActive ? "#c4b5fd" : "#6b7280",
                  boxShadow: isActive ? "inset 0 0 0 1px rgba(124,58,237,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget;
                    el.style.background = "rgba(124,58,237,0.08)";
                    el.style.color = "#a78bfa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget;
                    el.style.background = "transparent";
                    el.style.color = "#6b7280";
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div style={{
                    position: "absolute",
                    left: 0, top: "20%", bottom: "20%",
                    width: "3px",
                    borderRadius: "0 2px 2px 0",
                    background: "linear-gradient(180deg, #7c3aed, #a855f7)",
                    boxShadow: "0 0 8px rgba(124,58,237,0.8)",
                  }} />
                )}

                <span style={{ color: isActive ? "#a78bfa" : "#4b5563", flexShrink: 0 }}>
                  {icons[name]}
                </span>

                <div style={{ minWidth: 0 }}>
                  <div>{label}</div>
                  <div style={{
                    fontSize: "0.7rem",
                    color: isActive ? "#7c6aad" : "#374151",
                    marginTop: "1px",
                  }}>
                    {desc}
                  </div>
                </div>
              </button>

              {/* BC sliders */}
              {name === "brightness-contrast" && isActive && (
                <div style={{
                  margin: "4px 10px 8px",
                  padding: "12px 14px",
                  background: "rgba(124,58,237,0.06)",
                  borderRadius: "8px",
                  border: "1px solid rgba(124,58,237,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }} className="fade-up">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#6b7280", fontSize: "0.72rem", letterSpacing: "0.04em" }}>
                        BRIGHTNESS
                      </span>
                      <span style={{
                        color: "#a78bfa",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        background: "rgba(124,58,237,0.2)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}>
                        {bcParams.brightness > 0 ? `+${bcParams.brightness}` : bcParams.brightness}
                      </span>
                    </div>
                    <input
                      type="range" min={-100} max={100}
                      value={bcParams.brightness}
                      style={{ "--pct": `${bPct}%` } as React.CSSProperties}
                      onChange={(e) => onBcChange({ ...bcParams, brightness: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#6b7280", fontSize: "0.72rem", letterSpacing: "0.04em" }}>
                        CONTRAST
                      </span>
                      <span style={{
                        color: "#a78bfa",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        background: "rgba(124,58,237,0.2)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}>
                        {bcParams.contrast > 0 ? `+${bcParams.contrast}` : bcParams.contrast}
                      </span>
                    </div>
                    <input
                      type="range" min={-100} max={100}
                      value={bcParams.contrast}
                      style={{ "--pct": `${cPct}%` } as React.CSSProperties}
                      onChange={(e) => onBcChange({ ...bcParams, contrast: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Download */}
      <div style={{
        padding: "14px 14px 20px",
        borderTop: "1px solid #1e1e2e",
        flexShrink: 0,
      }}>
        <button
          onClick={onDownload}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "0 6px 28px rgba(124,58,237,0.6)";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "0 4px 20px rgba(124,58,237,0.35)";
            el.style.transform = "translateY(0)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M10 2v11M6 9l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Export PNG
        </button>
      </div>
    </div>
  );
}
