import { sampleBilinear } from "./bilinear";

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function copyImageData(src: ImageData): ImageData {
  const out = new ImageData(src.width, src.height);
  out.data.set(src.data);
  return out;
}

export function applyGrayscale(src: ImageData): ImageData {
  const out = copyImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = clamp(gray);
  }
  return out;
}

export function applySepia(src: ImageData): ImageData {
  const out = copyImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    d[i]     = clamp(r * 0.393 + g * 0.769 + b * 0.189);
    d[i + 1] = clamp(r * 0.349 + g * 0.686 + b * 0.168);
    d[i + 2] = clamp(r * 0.272 + g * 0.534 + b * 0.131);
  }
  return out;
}

export function applyInvert(src: ImageData): ImageData {
  const out = copyImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  }
  return out;
}

export function applyBrightnessContrast(
  src: ImageData,
  brightness: number,
  contrast: number
): ImageData {
  // brightness: -100 to 100 (offset), contrast: -100 to 100 (factor)
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const out = copyImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = clamp(factor * (d[i]     - 128) + 128 + brightness);
    d[i + 1] = clamp(factor * (d[i + 1] - 128) + 128 + brightness);
    d[i + 2] = clamp(factor * (d[i + 2] - 128) + 128 + brightness);
  }
  return out;
}

export function applyFade(src: ImageData): ImageData {
  const out = copyImageData(src);
  const d = out.data;
  const floor = 40;
  const scale = (255 - floor * 2) / 255;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = clamp(d[i]     * scale + floor);
    d[i + 1] = clamp(d[i + 1] * scale + floor);
    d[i + 2] = clamp(d[i + 2] * scale + floor);
  }
  return out;
}

// Simple LUT curve: maps 0-255 to a shaped output per channel
function buildCurve(
  shadows: number,
  midBoost: number,
  highlights: number
): Uint8Array {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    // Cubic bezier-like blend of shadows/mids/highlights
    const val =
      shadows * (1 - t) * (1 - t) +
      midBoost * 2 * t * (1 - t) +
      highlights * t * t;
    lut[i] = clamp(val);
  }
  return lut;
}

export function applyCrossProcess(src: ImageData): ImageData {
  const redLUT   = buildCurve(0,   200, 255); // boost shadows, saturate
  const greenLUT = buildCurve(20,  100, 200); // flatten green mid
  const blueLUT  = buildCurve(60,  160, 255); // lift shadows, boost highlights

  const out = copyImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = redLUT[d[i]];
    d[i + 1] = greenLUT[d[i + 1]];
    d[i + 2] = blueLUT[d[i + 2]];
  }
  return out;
}

export function applyBarrel(src: ImageData, k = 0.3): ImageData {
  const { width, height } = src;
  const out = new ImageData(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / maxR;
      const ny = (y - cy) / maxR;
      const r2 = nx * nx + ny * ny;
      const scale = 1 + k * r2;
      const sx = nx * scale * maxR + cx;
      const sy = ny * scale * maxR + cy;
      const [r, g, b, a] = sampleBilinear(src, sx, sy);
      const i = (y * width + x) * 4;
      out.data[i] = r; out.data[i+1] = g; out.data[i+2] = b; out.data[i+3] = a;
    }
  }
  return out;
}

export function applyRipple(
  src: ImageData,
  amplitude = 12,
  frequency = 0.05
): ImageData {
  const { width, height } = src;
  const out = new ImageData(width, height);

  for (let y = 0; y < height; y++) {
    const offsetX = amplitude * Math.sin(y * frequency);
    for (let x = 0; x < width; x++) {
      const sx = x + offsetX;
      const [r, g, b, a] = sampleBilinear(src, sx, y);
      const i = (y * width + x) * 4;
      out.data[i] = r; out.data[i+1] = g; out.data[i+2] = b; out.data[i+3] = a;
    }
  }
  return out;
}

export function applySwirl(src: ImageData, angle = 2.0): ImageData {
  const { width, height } = src;
  const out = new ImageData(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const theta = Math.atan2(dy, dx);
      const swirlAngle = angle * (1 - r / maxR);
      const srcAngle = theta + swirlAngle;
      const sx = cx + r * Math.cos(srcAngle);
      const sy = cy + r * Math.sin(srcAngle);
      const [rv, g, b, a] = sampleBilinear(src, sx, sy);
      const i = (y * width + x) * 4;
      out.data[i] = rv; out.data[i+1] = g; out.data[i+2] = b; out.data[i+3] = a;
    }
  }
  return out;
}
