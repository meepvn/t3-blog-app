import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import User from "~/components/User";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="t3 blog app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-800">
        <div className="flex justify-between gap-5 px-10 py-5 text-white">
          <div className="flex gap-5">
            <Link href={"/"} className=" hover:text-gray-300">
              Home
            </Link>
            <Link href={"/create-post"} className="hover:text-gray-300">
              Create a post
            </Link>
            <Link href={"/random"} className="hover:text-gray-300">
              Random
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
  const { data: posts } = api.post.getAll.useQuery();
  return (
    <div className="flex flex-wrap justify-center text-white">
      {posts?.map((post) => (
        <div
          key={post.id}
          className="m-5 flex flex-col rounded-2xl border border-white p-3 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
        >
          <div className="flex gap-5 ">
            {post.tags.map((tag) => (
              <div
                key={Math.random()}
                className="rounded-lg border border-green-400 p-1 font-semibold"
              >
                {tag.title}
              </div>
            ))}
          </div>
          <Link
            className="block cursor-pointer py-2 text-2xl font-extrabold text-green-500"
            href={`/post/${post.id}`}
          >
            {post.title}
          </Link>
          <Link
            className="block cursor-pointer py-2 text-2xl font-extrabold text-green-500"
            href={`/ssg/${post.id}`}
          >
            SSG
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
