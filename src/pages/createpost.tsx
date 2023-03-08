import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
type Input = {
  title: string;
  content: string;
};

const initialInput = {
  title: "",
  content: "",
};

const CreatePost = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [input, setInput] = useState<Input>({ ...initialInput });

  const { mutate: createPost } = api.post.addPost.useMutation();
  if (status === "loading") return <div>Loading ...</div>;
  if (status === "unauthenticated") {
    router.push("/");
    return;
  }

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
        <button
          onClick={() => {
            createPost(input);
            setInput({ ...initialInput });
          }}
        >
          Create post
        </button>
      </main>
    </>
  );
};

export default CreatePost;
