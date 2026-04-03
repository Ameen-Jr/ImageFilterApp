import { expect, test } from "@playwright/test";

test.describe("Download button", () => {
  test("clicking Download triggers a file download", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download" }).click(),
    ]);

    expect(download.suggestedFilename()).toBe("filtered-image.png");
  });
});
