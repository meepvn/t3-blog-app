import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function PostDetail() {
  const router = useRouter();
  const id = router.query.postId as string;
  const { data: post, status } = api.post.getOneById.useQuery(id);
  if (status !== "success")
    return (
      <div className="min-h-screen bg-gray-800 text-white">Loading ...</div>
    );

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <main className="min-h-screen bg-gray-800 text-white">
        <Link href={"/"}>Home page</Link>
        <div className="m-auto w-1/2 text-justify">
          <h1 className="p-3 text-2xl text-green-500">{post?.title}</h1>
          <p>{post?.content}</p>
        </div>
      </main>
    </>
  );
}
