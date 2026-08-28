"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Nhập mô tả chi tiết cho theme bàn phím...",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-kawaii-babyblue font-bold underline transition hover:text-kawaii-warmbrown",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      // If empty paragraph, treat as empty string
      const cleanHtml = currentEditor.isEmpty ? "" : html;
      onChange?.(cleanHtml);
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[160px] max-h-[360px] w-full overflow-y-auto px-4 py-3 text-sm font-medium text-kawaii-mocha outline-none transition dark:text-foreground",
          "prose-kawaii",
        ),
      },
    },
  });

  // Synchronize external value changes (e.g. form reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (!value && editor.isEmpty) return;
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập địa chỉ URL liên kết (https://...):", previousUrl || "https://");

    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!isMounted || !editor) {
    return (
      <div className={cn("min-h-[220px] rounded-2xl border-2 border-kawaii-sky/40 bg-card/60 p-4 animate-pulse", className)} />
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-2 border-kawaii-sky/50 bg-card shadow-sm transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {/* Kawaii Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b-2 border-kawaii-sky/35 bg-kawaii-cloud/35 p-2 backdrop-blur-sm">
        {/* Bold */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="In đậm (Bold)"
          title="In đậm (Ctrl+B)"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("bold") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="In nghiêng (Italic)"
          title="In nghiêng (Ctrl+I)"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("italic") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Italic className="h-4 w-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Gạch chân (Underline)"
          title="Gạch chân (Ctrl+U)"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("underline") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-kawaii-sky/60" />

        {/* Heading 2 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Tiêu đề chính (H2)"
          title="Tiêu đề chính (H2)"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("heading", { level: 2 }) && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Tiêu đề phụ (H3)"
          title="Tiêu đề phụ (H3)"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("heading", { level: 3 }) && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-kawaii-sky/60" />

        {/* Bullet List */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Danh sách gạch đầu dòng"
          title="Danh sách gạch đầu dòng"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("bulletList") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <List className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Danh sách đánh số"
          title="Danh sách đánh số"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("orderedList") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Khối trích dẫn"
          title="Khối trích dẫn"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("blockquote") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-[1px] bg-kawaii-sky/60" />

        {/* Link */}
        <button
          type="button"
          disabled={disabled}
          onClick={setLink}
          aria-label="Chèn liên kết"
          title="Chèn liên kết"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("link") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Link2 className="h-4 w-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetLink().run()}
            aria-label="Hủy liên kết"
            title="Hủy liên kết"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-destructive transition hover:bg-destructive/10"
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}

        {/* Clear formatting */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          aria-label="Xóa định dạng"
          title="Xóa định dạng"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/60 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha"
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Undo */}
          <button
            type="button"
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            aria-label="Hoàn tác (Undo)"
            title="Hoàn tác (Ctrl+Z)"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/70 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            aria-label="Làm lại (Redo)"
            title="Làm lại (Ctrl+Y)"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/70 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
