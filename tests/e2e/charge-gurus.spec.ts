import { expect, test } from "@playwright/test";

test.describe("Charge Gurus Flow", () => {
  test("should display list of packs", async ({ page }) => {
    await page.goto("/charge-gurus");

    // Wait for packs to load
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check that pack cards are displayed
    const packCards = page.locator("[data-testid='pack-card']");
    await expect(packCards.first()).toBeVisible();
  });

  test("should navigate to payment detail when clicking a pack", async ({
    page,
  }) => {
    await page.goto("/charge-gurus");

    // Click on first pack
    const firstPack = page.locator("[data-testid='pack-card']").first();
    await firstPack.click();

    // Should navigate to payment detail page
    await expect(page).toHaveURL(/\/charge-gurus\/payments\/.*/);
  });

  test("should show payment methods on detail page", async ({ page }) => {
    // Navigate directly to a payment detail page
    await page.goto("/charge-gurus/payments/1/100/50/5/55");

    // Check payment methods are visible
    await expect(
      page.getByRole("heading", { name: /payment method/i }),
    ).toBeVisible();
  });

  test("should show subscription card for Mexico locale", async ({ page }) => {
    await page.goto("/charge-gurus");

    // Subscription card should be visible for Mexico
    const subscriptionCard = page.locator("[data-testid='subscription-card']");
    await expect(subscriptionCard).toBeVisible();
  });
});

test.describe("Payment Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/charge-gurus/payments/1/100/50/5/55");
  });

  test("should open payment summary modal when selecting method", async ({
    page,
  }) => {
    // Click on credit card method
    const creditCardMethod = page.locator(
      "[data-testid='payment-method-CREDIT_CARD']",
    );
    await creditCardMethod.click();

    // Payment summary modal should open
    await expect(
      page.locator("[data-testid='payment-summary-modal']"),
    ).toBeVisible();
  });

  test("should show correct pack value in summary", async ({ page }) => {
    const creditCardMethod = page.locator(
      "[data-testid='payment-method-CREDIT_CARD']",
    );
    await creditCardMethod.click();

    // Check that summary shows correct values
    await expect(page.getByText("100 GURUs")).toBeVisible();
  });
});
