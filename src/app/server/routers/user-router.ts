import { userService } from "@/modules/shared/services/user-services";
import { protectedProcedure, router } from "../trpc/trpc";

export const userRouter = router({
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
        return userService.getSubscription({}, ctx.requestContext)
    })
})

export type UserRouter = typeof userRouter