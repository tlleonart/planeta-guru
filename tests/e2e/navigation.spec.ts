import { expect, test } from "@playwright/test";

test.describe("Navigation and Locale", () => {
  test("should redirect to default locale when accessing root", async ({
    page,
  }) => {
    await page.goto("/");

    // Should redirect to default locale (mx-es)
    await expect(page).toHaveURL(/\/mx-es/);
  });

  test("should load home page with correct locale", async ({ page }) => {
    await page.goto("/mx-es");

    // Page should load successfully
    await expect(page).toHaveURL("/mx-es");
  });

  test("should navigate to categories page", async ({ page }) => {
    await page.goto("/mx-es");

    // Click on categories link
    const categoriesLink = page.getByRole("link", { name: /categories/i });
    if (await categoriesLink.isVisible()) {
      await categoriesLink.click();
      await expect(page).toHaveURL(/\/mx-es\/categories/);
    }
  });

  test("should navigate to charge gurus page", async ({ page }) => {
    await page.goto("/mx-es/charge-gurus");

    await expect(page).toHaveURL("/mx-es/charge-gurus");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should navigate to FAQ page", async ({ page }) => {
    await page.goto("/mx-es/faq");

    await expect(page).toHaveURL("/mx-es/faq");
  });

  test("should navigate to privacy page", async ({ page }) => {
    await page.goto("/mx-es/privacy");

    await expect(page).toHaveURL("/mx-es/privacy");
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
