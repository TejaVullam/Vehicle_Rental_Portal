import { test, expect } from "@playwright/test";

test.describe("Marketplace Flow", () => {
  test("homepage loads and navigation works", async ({ page }) => {
    await page.goto("/");

    // Check header
    await expect(page.locator("h1")).toContainText("Your Next Adventure");

    // Navigate to vehicles
    await page.click("text=Find a Ride");
    await expect(page).toHaveURL(/\/vehicles/);
  });

  test("vehicles page shows filters", async ({ page }) => {
    await page.goto("/vehicles");

    // Verify filters exist
    await expect(page.locator('button:has-text("Cars")')).toBeVisible();
    await expect(page.locator('button:has-text("Bikes")')).toBeVisible();
  });
});
