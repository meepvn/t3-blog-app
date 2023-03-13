import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Session } from "next-auth";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  if (!session)
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  return {
    props: {
      sessionData: session,
    },
  };
};

type Input = {
  title: string;
  content: string;
  tags: string[];
};

const initialInput = {
  title: "",
  content: "",
  tags: [],
};

const CreatePost = ({ sessionData }: { sessionData: Session }) => {
  const [input, setInput] = useState<Input>({ ...initialInput });
  const { mutate: createPost } = api.post.addPost.useMutation();
  const { data: tags } = api.tag.getAll.useQuery();
  const handleTagsChanges = (tagId: string) => {
    const { tags } = input;
    if (tags.includes(tagId))
      return setInput({ ...input, tags: tags.filter((tag) => tag !== tagId) });
    setInput({ ...input, tags: [...input.tags, tagId] });
  };
  return (
    <>
      <Head>
        <title>Create your post</title>
      </Head>
      <main className="min-h-screen">
        <Link href="/">To home page</Link>
        <p>Hello {sessionData?.user.name}</p>
        <p>Post title</p>
        <input
          type="text"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="border border-black"
        />
        <p>Post content</p>
        <input
          type="text"
          value={input.content}
          onChange={(e) => setInput({ ...input, content: e.target.value })}
          className="border border-black"
        />
        <br />
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
        >
          Create post
        </button>
        <br />
        <button onClick={() => console.log(input)}>Show</button>
      </main>
    </>
  );
};

export default CreatePost;
