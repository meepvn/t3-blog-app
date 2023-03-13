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
        tags: {
          select: {
            title: true,
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
        tags: {
          select: {
            title: true,
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
        tags: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const _tags = input.tags.map((tag) => {
        return {
          id: tag,
        };
      });
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          title: input.title,
          userId,
          tags: {
            connect: _tags,
          },
        },
      });
    }),
});
