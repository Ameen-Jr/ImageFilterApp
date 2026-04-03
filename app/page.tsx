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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterName>("original");
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
      case "grayscale":
        result = applyGrayscale(original);
        break;
      case "sepia":
        result = applySepia(original);
        break;
      case "invert":
        result = applyInvert(original);
        break;
      case "brightness-contrast":
        result = applyBrightnessContrast(original, bc.brightness, bc.contrast);
        break;
      case "fade":
        result = applyFade(original);
        break;
      case "cross-process":
        result = applyCrossProcess(original);
        break;
      case "barrel":
        result = applyBarrel(original);
        break;
      case "ripple":
        result = applyRipple(original);
        break;
      case "swirl":
        result = applySwirl(original);
        break;
      default:
        // original — reset to source
        result = new ImageData(
          new Uint8ClampedArray(original.data),
          original.width,
          original.height
        );
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
  }, []);

  // Pre-load sample image on mount
  useEffect(() => {
    loadImage("/sample.png");
  }, [loadImage]);

  function handleFilterSelect(name: FilterName) {
    setActiveFilter(name);
    applyFilter(name);
  }

  function handleBcChange(params: BrightnessContrastParams) {
    setBcParams(params);
    applyFilter("brightness-contrast", params);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (canvas) downloadCanvas(canvas, "filtered-image.png");
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      <FilterPanel
        active={activeFilter}
        onSelect={handleFilterSelect}
        bcParams={bcParams}
        onBcChange={handleBcChange}
        onDownload={handleDownload}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 24px",
            borderBottom: "1px solid #2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Image Filter App
          </h1>
          <div style={{ width: "240px" }}>
            <ImageUpload onImageLoad={loadImage} />
          </div>
        </div>

        {/* Canvas area */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
