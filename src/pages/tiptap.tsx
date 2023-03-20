import { useState } from "react";
import Tiptap from "~/components/TipTap";

export default function TipTapPage() {
  const [input, setInput] = useState("");
  const setText = (text: string) => {
    setInput(text);
  };
  return (
    <div>
      <Tiptap setRichText={setText} />
      <button onClick={() => void console.log(input)}>Click me</button>
    </div>
  );
}
