import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import { type GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";
import TipTapEditor from "~/components/TipTap";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  const tags = await prisma.tag.findMany();
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
      tags,
    },
  };
};

type Input = {
  title: string;
  content: string;
  tags: string[];
  summary: string;
};

type Tag = {
  id: string;
  title: string;
};

const initialInput = {
  title: "",
  content: "",
  tags: [],
  summary: "",
};

const CreatePost = ({
  sessionData,
  tags,
}: {
  sessionData: Session;
  tags: Tag[];
}) => {
  const [input, setInput] = useState<Input>({ ...initialInput });
  const { mutate: createPost } = api.post.addPost.useMutation({
    onSuccess: () => void refetch(),
  });
  // const { data: tags } = api.tag.getAll.useQuery();
  const { refetch } = api.post.getAll.useQuery();
  const handleTagsChanges = (tagId: string) => {
    const { tags } = input;
    if (tags.includes(tagId))
      return setInput({ ...input, tags: tags.filter((tag) => tag !== tagId) });
    setInput({ ...input, tags: [...input.tags, tagId] });
  };
  const handleRichTextChanges = (text: string) => {
    setInput((prev) => ({ ...prev, content: text }));
  };
  return (
    <>
      <Head>
        <title>Create your post</title>
      </Head>
      <main className="mx-auto flex min-h-screen flex-col items-center ">
        <Link href="/">To home page</Link>
        <div className="absolute top-4 right-4 self-end">
          <img
            src={sessionData.user.image ?? ""}
            alt=""
            className="w-24 rounded-full"
          />
        </div>
        <p>Post title</p>
        <textarea
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="h-12 w-1/2 border border-black text-black"
        />
        <br />
        <p>Post summary</p>
        <textarea
          value={input.summary}
          onChange={(e) => setInput({ ...input, summary: e.target.value })}
          className="h-12 w-1/2 border border-black text-black"
        />
        <br />
        <p>Post content</p>
        <TipTapEditor setRichText={handleRichTextChanges} />
        {tags &&
          tags.map((tag) => (
            <div key={tag.id}>
              <label>{`${tag.title} : `}</label>
              <input
                type="checkbox"
                checked={input.tags.includes(tag.id)}
                onChange={() => handleTagsChanges(tag.id)}
              />
            </div>
          ))}
        <button
          onClick={() => {
            createPost(input);
            setInput({ ...initialInput });
          }}
          className="rounded-lg border border-green-500 bg-green-500 p-1 hover:text-gray-300"
        >
          Create post
        </button>
      </main>
    </>
  );
};

export default CreatePost;
