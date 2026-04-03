"use client";

import { useRef, useState } from "react";

interface Props {
  onImageLoad: (src: string) => void;
}

export default function ImageUpload({ onImageLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onImageLoad(e.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragOver(false)}
      onClick={() => inputRef.current?.click()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 16px",
        borderRadius: "10px",
        border: `1.5px dashed ${dragOver ? "#a78bfa" : "#2a2a3a"}`,
        background: dragOver
          ? "rgba(124,58,237,0.12)"
          : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={(e) => {
        if (!dragOver) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#4b3d6e";
          (e.currentTarget as HTMLDivElement).style.background = "rgba(124,58,237,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!dragOver) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a3a";
          (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
        }
      }}
    >
      <div style={{
        width: "30px", height: "30px",
        borderRadius: "8px",
        background: dragOver
          ? "rgba(124,58,237,0.3)"
          : "rgba(124,58,237,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.2s",
      }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M10 14V4M6 8l4-4 4 4" stroke="#a78bfa" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 15v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"
            stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ color: "#d1d5db", fontSize: "0.8rem", fontWeight: 500 }}>
          Upload Image
        </div>
        <div style={{ color: "#4b5563", fontSize: "0.7rem" }}>
          Drop or click to browse
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );
}
