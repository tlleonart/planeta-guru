import { adBannerService } from "@/modules/shared/services/ad-banner-service";
import { publicProcedure, router } from "../trpc/trpc";

export const adBannerRouter = router({
  getAdBanner: publicProcedure.query(async ({ ctx }) => {
    return adBannerService.getAdBanner(ctx.requestContext);
  }),
});

export type AdBannerRouter = typeof adBannerRouter;
