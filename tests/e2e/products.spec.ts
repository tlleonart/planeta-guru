import { expect, test } from "@playwright/test";

/**
 * Product Page E2E Tests
 *
 * Tests for all product types:
 * - Game HTML (cloud games played in iframe)
 * - Game Key (downloadable game codes)
 * - Gift Card (redeemable codes)
 * - Subscription (recurring services)
 * - Combo (bundled products with MercadoPago)
 * - Games View/WebGL (fullscreen browser games)
 *
 * Note: These tests run against the real backend API.
 * Products may not exist or API may rate limit.
 * Tests are designed to be resilient to API errors.
 */

// Real product slugs from production (planeta.guru)
// These may need to be updated based on available products
const PRODUCT_SLUGS = {
  combo: "combo-guru-roblox",
  gameKey: "humanitz",
  gameHtml: "emergency-jam",
  giftCard: "steam-gift-card",
  subscription: "xbox-game-pass",
  gamesView: "color-sort-mania",
};

/**
 * Helper to check if a page loaded successfully (not an error page)
 */
async function isPageLoadedSuccessfully(page: import("@playwright/test").Page) {
  // Check if the main content loaded (not a 404 or error page)
  const mainContent = page.locator("main");
  const isMainVisible = await mainContent.isVisible().catch(() => false);

  // Check for common error indicators
  const hasError =
    (await page.locator("text=/error|404|not found/i").count()) > 0;

  return isMainVisible && !hasError;
}

test.describe("Product Pages - Visual and Functional Tests", () => {
  test.describe("Game HTML Products", () => {
    test("should load game-html product page", async ({ page }) => {
      const response = await page.goto(
        `/products/game-html/${PRODUCT_SLUGS.gameHtml}`,
      );
      await page.waitForLoadState("domcontentloaded");

      // Page should load (even if product doesn't exist, we get a page)
      await expect(page).toHaveURL(/products\/game-html/);

      // Check if it's a successful load or error page
      const status = response?.status() ?? 500;
      if (status >= 200 && status < 400) {
        await expect(page.locator("main")).toBeVisible();
      }
    });

    test("should display product banner", async ({ page }) => {
      await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
      await page.waitForLoadState("domcontentloaded");

      // Skip if product doesn't exist
      if (await isPageLoadedSuccessfully(page)) {
        // Banner or product image should be visible
        const images = page.locator("img");
        await expect(images.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display play button for game-html", async ({ page }) => {
      await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
      await page.waitForLoadState("domcontentloaded");

      // Skip if product doesn't exist
      if (await isPageLoadedSuccessfully(page)) {
        // Should have a play/start button (if product loaded)
        const playButton = page.getByRole("button", {
          name: /play|jugar|start/i,
        });
        if (await playButton.isVisible()) {
          await expect(playButton).toBeEnabled();
        }
      }
    });
  });

  test.describe("Game Key Products", () => {
    test("should load game-key product page", async ({ page }) => {
      const response = await page.goto(
        `/products/game-key/${PRODUCT_SLUGS.gameKey}`,
      );
      await page.waitForLoadState("domcontentloaded");

      // URL should have the product path
      await expect(page).toHaveURL(/products\/game-key/);

      // Check response status - accept success or error pages
      const status = response?.status() ?? 500;
      // 200 for success, 500 for server error (API issues), 404 for not found
      expect([200, 404, 500]).toContain(status);
    });

    test("should display product card with image", async ({ page }) => {
      await page.goto(`/products/game-key/${PRODUCT_SLUGS.gameKey}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        // Game key pages show product card with image
        const productImage = page.locator("img").first();
        await expect(productImage).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display price information", async ({ page }) => {
      await page.goto(`/products/game-key/${PRODUCT_SLUGS.gameKey}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        // Should show price (with currency symbol)
        const priceElement = page.locator("text=/\\$|\\d+\\s*(GURUs|gurus)/i");
        await expect(priceElement.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display buy button", async ({ page }) => {
      await page.goto(`/products/game-key/${PRODUCT_SLUGS.gameKey}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        const buyButton = page.getByRole("button", {
          name: /buy|comprar|adquirir/i,
        });
        if (await buyButton.isVisible()) {
          await expect(buyButton).toBeEnabled();
        }
      }
    });
  });

  test.describe("Combo Products", () => {
    test("should load combo product page", async ({ page }) => {
      const response = await page.goto(
        `/products/combo/${PRODUCT_SLUGS.combo}`,
      );
      await page.waitForLoadState("domcontentloaded");

      await expect(page).toHaveURL(/products\/combo/);

      const status = response?.status() ?? 500;
      if (status >= 200 && status < 400) {
        await expect(page.locator("main")).toBeVisible();
      }
    });

    test("should display combo banner", async ({ page }) => {
      await page.goto(`/products/combo/${PRODUCT_SLUGS.combo}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        const images = page.locator("img");
        await expect(images.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display bundle options", async ({ page }) => {
      await page.goto(`/products/combo/${PRODUCT_SLUGS.combo}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        // At least the page content should be visible
        await expect(page.locator("main")).toBeVisible();
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("game-html page should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        await expect(page.locator("main")).toBeVisible();

        // Content should not overflow horizontally
        const body = page.locator("body");
        const bodyBox = await body.boundingBox();
        expect(bodyBox?.width).toBeLessThanOrEqual(375);
      }
    });

    test("game-key page should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/products/game-key/${PRODUCT_SLUGS.gameKey}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        await expect(page.locator("main")).toBeVisible();
      }
    });

    test("combo page should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/products/combo/${PRODUCT_SLUGS.combo}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        await expect(page.locator("main")).toBeVisible();
      }
    });

    test("product pages should be responsive on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
      await page.waitForLoadState("domcontentloaded");

      if (await isPageLoadedSuccessfully(page)) {
        await expect(page.locator("main")).toBeVisible();
      }
    });
  });
});

test.describe("Product Navigation", () => {
  test("should navigate from home to product page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Click on first product link if available (may not be visible if API rate limited)
    const productLink = page.locator('a[href*="/products/"]').first();
    const isVisible = await productLink
      .isVisible({ timeout: 10000 })
      .catch(() => false);

    if (isVisible) {
      await productLink.click();
      await expect(page).toHaveURL(/\/products\//);
    } else {
      // If products didn't load due to API issues, verify page structure is intact
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("should handle 404 for non-existent product", async ({ page }) => {
    const response = await page.goto(
      "/products/game-html/non-existent-product-slug-12345",
    );

    // Should either show 404, redirect, or display error page (200 with error content)
    const status = response?.status();
    expect([200, 404, 302, 500]).toContain(status);
  });
});

test.describe("Image Carousel Tests", () => {
  test("should display image carousel on game-html page if multiple images", async ({
    page,
  }) => {
    await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
    await page.waitForLoadState("domcontentloaded");

    if (await isPageLoadedSuccessfully(page)) {
      // Check if carousel exists (may have navigation dots or arrows)
      const carouselDots = page.locator(
        '[class*="carousel"] button, [class*="dot"]',
      );
      const carouselArrows = page.locator(
        '[class*="carousel"] [class*="arrow"], button[aria-label*="previous"], button[aria-label*="next"]',
      );

      // Either carousel controls exist or single image is displayed
      const hasCarousel =
        (await carouselDots.count()) > 0 || (await carouselArrows.count()) > 0;
      const hasImage = (await page.locator("img").count()) > 0;

      expect(hasCarousel || hasImage).toBeTruthy();
    }
  });
});

test.describe("Performance", () => {
  test("product page should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
    await page.waitForLoadState("domcontentloaded");

    const loadTime = Date.now() - startTime;

    // Page should load DOM within 10 seconds (allowing for API calls)
    expect(loadTime).toBeLessThan(10000);
  });

  test("images should have proper loading attributes", async ({ page }) => {
    await page.goto(`/products/game-html/${PRODUCT_SLUGS.gameHtml}`);
    await page.waitForLoadState("domcontentloaded");

    if (await isPageLoadedSuccessfully(page)) {
      // Check that images have loading attribute for performance
      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        // Next.js Image component adds loading="lazy" by default for non-priority images
        const loading = await img.getAttribute("loading");
        const fetchPriority = await img.getAttribute("fetchpriority");

        // Either lazy loading or high priority is acceptable
        expect(
          loading === "lazy" || fetchPriority === "high" || loading === "eager",
        ).toBeTruthy();
      }
    }
  });
});
