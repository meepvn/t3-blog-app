import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })
  ),
  getOneById: publicProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
      include: {
        user: {
          select: {
            image: true,
            name: true,
          },
        },
      },
    })
  ),
  addPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user.id) return null;
      const userId = ctx.session?.user.id;
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          userId,
        },
      });
    }),
});
