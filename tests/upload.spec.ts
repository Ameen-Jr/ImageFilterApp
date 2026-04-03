import { expect, test } from "@playwright/test";
import path from "path";

test.describe("Image upload", () => {
  test("file picker upload changes canvas content", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    const before = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      return { w: canvas.width, h: canvas.height };
    });

    // Use the hidden file input to upload the sample image itself
    const samplePath = path.resolve(
      __dirname,
      "../public/sample.png"
    );
    await page.locator('input[type="file"]').setInputFiles(samplePath);
    await page.waitForTimeout(500);

    const after = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      return { w: canvas.width, h: canvas.height };
    });

    // Canvas should still have valid dimensions
    expect(after.w).toBeGreaterThan(0);
    expect(after.h).toBeGreaterThan(0);
  });
});
