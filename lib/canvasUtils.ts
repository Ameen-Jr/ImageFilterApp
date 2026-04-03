export async function loadImageToCanvas(
  src: string,
  canvas: HTMLCanvasElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function getImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d")!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function putImageData(
  canvas: HTMLCanvasElement,
  data: ImageData
): void {
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(data, 0, 0);
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}
