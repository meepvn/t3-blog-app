import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import User from "~/components/User";
import Spinner, { SpinnerPage } from "~/components/Spinner";
import { useState } from "react";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const [creating, setCreating] = useState(false);
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="t3 blog app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-800">
        {creating && <SpinnerPage />}
        <div className="flex justify-between gap-5 px-10 py-5 text-white">
          <div className="flex gap-5">
            <Link href={"/"} className=" hover:text-gray-300">
              Home
            </Link>
            <Link
              href={"/create-post"}
              className="hover:text-gray-300"
              onClick={() => void setCreating(true)}
            >
              Create a post
            </Link>
          </div>
          <div>
            <User />
          </div>
        </div>
        <div>
          <Posts />
        </div>
      </main>
    </>
  );
};

export default Home;

const Posts = () => {
  const { data: posts, isLoading } = api.post.getAll.useQuery();
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  return (
    <div className="grid grid-cols-2 text-white">
      {posts?.map((post) => (
        <div
          key={post.id}
          className="m-5 flex flex-col rounded-2xl border border-white p-3 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
        >
          <div className="flex gap-5 ">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.id}`}
                className="rounded-lg border border-green-400 p-1 font-semibold hover:text-green-500"
              >
                {tag.title}
              </Link>
            ))}
          </div>
          <Link
            className="block cursor-pointer py-2 text-2xl font-extrabold text-green-500 hover:text-green-700"
            href={`/post/${post.id}`}
          >
            {post.title}
          </Link>
          <p className="italic">
            <span>{post.summary}</span>
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-5">
              <img
                src={post.user.image ?? ""}
                alt=""
                className="w-20 rounded-full"
              />
              <span className="font-bold">{post.user.name}</span>
            </div>
            <span className="italic">{dayjs(post.createdAt).fromNow()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
