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
        border: `2px dashed ${dragOver ? "#a78bfa" : "#2d2d2d"}`,
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: dragOver ? "#2a1f4a" : "#1a1a1a",
        transition: "all 0.15s ease",
      }}
    >
      <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.875rem" }}>
        Drop image here or click to browse
      </p>
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
