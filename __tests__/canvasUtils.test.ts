import { getImageData, putImageData } from "../lib/canvasUtils";

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

describe("canvasUtils", () => {
  test("getImageData returns correct dimensions", () => {
    const canvas = makeCanvas(10, 10);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(100,150,200)";
    ctx.fillRect(0, 0, 10, 10);

    const data = getImageData(canvas);
    expect(data.width).toBe(10);
    expect(data.height).toBe(10);
    expect(data.data.length).toBe(10 * 10 * 4);
  });

  test("getImageData -> putImageData round-trip does not mutate pixels", () => {
    const canvas = makeCanvas(4, 4);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(123,45,67)";
    ctx.fillRect(0, 0, 4, 4);

    const before = getImageData(canvas);
    const snapshot = new Uint8ClampedArray(before.data);

    putImageData(canvas, before);

    const after = getImageData(canvas);
    for (let i = 0; i < snapshot.length; i++) {
      expect(after.data[i]).toBe(snapshot[i]);
    }
  });

  test("putImageData writes new pixel values correctly", () => {
    const canvas = makeCanvas(2, 2);
    const original = getImageData(canvas);

    // Paint all pixels red
    for (let i = 0; i < original.data.length; i += 4) {
      original.data[i] = 255;
      original.data[i + 1] = 0;
      original.data[i + 2] = 0;
      original.data[i + 3] = 255;
    }
    putImageData(canvas, original);

    const result = getImageData(canvas);
    expect(result.data[0]).toBe(255);
    expect(result.data[1]).toBe(0);
    expect(result.data[2]).toBe(0);
    expect(result.data[3]).toBe(255);
  });
});
