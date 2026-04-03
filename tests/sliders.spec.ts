import { expect, test } from "@playwright/test";

test.describe("Brightness/Contrast sliders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Brightness / Contrast" }).click();
  });

  test("sliders are visible when filter is active", async ({ page }) => {
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
    await expect(page.locator('input[type="range"]').nth(1)).toBeVisible();
  });

  test("moving brightness slider changes canvas pixels", async ({ page }) => {
    const before = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      return ctx.getImageData(50, 50, 1, 1).data[0];
    });

    // Set brightness to 80
    await page.locator('input[type="range"]').first().fill("80");
    await page.locator('input[type="range"]').first().dispatchEvent("change");

    const after = await page.evaluate(() => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      return ctx.getImageData(50, 50, 1, 1).data[0];
    });

    expect(after).not.toBe(before);
  });
});
