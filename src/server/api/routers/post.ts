import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
      orderBy: {
        createdAt: "desc",
      },
    })
  ),
  ById: publicProcedure.input(z.string()).query(({ ctx, input }) =>
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
  ByAuthorId: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
  ),
  addPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        title: z.string(),
        tags: z.array(z.string()),
        summary: z.string(),
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
          summary: input.summary,
          tags: {
            connect: _tags,
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const selectedPost = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
      });
      if (!selectedPost)
        return new TRPCError({
          code: "NOT_FOUND",
        });
      if (selectedPost.userId !== ctx.session.user.id)
        return new TRPCError({
          code: "UNAUTHORIZED",
        });
      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
});
