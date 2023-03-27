import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotFound from "~/components/NotFound";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";

dayjs.extend(relativeTime);

const TagFilterPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data, isLoading } = api.post.byTag.useQuery(slug);
  if (isLoading) return <Spinner />;
  if (!data) return void router.push("404");
  const { posts, tag } = data;
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Link href={"/"}>Home</Link>
      <p>{tag}</p>
      <div className="grid grid-cols-2">
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
    </div>
  );
};

export default TagFilterPage;
