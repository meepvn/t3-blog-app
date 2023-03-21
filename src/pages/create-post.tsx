import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import { type GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";
import TipTapEditor from "~/components/TipTap";
import User from "~/components/User";
import { postInputValidator } from "~/utils/validators";
import { z, ZodError } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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

type Input = z.infer<typeof postInputValidator>;

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
  const router = useRouter();
  const handleTagsChanges = (tagId: string) => {
    const { tags } = input;
    if (tags.includes(tagId))
      return setInput({ ...input, tags: tags.filter((tag) => tag !== tagId) });
    setInput({ ...input, tags: [...input.tags, tagId] });
  };
  const handleRichTextChanges = (text: string) => {
    setInput((prev) => ({ ...prev, content: text }));
  };
  const handleCreatePost = () => {
    try {
      const parsed = postInputValidator.parse(input);
      createPost(parsed);
      toast.success("Successfully created");
      router.push("/");
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((_err) => void toast.error(_err.message));
      }
    }
  };
  return (
    <>
      <Head>
        <title>Create your post</title>
      </Head>
      <main className="mx-auto flex min-h-screen flex-col items-center bg-gray-800 text-white">
        <Link href="/" className="self-start">
          Home
        </Link>
        <div className="absolute top-4 right-4 self-end">
          <User />
        </div>
        <p className="text-5xl">Post title</p>
        <input
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="block h-16 w-1/2 rounded-md border-none text-black outline-none focus:bg-gray-300 focus:outline-4 focus:outline-blue-100"
        />
        <br />
        <p className="text-5xl">Post summary</p>
        <input
          value={input.summary}
          onChange={(e) => setInput({ ...input, summary: e.target.value })}
          className="block h-16 w-1/2 rounded-md border-none text-black outline-none focus:bg-gray-300 focus:outline-4 focus:outline-blue-100"
        />
        <br />
        <p className="text-5xl">Post content</p>
        <TipTapEditor setRichText={handleRichTextChanges} />
        <span className="py-5 text-center text-5xl">Tags</span>
        <div className="flex flex-col rounded-lg border-4 border-white p-5 text-2xl">
          {tags &&
            tags.map((tag) => (
              <div key={tag.id} className="pb-2">
                <label
                  htmlFor={tag.title}
                  className="inline-block w-80"
                >{`${tag.title} : `}</label>
                <input
                  type="checkbox"
                  checked={input.tags.includes(tag.id)}
                  onChange={() => handleTagsChanges(tag.id)}
                  id={tag.title}
                />
              </div>
            ))}
        </div>
        <div className="p-5"></div>
        <button
          onClick={() => void handleCreatePost()}
          className="rounded-lg border border-green-500 bg-green-500 p-3 hover:text-gray-300"
        >
          Create post
        </button>
      </main>
    </>
  );
};

export default CreatePost;
