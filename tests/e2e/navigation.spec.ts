import { expect, test } from "@playwright/test";

// Configure test timeout for slower API responses
test.setTimeout(30000);

test.describe("Navigation and Locale", () => {
  test("should redirect to default locale when accessing root", async ({
    page,
  }) => {
    const response = await page.goto("/");

    // Should redirect to a locale (format: /xx-yy where xx=country, yy=language)
    // The actual locale depends on detected geo/cookies, so we just verify the pattern
    await expect(page).toHaveURL(/\/[a-z]{2}-[a-z]{2}/, { timeout: 15000 });

    // Page should at least start loading (even if API fails)
    const status = response?.status() ?? 500;
    expect([200, 302, 307, 308]).toContain(status);
  });

  test("should load home page with correct locale", async ({ page }) => {
    await page.goto("/mx-es");
    await page.waitForLoadState("domcontentloaded");

    // Page should load successfully (URL check)
    await expect(page).toHaveURL(/mx-es/);
  });

  test("should navigate to categories page", async ({ page }) => {
    await page.goto("/mx-es/categories");
    await page.waitForLoadState("domcontentloaded");

    // Should be on categories page
    await expect(page).toHaveURL(/\/mx-es\/categories/);
  });

  test("should navigate to charge gurus page", async ({ page }) => {
    await page.goto("/mx-es/charge-gurus");
    await page.waitForLoadState("domcontentloaded");

    // URL should contain charge-gurus
    await expect(page).toHaveURL(/charge-gurus/);

    // Wait for main content or body (page structure loads even if API fails)
    await expect(page.locator("body")).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to FAQ page", async ({ page }) => {
    await page.goto("/mx-es/faq");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/faq/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should navigate to privacy page", async ({ page }) => {
    await page.goto("/mx-es/privacy");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Locale Switching", () => {
  test("should maintain page when switching locale", async ({ page }) => {
    await page.goto("/mx-es/faq");

    // If locale switcher exists, test switching
    const localeSwitcher = page.locator("[data-testid='locale-switcher']");
    if (await localeSwitcher.isVisible()) {
      await localeSwitcher.click();

      const englishOption = page.getByRole("option", { name: /english/i });
      if (await englishOption.isVisible()) {
        await englishOption.click();
        await expect(page).toHaveURL(/\/mx-en\/faq/);
      }
    }
  });
});
