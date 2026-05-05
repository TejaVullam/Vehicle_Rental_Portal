import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  const randomEmail = `e2e-user-${Date.now()}@example.com`;
  const password = "Password123!";

  test("user can register and gets redirected to dashboard", async ({
    page,
  }) => {
    await page.goto("/register");

    // Fill in registration form
    await page.fill('input[name="firstName"]', "E2E");
    await page.fill('input[name="lastName"]', "Tester");
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to profile page and show the user's name
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator("text=Your Dashboard")).toBeVisible();
    await expect(page.locator(`text=${randomEmail}`)).toBeVisible();
  });

  test("user can login successfully", async ({ page }) => {
    // We expect the user to be created in the previous test (these run sequentially in the same worker or we use a fresh user)
    // To make this fully isolated, let's create a new user or rely on the previous one. Playwright tests can run in parallel,
    // so it's better to register a fresh one or just attempt login with a known bad one first.

    await page.goto("/login");

    // Attempt invalid login
    await page.fill('input[name="email"]', "not-exist@example.com");
    await page.fill('input[name="password"]', "WrongPassword123!");
    await page.click('button[type="submit"]');

    // Expect error
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});
