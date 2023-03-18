import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function PostDetail() {
  const router = useRouter();
  const id = router.query.postId as string;
  const { data: post, status } = api.post.ById.useQuery(id);
  if (status !== "success")
    return (
      <div className="min-h-screen bg-gray-800 text-white">Loading ...</div>
    );
  dayjs.extend(relativeTime);
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <main className="min-h-screen bg-gray-800 text-white">
        <Link href={"/"}>Home page</Link>
        <div className="m-auto flex w-1/2 flex-col items-center text-justify">
          <h1 className="p-3 text-4xl text-green-500">{post?.title}</h1>
          <p className="text-2xl">{post?.content}</p>
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
