import Head from "next/head";
import Link from "next/link";
import { type GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  if (!session)
    return {
      props: {},
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  return {
    props: {
      sessionData: session,
    },
  };
};

export default function MyPosts({ sessionData }: { sessionData: Session }) {
  const { data: posts } = api.post.ByAuthorId.useQuery();

  return (
    <>
      <Head>
        <title>{sessionData.user.name}&apos;s posts</title>
      </Head>
      <main className="min-h-screen bg-gray-800 text-white">
        <Link href={"/"}>Home</Link>
        <div className="p-3"></div>
        <div className="flex items-center gap-5">
          <img
            src={sessionData.user.image ?? ""}
            alt=""
            className="w-24 cursor-pointer rounded-full"
          />
          <p className="text-5xl">{sessionData.user.name}'s posts</p>
        </div>
        <div className="p-3"></div>
        {posts?.map((post) => (
          <>
            <div
              key={post.id}
              className="w-2/3 rounded-2xl border border-green-500"
            >
              <p className="p-2 text-3xl font-bold">{post.title}</p>
              <p className="p-2 italic">{post.summary}</p>
            </div>
            <div className="p-3"></div>
          </>
        ))}
        {posts?.length === 0 && (
          <div className="text-2xl text-white">You don't have any posts</div>
        )}
      </main>
    </>
  );
}
