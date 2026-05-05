# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> user can register and gets redirected to dashboard
- Location: e2e\auth.spec.ts:7:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/profile/
Received string:  "http://localhost:3000/register"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/register"

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
            - generic [ref=e20]:
                - generic [ref=e21]:
                    - heading "Create an account" [level=1] [ref=e22]
                    - paragraph [ref=e23]: Enter your details below to create your account
                - generic [ref=e24]:
                    - generic [ref=e25]: An error occurred during registration
                    - generic [ref=e26]:
                        - generic [ref=e27]:
                            - text: First name
                            - textbox "First name" [ref=e28]: E2E
                        - generic [ref=e29]:
                            - text: Last name
                            - textbox "Last name" [ref=e30]: Tester
                    - generic [ref=e31]:
                        - text: Email
                        - textbox "Email" [ref=e32]:
                            - /placeholder: m@example.com
                            - text: e2e-user-1778021089740@example.com
                    - generic [ref=e33]:
                        - text: Password
                        - textbox "Password" [ref=e34]: Password123!
                    - button "Create account" [ref=e35] [cursor=pointer]
                - paragraph [ref=e36]:
                    - text: By clicking create account, you agree to our
                    - link "Terms of Service" [ref=e37] [cursor=pointer]:
                        - /url: /terms
                    - text: and
                    - link "Privacy Policy" [ref=e38] [cursor=pointer]:
                        - /url: /privacy
                    - text: .
                - paragraph [ref=e39]:
                    - text: Already have an account?
                    - link "Sign in" [ref=e40] [cursor=pointer]:
                        - /url: /login
            - blockquote [ref=e44]:
                - paragraph [ref=e45]: '"Listing my extra car on RideConnect pays for its own maintenance and gives me an incredible passive income stream."'
                - generic [ref=e46]: Alex Chen, Verified Owner
    - contentinfo [ref=e47]:
        - generic [ref=e48]:
            - paragraph [ref=e49]: Built by RideConnect Inc. The leading P2P vehicle marketplace.
            - generic [ref=e50]:
                - link "Terms" [ref=e51] [cursor=pointer]:
                    - /url: "#"
                - link "Privacy" [ref=e52] [cursor=pointer]:
                    - /url: "#"
                - link "Contact" [ref=e53] [cursor=pointer]:
                    - /url: "#"
    - alert [ref=e54]
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
> 20 |     await expect(page).toHaveURL(/\/profile/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  38 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
  39 |   });
  40 | });
  41 |
```
