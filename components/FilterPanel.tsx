"use client";

import { useRef } from "react";

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

const FILTERS: { name: FilterName; label: string }[] = [
  { name: "original", label: "Original" },
  { name: "grayscale", label: "Grayscale" },
  { name: "sepia", label: "Sepia" },
  { name: "invert", label: "Invert" },
  { name: "brightness-contrast", label: "Brightness / Contrast" },
  { name: "fade", label: "Fade" },
  { name: "cross-process", label: "Cross-Process" },
  { name: "barrel", label: "Barrel Distortion" },
  { name: "ripple", label: "Ripple / Wave" },
  { name: "swirl", label: "Swirl" },
];

export default function FilterPanel({
  active,
  onSelect,
  bcParams,
  onBcChange,
  onDownload,
}: Props) {
  return (
    <div
      style={{
        width: "220px",
        flexShrink: 0,
        backgroundColor: "#1a1a1a",
        borderRight: "1px solid #2d2d2d",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        gap: "6px",
      }}
    >
      <p
        style={{
          color: "#9ca3af",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 8px 0",
        }}
      >
        Filters
      </p>

      {FILTERS.map(({ name, label }) => (
        <div key={name}>
          <button
            onClick={() => onSelect(name)}
            style={{
              width: "100%",
              padding: "9px 12px",
              textAlign: "left",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              backgroundColor: active === name ? "#7c3aed" : "transparent",
              color: active === name ? "#ffffff" : "#9ca3af",
              transition: "background-color 0.1s ease, color 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (active !== name) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2d2d2d";
                (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa";
              }
            }}
            onMouseLeave={(e) => {
              if (active !== name) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
              }
            }}
          >
            {label}
          </button>

          {name === "brightness-contrast" && active === "brightness-contrast" && (
            <div style={{ padding: "8px 4px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                Brightness: {bcParams.brightness}
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={bcParams.brightness}
                  onChange={(e) =>
                    onBcChange({ ...bcParams, brightness: Number(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "#7c3aed" }}
                />
              </label>
              <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                Contrast: {bcParams.contrast}
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={bcParams.contrast}
                  onChange={(e) =>
                    onBcChange({ ...bcParams, contrast: Number(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "#7c3aed" }}
                />
              </label>
            </div>
          )}
        </div>
      ))}

      <div style={{ flexGrow: 1 }} />

      <button
        onClick={onDownload}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          marginTop: "8px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6d28d9";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#7c3aed";
        }}
      >
        Download
      </button>
    </div>
  );
}
