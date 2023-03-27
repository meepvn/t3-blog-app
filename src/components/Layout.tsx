import type { PropsWithChildren } from "react";

export default function PageLayout(props: PropsWithChildren) {
  return (
    <main className="flex min-h-screen justify-center bg-gray-800">
      <div className="h-screen w-3/4 border-x border-green-500">
        {props.children}
      </div>
    </main>
  );
}
