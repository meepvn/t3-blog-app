import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.tag.findMany()),
  addTag: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.tag.create({
      data: {
        title: input,
      },
    });
  }),
});
