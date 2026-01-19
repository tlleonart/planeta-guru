import { z } from "zod";
import { walletService } from "@/modules/shared/services/wallet-service";
import { protectedProcedure, router } from "../trpc/trpc";

const walletHistorySchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(20),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const walletRouter = router({
  getWallet: protectedProcedure.query(async ({ ctx }) => {
    return walletService.getWallet(ctx.requestContext);
  }),

  getBalance: protectedProcedure.query(async ({ ctx }) => {
    return walletService.getBalance(ctx.requestContext);
  }),

  getOutcomes: protectedProcedure
    .input(walletHistorySchema.optional())
    .query(async ({ input, ctx }) => {
      return walletService.getOutcomes(input ?? {}, ctx.requestContext);
    }),

  getIncomes: protectedProcedure
    .input(walletHistorySchema.optional())
    .query(async ({ input, ctx }) => {
      return walletService.getIncomes(input ?? {}, ctx.requestContext);
    }),
});

export type WalletRouter = typeof walletRouter;
