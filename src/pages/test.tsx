import Link from "next/link";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

export default function Test() {
  const { data } = api.post.byTag.useQuery("aefrxhlecj");
  return (
    <div>
      <Link href={"/"}>Home</Link>
      <div className="py-3"></div>
      <button onClick={() => void console.log(data)}>Click</button>
      <div className="py-1"></div>
      <Spinner />
    </div>
  );
}
