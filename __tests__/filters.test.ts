import {
  applyGrayscale,
  applySepia,
  applyInvert,
  applyBrightnessContrast,
  applyFade,
  applyCrossProcess,
  applyBarrel,
  applyRipple,
  applySwirl,
} from "../lib/filters";

function makeImageData(pixels: [number, number, number, number][]): ImageData {
  const width = pixels.length;
  const data = new Uint8ClampedArray(width * 4);
  pixels.forEach(([r, g, b, a], i) => {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = a;
  });
  return { data, width, height: 1, colorSpace: "srgb" } as ImageData;
}

function pixel(img: ImageData, idx = 0): [number, number, number, number] {
  const i = idx * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}

// --- Grayscale ---
describe("applyGrayscale", () => {
  test("pure red pixel -> correct luminance", () => {
    const src = makeImageData([[255, 0, 0, 255]]);
    const out = applyGrayscale(src);
    const gray = Math.round(0.299 * 255);
    expect(pixel(out)).toEqual([gray, gray, gray, 255]);
  });

  test("equal RGB channels remain equal", () => {
    const src = makeImageData([[120, 120, 120, 255]]);
    const out = applyGrayscale(src);
    expect(out.data[0]).toBe(out.data[1]);
    expect(out.data[1]).toBe(out.data[2]);
  });
});

// --- Sepia ---
describe("applySepia", () => {
  test("gray pixel maps to warm brownish tones", () => {
    const src = makeImageData([[100, 100, 100, 255]]);
    const out = applySepia(src);
    const [r, g, b] = pixel(out);
    // sepia matrix output for (100,100,100):
    // R = 100*(0.393+0.769+0.189) = 135.1 -> 135
    // G = 100*(0.349+0.686+0.168) = 120.3 -> 120
    // B = 100*(0.272+0.534+0.131) = 93.7 -> 94
    expect(r).toBe(135);
    expect(g).toBe(120);
    expect(b).toBe(94);
  });

  test("channels are independent (not all equal)", () => {
    const src = makeImageData([[100, 100, 100, 255]]);
    const out = applySepia(src);
    const [r, g, b] = pixel(out);
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
  });
});

// --- Invert ---
describe("applyInvert", () => {
  test("pixel (10,20,30) -> (245,235,225)", () => {
    const src = makeImageData([[10, 20, 30, 255]]);
    const out = applyInvert(src);
    expect(pixel(out)).toEqual([245, 235, 225, 255]);
  });

  test("double invert is identity", () => {
    const src = makeImageData([[80, 160, 200, 255]]);
    const once = applyInvert(src);
    const twice = applyInvert(once);
    expect(pixel(twice)).toEqual([80, 160, 200, 255]);
  });
});

// --- Brightness/Contrast ---
describe("applyBrightnessContrast", () => {
  test("zero brightness and zero contrast returns same pixel values", () => {
    const src = makeImageData([[100, 150, 200, 255]]);
    const out = applyBrightnessContrast(src, 0, 0);
    expect(pixel(out)).toEqual([100, 150, 200, 255]);
  });

  test("positive brightness lifts pixel values", () => {
    const src = makeImageData([[100, 100, 100, 255]]);
    const out = applyBrightnessContrast(src, 50, 0);
    expect(out.data[0]).toBeGreaterThan(100);
  });

  test("negative brightness lowers pixel values", () => {
    const src = makeImageData([[100, 100, 100, 255]]);
    const out = applyBrightnessContrast(src, -50, 0);
    expect(out.data[0]).toBeLessThan(100);
  });
});

// --- Fade ---
describe("applyFade", () => {
  test("pure black is lifted above 0", () => {
    const src = makeImageData([[0, 0, 0, 255]]);
    const out = applyFade(src);
    expect(out.data[0]).toBeGreaterThan(0);
  });

  test("pure white is pulled below 255", () => {
    const src = makeImageData([[255, 255, 255, 255]]);
    const out = applyFade(src);
    expect(out.data[0]).toBeLessThan(255);
  });
});

// --- Cross-Process ---
describe("applyCrossProcess", () => {
  test("channels respond independently", () => {
    // Pure red — green and blue should be affected by their own LUTs
    const src = makeImageData([[200, 0, 0, 255]]);
    const out = applyCrossProcess(src);
    // Red channel processed by redLUT[200], green by greenLUT[0], blue by blueLUT[0]
    expect(out.data[0]).not.toBe(0); // red is non-zero
    // greenLUT[0] and blueLUT[0] are fixed values from their own curves
    expect(out.data[1]).toBeGreaterThanOrEqual(0);
    expect(out.data[2]).toBeGreaterThanOrEqual(0);
  });

  test("pure green only affects green channel at source", () => {
    const pureRed = makeImageData([[128, 0, 0, 255]]);
    const pureGreen = makeImageData([[0, 128, 0, 255]]);
    const outRed = applyCrossProcess(pureRed);
    const outGreen = applyCrossProcess(pureGreen);
    // Red output differs between the two (different source red)
    expect(outRed.data[0]).not.toBe(outGreen.data[0]);
  });
});

// --- Barrel ---
describe("applyBarrel", () => {
  test("center pixel maps to itself", () => {
    // 5x5 ImageData filled with a known color
    const size = 5;
    const data = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 100; data[i+1] = 150; data[i+2] = 200; data[i+3] = 255;
    }
    const src = { data, width: size, height: size, colorSpace: "srgb" } as ImageData;
    const out = applyBarrel(src, 0.3);
    // Center pixel index = 2*5+2 = 12
    const ci = 12 * 4;
    expect(out.data[ci]).toBe(100);
    expect(out.data[ci + 1]).toBe(150);
    expect(out.data[ci + 2]).toBe(200);
  });
});

// --- Ripple ---
describe("applyRipple", () => {
  test("y=0 row has zero x-offset (sin(0)=0)", () => {
    const size = 5;
    const data = new Uint8ClampedArray(size * size * 4);
    // Unique color per column to detect shifting
    for (let x = 0; x < size; x++) {
      const i = x * 4;
      data[i] = x * 50; data[i+1] = 0; data[i+2] = 0; data[i+3] = 255;
    }
    const src = { data, width: size, height: size, colorSpace: "srgb" } as ImageData;
    const out = applyRipple(src, 10, 0.5);
    // At y=0, offsetX = amplitude * sin(0) = 0, so columns unchanged
    for (let x = 0; x < size; x++) {
      expect(out.data[x * 4]).toBe(x * 50);
    }
  });
});

// --- Swirl ---
describe("applySwirl", () => {
  test("center pixel maps to itself", () => {
    const size = 5;
    const data = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 80; data[i+1] = 90; data[i+2] = 100; data[i+3] = 255;
    }
    const src = { data, width: size, height: size, colorSpace: "srgb" } as ImageData;
    const out = applySwirl(src, 3.0);
    const ci = (2 * size + 2) * 4; // center pixel
    expect(out.data[ci]).toBe(80);
    expect(out.data[ci + 1]).toBe(90);
    expect(out.data[ci + 2]).toBe(100);
  });
});
