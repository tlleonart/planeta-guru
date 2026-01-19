import z from "zod";
import { paginationSchema } from "@/modules/shared/lib/utils";
import { packService } from "@/modules/shared/services/pack-service";
import { publicProcedure, router } from "../trpc/trpc";

const getPacksSchema = paginationSchema.extend({
  orderBy: z.enum(["created_at", "updated_at", "total_amount"]).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const packRouter = router({
  getPacks: publicProcedure
    .input(getPacksSchema.optional())
    .query(async ({ input, ctx }) => {
      return packService.getPacks(input ?? {}, ctx.requestContext);
    }),
});

export type PackRouter = typeof packRouter;
