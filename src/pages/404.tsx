import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div>
      <Link href={"/"}>Home</Link>
      <p className="">404 not found</p>
    </div>
  );
};

export default NotFoundPage;
