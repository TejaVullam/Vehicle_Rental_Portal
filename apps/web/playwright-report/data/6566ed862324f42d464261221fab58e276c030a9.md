# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> user can login successfully
- Location: e2e\auth.spec.ts:25:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Invalid credentials')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Invalid credentials')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e3]:
            - generic [ref=e4]:
                - link "RideConnect" [ref=e5] [cursor=pointer]:
                    - /url: /
                    - img [ref=e6]
                    - generic [ref=e10]: RideConnect
                - navigation [ref=e11]:
                    - link "Browse Vehicles" [ref=e12] [cursor=pointer]:
                        - /url: /vehicles
            - navigation [ref=e14]:
                - link "Login" [ref=e15] [cursor=pointer]:
                    - /url: /login
                - link "Sign Up" [ref=e16] [cursor=pointer]:
                    - /url: /register
    - main [ref=e17]:
        - generic [ref=e18]:
            - generic [ref=e19]:
                - generic [ref=e21]: RideConnect
                - blockquote [ref=e23]:
                    - paragraph [ref=e24]: '"This platform revolutionized how I travel. I can rent a beautiful Porsche for the weekend or a sturdy bike for the trail seamlessly."'
                    - generic [ref=e25]: Sofia Davis, Verified Renter
            - generic [ref=e27]:
                - generic [ref=e28]:
                    - heading "Welcome back" [level=1] [ref=e29]
                    - paragraph [ref=e30]: Enter your email to sign in to your account
                - generic [ref=e31]:
                    - generic [ref=e32]: An error occurred during login
                    - generic [ref=e33]:
                        - text: Email
                        - textbox "Email" [ref=e34]:
                            - /placeholder: m@example.com
                            - text: not-exist@example.com
                    - generic [ref=e35]:
                        - generic [ref=e36]:
                            - generic [ref=e37]: Password
                            - link "Forgot password?" [ref=e38] [cursor=pointer]:
                                - /url: "#"
                        - textbox "Password" [ref=e39]: WrongPassword123!
                    - button "Sign In" [ref=e40] [cursor=pointer]
                - paragraph [ref=e41]:
                    - text: Don't have an account?
                    - link "Sign up" [ref=e42] [cursor=pointer]:
                        - /url: /register
    - contentinfo [ref=e43]:
        - generic [ref=e44]:
            - paragraph [ref=e45]: Built by RideConnect Inc. The leading P2P vehicle marketplace.
            - generic [ref=e46]:
                - link "Terms" [ref=e47] [cursor=pointer]:
                    - /url: "#"
                - link "Privacy" [ref=e48] [cursor=pointer]:
                    - /url: "#"
                - link "Contact" [ref=e49] [cursor=pointer]:
                    - /url: "#"
    - alert [ref=e50]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Authentication Flow', () => {
  4  |   const randomEmail = `e2e-user-${Date.now()}@example.com`;
  5  |   const password = 'Password123!';
  6  |
  7  |   test('user can register and gets redirected to dashboard', async ({ page }) => {
  8  |     await page.goto('/register');
  9  |
  10 |     // Fill in registration form
  11 |     await page.fill('input[name="firstName"]', 'E2E');
  12 |     await page.fill('input[name="lastName"]', 'Tester');
  13 |     await page.fill('input[name="email"]', randomEmail);
  14 |     await page.fill('input[name="password"]', password);
  15 |
  16 |     // Submit form
  17 |     await page.click('button[type="submit"]');
  18 |
  19 |     // Should redirect to profile page and show the user's name
  20 |     await expect(page).toHaveURL(/\/profile/);
  21 |     await expect(page.locator('text=Your Dashboard')).toBeVisible();
  22 |     await expect(page.locator(`text=${randomEmail}`)).toBeVisible();
  23 |   });
  24 |
  25 |   test('user can login successfully', async ({ page }) => {
  26 |     // We expect the user to be created in the previous test (these run sequentially in the same worker or we use a fresh user)
  27 |     // To make this fully isolated, let's create a new user or rely on the previous one. Playwright tests can run in parallel,
  28 |     // so it's better to register a fresh one or just attempt login with a known bad one first.
  29 |
  30 |     await page.goto('/login');
  31 |
  32 |     // Attempt invalid login
  33 |     await page.fill('input[name="email"]', 'not-exist@example.com');
  34 |     await page.fill('input[name="password"]', 'WrongPassword123!');
  35 |     await page.click('button[type="submit"]');
  36 |
  37 |     // Expect error
> 38 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  39 |   });
  40 | });
  41 |
```
