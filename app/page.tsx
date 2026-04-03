"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FilterPanel, {
  BrightnessContrastParams,
  FilterName,
} from "../components/FilterPanel";
import ImageUpload from "../components/ImageUpload";
import {
  downloadCanvas,
  getImageData,
  loadImageToCanvas,
  putImageData,
} from "../lib/canvasUtils";
import {
  applyBarrel,
  applyBrightnessContrast,
  applyCrossProcess,
  applyFade,
  applyGrayscale,
  applyInvert,
  applyRipple,
  applySepia,
  applySwirl,
} from "../lib/filters";

const FILTER_LABELS: Record<FilterName, string> = {
  original: "Original",
  grayscale: "Grayscale",
  sepia: "Sepia",
  invert: "Invert",
  "brightness-contrast": "Brightness / Contrast",
  fade: "Fade",
  "cross-process": "Cross-Process",
  barrel: "Barrel Distortion",
  ripple: "Ripple / Wave",
  swirl: "Swirl",
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterName>("original");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bcParams, setBcParams] = useState<BrightnessContrastParams>({
    brightness: 0,
    contrast: 0,
  });

  function applyFilter(name: FilterName, bc = bcParams) {
    const canvas = canvasRef.current;
    const original = originalRef.current;
    if (!canvas || !original) return;

    let result: ImageData;
    switch (name) {
      case "grayscale":           result = applyGrayscale(original); break;
      case "sepia":               result = applySepia(original); break;
      case "invert":              result = applyInvert(original); break;
      case "brightness-contrast": result = applyBrightnessContrast(original, bc.brightness, bc.contrast); break;
      case "fade":                result = applyFade(original); break;
      case "cross-process":       result = applyCrossProcess(original); break;
      case "barrel":              result = applyBarrel(original); break;
      case "ripple":              result = applyRipple(original); break;
      case "swirl":               result = applySwirl(original); break;
      default:
        result = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
    }
    putImageData(canvas, result);
  }

  const loadImage = useCallback(async (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await loadImageToCanvas(src, canvas);
    originalRef.current = getImageData(canvas);
    setActiveFilter("original");
    setBcParams({ brightness: 0, contrast: 0 });
    setImageLoaded(true);
  }, []);

  useEffect(() => { loadImage("/sample.png"); }, [loadImage]);

  function handleFilterSelect(name: FilterName) {
    setActiveFilter(name);
    applyFilter(name);
  }

  function handleBcChange(params: BrightnessContrastParams) {
    setBcParams(params);
    applyFilter("brightness-contrast", params);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080810", overflow: "hidden" }}>
      <FilterPanel
        active={activeFilter}
        onSelect={handleFilterSelect}
        bcParams={bcParams}
        onBcChange={handleBcChange}
        onDownload={() => { const c = canvasRef.current; if (c) downloadCanvas(c, "filtered-image.png"); }}
      />

      {/* Right pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: "12px 24px",
          borderBottom: "1px solid #1e1e2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "rgba(8,8,16,0.8)",
          backdropFilter: "blur(12px)",
          gap: "16px",
        }}>
          {/* Active filter badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              padding: "4px 12px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "20px",
              fontSize: "0.75rem",
              color: "#a78bfa",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}>
              {FILTER_LABELS[activeFilter]}
            </div>
            {activeFilter !== "original" && (
              <div style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "#7c3aed",
                boxShadow: "0 0 8px #7c3aed",
              }} />
            )}
          </div>

          <ImageUpload onImageLoad={loadImage} />
        </div>

        {/* Canvas stage */}
        <div style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          position: "relative",
          // Dot grid background
          backgroundImage: "radial-gradient(circle, #1e1e2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}>
          {/* Ambient glow behind canvas */}
          {imageLoaded && (
            <div style={{
              position: "absolute",
              width: "60%",
              height: "60%",
              background: "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
              borderRadius: "50%",
            }} />
          )}

          <div style={{
            position: "relative",
            borderRadius: "12px",
            padding: "3px",
            background: imageLoaded
              ? "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.3), rgba(124,58,237,0.6))"
              : "transparent",
          }} className={imageLoaded ? "canvas-glow" : ""}>
            <div style={{
              borderRadius: "10px",
              overflow: "hidden",
              background: "#0e0e1a",
            }}>
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 130px)",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Empty state hint */}
          {!imageLoaded && (
            <div style={{
              position: "absolute",
              color: "#2a2a3a",
              fontSize: "0.875rem",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px", opacity: 0.4 }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto", display: "block" }}>
                  <rect x="4" y="4" width="40" height="40" rx="8" stroke="#3d3d5c" strokeWidth="2" />
                  <circle cx="18" cy="18" r="4" stroke="#3d3d5c" strokeWidth="2" />
                  <path d="M4 32l10-10 8 8 6-6 16 16" stroke="#3d3d5c" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              Loading preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
