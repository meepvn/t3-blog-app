import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const User = () => {
  const { data: sessionData, status } = useSession();
  const [toggleInfo, setToggleInfo] = useState(false);
  if (status === "loading") return null;
  if (status === "unauthenticated")
    return <Link href={"/api/auth/signin"}>Sign in</Link>;
  return (
    <div className="relative flex text-white">
      <img
        src={sessionData?.user.image ?? ""}
        alt=""
        className="w-16 cursor-pointer rounded-full"
        onClick={() => setToggleInfo(!toggleInfo)}
      />
      {toggleInfo && (
        <div className="absolute top-full right-0 mt-1 flex w-64 flex-col items-center rounded-lg bg-gray-500 text-xl">
          <span>Hello, {sessionData?.user.name}</span>
          <Link
            href={"/my-posts"}
            className="block w-full text-center hover:bg-green-500"
          >
            My posts
          </Link>
          <button
            onClick={() => void signOut()}
            className="block w-full hover:rounded-br-lg hover:rounded-bl-lg hover:bg-green-500"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
