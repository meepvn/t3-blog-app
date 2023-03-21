import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faCode,
  faRedo,
  faUndo,
  faList,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex w-1/2 gap-2 rounded-t-xl border-2 border-black bg-white p-2">
      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
        className={
          editor?.isActive("bold")
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <FontAwesomeIcon icon={faBold} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor?.isActive("italic")
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <FontAwesomeIcon icon={faItalic} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <span className="h-5 w-5 p-1 text-2xl font-bold">H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <span className="h-5 w-5 p-1 text-2xl font-bold">H2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock")
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <FontAwesomeIcon icon={faCode} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor?.isActive("bulletList")
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <FontAwesomeIcon icon={faList} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor?.isActive("orderedList")
            ? "rounded-md bg-black text-white"
            : "rounded-md hover:bg-black hover:text-white"
        }
      >
        <FontAwesomeIcon icon={faListOl} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <FontAwesomeIcon icon={faUndo} className="h-5 w-5 p-1 pb-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <FontAwesomeIcon icon={faRedo} className="h-5 w-5 p-1 pb-0" />
      </button>
    </div>
  );
};

const Tiptap = ({ setRichText }: { setRichText: (text: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setRichText(editor.getHTML());
    },
  });
  return (
    <div className="flex w-full flex-col items-center justify-center text-black">
      <MenuBar editor={editor} />
      <div className="w-1/2 rounded-b-xl border-2 border-t-0 border-black bg-white p-2 focus:outline-4 focus:outline-blue-200">
        <EditorContent editor={editor} className="p-2" />
      </div>
    </div>
  );
};

export default Tiptap;
