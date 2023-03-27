import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { GetStaticPaths, GetStaticProps } from "next";

import { api } from "~/utils/api";

import Link from "next/link";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("No slug");

  await ssg.post.ById.prefetch(slug);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const SinglePost = ({ slug }: { slug: string }) => {
  const { data: post, isLoading } = api.post.ById.useQuery(slug);
  if (isLoading) return <div>Is loading ...</div>;
  if (!post) return <div>404</div>;
  return (
    <div>
      <Link href={"/"}>Home</Link>
      {post?.title}
    </div>
  );
};

export default SinglePost;
