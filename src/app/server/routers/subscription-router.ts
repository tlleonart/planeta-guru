import { subscriptionService } from "@/modules/shared/services/subscription-service";
import { protectedProcedure, router } from "../trpc/trpc";

export const subscriptionRouter = router({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    return subscriptionService.getSubscription(ctx.requestContext);
  }),
});

export type SubscriptionRouter = typeof subscriptionRouter;
