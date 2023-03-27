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
        tags: {},
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
  byTag: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const postsPromise = ctx.prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: input,
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {},
      },
    });
    const tagPromise = ctx.prisma.tag.findUnique({
      where: {
        id: input,
      },
      select: {
        title: true,
      },
    });

    const [posts, tag] = await Promise.all([postsPromise, tagPromise]);
    if (!tag)
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    return {
      tag: tag.title,
      posts,
    };
  }),
  ByOwner: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
  ),
  add: protectedProcedure
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
