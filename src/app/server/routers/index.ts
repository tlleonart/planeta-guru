import { createCallerFactory, router } from "../trpc/trpc";
import { adBannerRouter } from "./ad-banner-router";
import { legalsRouter } from "./legals-router";
import { packRouter } from "./pack-router";
import { productRouter } from "./product-router";
import { subscriptionRouter } from "./subscription-router";
import { walletRouter } from "./wallet-router";

export const appRouter = router({
  wallet: walletRouter,
  legals: legalsRouter,
  product: productRouter,
  adBanner: adBannerRouter,
  pack: packRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
