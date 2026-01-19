import { legalsService } from "@/modules/shared/services/legals-service";
import { publicProcedure, router } from "../trpc/trpc";

export const legalsRouter = router({
  getLegalsUrls: publicProcedure.query(async ({ ctx }) => {
    return legalsService.getLegalsUrls(ctx.requestContext);
  }),

  getTermsUrl: publicProcedure.query(async ({ ctx }) => {
    return legalsService.getTermsUrl(ctx.requestContext);
  }),

  getPrivacyUrl: publicProcedure.query(async ({ ctx }) => {
    return legalsService.getPrivacyUrl(ctx.requestContext);
  }),
});

export type LegalsRouter = typeof legalsRouter;
