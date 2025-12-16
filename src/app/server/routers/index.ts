import { createCallerFactory, router } from "../trpc/trpc";
import { adBannerRouter } from "./ad-banner-router";
import { legalsRouter } from "./legals-router";
import { productRouter } from "./product-router";
import { walletRouter } from "./wallet-router";

export const appRouter = router({
  wallet: walletRouter,
  legals: legalsRouter,
  product: productRouter,
  adBanner: adBannerRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
