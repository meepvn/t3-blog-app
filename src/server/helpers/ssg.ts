import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: { prisma, session: null },
  transformer: superjson,
});
