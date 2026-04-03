export function sampleBilinear(
  src: ImageData,
  x: number,
  y: number
): [number, number, number, number] {
  const { width, height, data } = src;

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const fx = x - x0;
  const fy = y - y0;

  const clampX = (v: number) => Math.max(0, Math.min(width - 1, v));
  const clampY = (v: number) => Math.max(0, Math.min(height - 1, v));

  function px(px: number, py: number): [number, number, number, number] {
    const i = (clampY(py) * width + clampX(px)) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }

  const [r00, g00, b00, a00] = px(x0, y0);
  const [r10, g10, b10, a10] = px(x1, y0);
  const [r01, g01, b01, a01] = px(x0, y1);
  const [r11, g11, b11, a11] = px(x1, y1);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return [
    Math.round(lerp(lerp(r00, r10, fx), lerp(r01, r11, fx), fy)),
    Math.round(lerp(lerp(g00, g10, fx), lerp(g01, g11, fx), fy)),
    Math.round(lerp(lerp(b00, b10, fx), lerp(b01, b11, fx), fy)),
    Math.round(lerp(lerp(a00, a10, fx), lerp(a01, a11, fx), fy)),
  ];
}
