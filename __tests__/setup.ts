// Polyfill ImageData for jsdom
if (typeof ImageData === "undefined") {
  (global as unknown as Record<string, unknown>).ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    colorSpace: string = "srgb";
    constructor(widthOrData: number | Uint8ClampedArray, height: number) {
      if (typeof widthOrData === "number") {
        this.width = widthOrData;
        this.height = height;
        this.data = new Uint8ClampedArray(widthOrData * height * 4);
      } else {
        this.data = widthOrData;
        this.width = widthOrData.length / 4 / height;
        this.height = height;
      }
    }
  };
}

// Mock HTMLCanvasElement.getContext for jsdom
HTMLCanvasElement.prototype.getContext = function (
  contextId: string
): CanvasRenderingContext2D | null {
  if (contextId !== "2d") return null;

  // Each canvas element holds its own pixel buffer keyed by dimensions
  if (!this._pixelData || this._pixelData.length !== this.width * this.height * 4) {
    this._pixelData = new Uint8ClampedArray(this.width * this.height * 4);
  }

  const self = this;

  return {
    fillStyle: "",
    fillRect(x: number, y: number, w: number, h: number) {
      const color = parseFillStyle(this.fillStyle as string);
      if (!color) return;
      for (let row = y; row < y + h; row++) {
        for (let col = x; col < x + w; col++) {
          const i = (row * self.width + col) * 4;
          self._pixelData[i] = color[0];
          self._pixelData[i + 1] = color[1];
          self._pixelData[i + 2] = color[2];
          self._pixelData[i + 3] = color[3] ?? 255;
        }
      }
    },
    getImageData(x: number, y: number, sw: number, sh: number): ImageData {
      const out = new Uint8ClampedArray(sw * sh * 4);
      for (let row = 0; row < sh; row++) {
        for (let col = 0; col < sw; col++) {
          const src = ((y + row) * self.width + (x + col)) * 4;
          const dst = (row * sw + col) * 4;
          out[dst] = self._pixelData[src];
          out[dst + 1] = self._pixelData[src + 1];
          out[dst + 2] = self._pixelData[src + 2];
          out[dst + 3] = self._pixelData[src + 3];
        }
      }
      return { data: out, width: sw, height: sh, colorSpace: "srgb" } as ImageData;
    },
    putImageData(imageData: ImageData, dx: number, dy: number) {
      for (let row = 0; row < imageData.height; row++) {
        for (let col = 0; col < imageData.width; col++) {
          const src = (row * imageData.width + col) * 4;
          const dst = ((dy + row) * self.width + (dx + col)) * 4;
          self._pixelData[dst] = imageData.data[src];
          self._pixelData[dst + 1] = imageData.data[src + 1];
          self._pixelData[dst + 2] = imageData.data[src + 2];
          self._pixelData[dst + 3] = imageData.data[src + 3];
        }
      }
    },
  } as unknown as CanvasRenderingContext2D;
};

function parseFillStyle(style: string): [number, number, number, number] | null {
  const m = style.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return [+m[1], +m[2], +m[3], 255];
  return null;
}

declare global {
  interface HTMLCanvasElement {
    _pixelData: Uint8ClampedArray;
  }
}
