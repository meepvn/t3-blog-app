import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ssg } from "~/server/helpers/ssg";
import type { GetStaticPaths, GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
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

dayjs.extend(relativeTime);

export default function SinglePost({ slug }: { slug: string }) {
  const { data: post, status } = api.post.ById.useQuery(slug);
  if (status !== "success")
    return (
      <div className="min-h-screen bg-gray-800 text-white">Loading ...</div>
    );
  if (!post) return null;
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <main className="min-h-screen bg-gray-800 text-white">
        <Link href={"/"}>Home</Link>
        <div className="m-auto flex w-1/2 flex-col items-center text-justify">
          <h1 className="p-3 text-4xl text-green-500">{post?.title}</h1>
          <p
            className="post-content text-2xl"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></p>
          <div className="self-end">
            <div className="flex items-center gap-5">
              <span className="text-bold">{post?.user.name}</span>
              <img
                src={post?.user.image ?? ""}
                alt=""
                className="w-12 cursor-pointer rounded-full"
              />
            </div>
          </div>
          <span className="self-end italic">
            {dayjs(post?.createdAt).fromNow()}
          </span>
        </div>
      </main>
    </>
  );
}
