import { z } from "zod";
import { paginationSchema } from "@/modules/shared/lib/utils";
import { productService } from "@/modules/shared/services/product-service";
import { protectedProcedure, publicProcedure, router } from "../trpc/trpc";

const getProductsSchema = paginationSchema.extend({
  search: z.string().max(100).optional(),
  categoryId: z.number().positive().optional(),
});

const getUserProductsSchema = paginationSchema.extend({
  orderBy: z.enum(["created_at", "updated_at"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const productRouter = router({
  getProducts: publicProcedure
    .input(getProductsSchema.optional())
    .query(async ({ input, ctx }) => {
      return productService.getProducts(input ?? {}, ctx.requestContext);
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number().positive(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { categoryId, ...params } = input;
      return productService.getProductsByCategory(
        categoryId,
        params,
        ctx.requestContext,
      );
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { query, ...params } = input;
      return productService.searchProducts(query, params, ctx.requestContext);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return productService.getProductBySlug(input.slug, ctx.requestContext);
    }),

  getFeatured: publicProcedure
    .input(z.object({ sectionId: z.number().positive().optional() }).optional())
    .query(async ({ input, ctx }) => {
      return productService.getFeaturedProducts(
        input ?? {},
        ctx.requestContext,
      );
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    return productService.getCategories(ctx.requestContext);
  }),

  getUserProducts: protectedProcedure
    .input(getUserProductsSchema.optional())
    .query(async ({ input, ctx }) => {
      return productService.getUserProducts(input ?? {}, ctx.requestContext);
    }),

  getDownloads: protectedProcedure
    .input(getUserProductsSchema.optional())
    .query(async ({ input, ctx }) => {
      return productService.getDownloads(input ?? {}, ctx.requestContext);
    }),

  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    return productService.getFavorites(ctx.requestContext);
  }),

  addFavorite: protectedProcedure
    .input(z.object({ productId: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      return productService.addFavorite(input.productId, ctx.requestContext);
    }),

  removeFavorite: protectedProcedure
    .input(z.object({ favoriteId: z.number().positive() }))
    .mutation(async ({ input, ctx }) => {
      await productService.removeFavorite(input.favoriteId, ctx.requestContext);
      return { success: true };
    }),
});

export type ProductRouter = typeof productRouter;
