import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import WarningModal from "~/components/WarningModal";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

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
  const { data: posts, refetch } = api.post.ByAuthorId.useQuery();
  const { mutate: deletePost } = api.post.delete.useMutation({
    onSuccess: () => void refetch(),
  });
  const [deleting, setDeleting] = useState(false);
  const selectedPost = useRef<string>("");
  return (
    <>
      <Head>
        <title>{sessionData.user.name}&apos;s posts</title>
      </Head>
      <main className="min-h-screen bg-gray-800 text-white">
        {deleting && (
          <WarningModal
            warningText="Delete this post ?"
            cancel={() => void setDeleting(false)}
            callback={() => {
              deletePost(selectedPost.current);
              setDeleting(false);
              toast.success("Successfully deleted", {
                autoClose: 1000,
              });
            }}
          />
        )}
        <Link href={"/"}>Home</Link>
        <div className="p-3"></div>
        <div className="flex items-center gap-5">
          <img
            src={sessionData.user.image ?? ""}
            alt=""
            className="w-24 cursor-pointer rounded-full"
          />
          <p className="text-5xl">{sessionData.user.name}&apos;s posts</p>
        </div>
        <div className="p-3"></div>
        {posts?.map((post) => (
          <div key={post.id}>
            <div className="relative w-2/3 rounded-2xl border border-white">
              <div className="flex items-center justify-between p-2">
                <p className="text-3xl font-bold text-green-500">
                  {post.title}
                </p>
                <div className="text-3xl">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => {
                      prompt(post.id);
                    }}
                    className="cursor-pointer text-blue-400"
                  />
                  <span className="px-2"></span>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => {
                      selectedPost.current = post.id;
                      setDeleting(true);
                    }}
                    className="cursor-pointer text-red-500"
                  />
                </div>
              </div>
              <p className="p-2 italic">{post.summary}</p>
            </div>
            <div className="p-3"></div>
          </div>
        ))}
        {posts?.length === 0 && (
          <div className="text-2xl text-white">
            You don&apos;t have any posts
          </div>
        )}
      </main>
    </>
  );
}
