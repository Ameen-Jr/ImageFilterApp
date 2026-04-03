import { expect, test } from "@playwright/test";

test.describe("Filter panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for sample image to load onto canvas
    await page.waitForTimeout(1000);
  });

  test("all filter buttons are visible", async ({ page }) => {
    const filters = [
      "Original",
      "Grayscale",
      "Sepia",
      "Invert",
      "Brightness / Contrast",
      "Fade",
      "Cross-Process",
      "Barrel Distortion",
      "Ripple / Wave",
      "Swirl",
    ];
    for (const label of filters) {
      await expect(page.getByRole("button", { name: label })).toBeVisible();
    }
  });

  test("clicking Grayscale highlights the button", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Grayscale" });
    await btn.click();
    // Active button has accent background color #7c3aed
    const bg = await btn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    // #7c3aed = rgb(124, 58, 237) — match regardless of alpha format
    expect(bg).toContain("124, 58, 237");
  });

  test("clicking Grayscale changes canvas pixel values", async ({ page }) => {
    // Read a pixel before filter
    const before = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const d = ctx.getImageData(50, 50, 1, 1).data;
      return [d[0], d[1], d[2]];
    });

    await page.getByRole("button", { name: "Grayscale" }).click();

    const after = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const d = ctx.getImageData(50, 50, 1, 1).data;
      return [d[0], d[1], d[2]];
    });

    // After grayscale, R=G=B
    expect(after[0]).toBe(after[1]);
    expect(after[1]).toBe(after[2]);
  });

  test("Original button resets to unfiltered image", async ({ page }) => {
    // Record original pixel
    const original = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const d = ctx.getImageData(50, 50, 1, 1).data;
      return [d[0], d[1], d[2]];
    });

    await page.getByRole("button", { name: "Grayscale" }).click();
    await page.getByRole("button", { name: "Original" }).click();

    const restored = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const d = ctx.getImageData(50, 50, 1, 1).data;
      return [d[0], d[1], d[2]];
    });

    expect(restored).toEqual(original);
  });
});
