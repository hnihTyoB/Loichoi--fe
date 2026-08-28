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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");

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
          class: "text-kawaii-mocha font-bold underline underline-offset-4 hover:text-primary transition-colors cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-kawaii-mocha/40 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[140px] px-4 py-3 text-kawaii-mocha font-sans leading-relaxed",
          "[&_h2]:text-lg [&_h2]:font-black [&_h2]:text-kawaii-mocha [&_h2]:mt-3 [&_h2]:mb-1",
          "[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-kawaii-mocha [&_h3]:mt-2 [&_h3]:mb-1",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-kawaii-sky [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-kawaii-mocha/70",
          "[&_p]:my-1.5",
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const openLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "https://");
    setLinkOpen(true);
  };

  const handleApplyLink = () => {
    if (!editor) return;
    if (!linkUrl || linkUrl.trim() === "" || linkUrl === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setLinkOpen(false);
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

        {/* Link */}
        <button
          type="button"
          disabled={disabled}
          onClick={openLinkDialog}
          aria-label="Chèn liên kết"
          title="Chèn liên kết"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha",
            editor.isActive("link") && "border border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-sm",
          )}
        >
          <Link2 className="h-4 w-4" />
        </button>

        {/* Unlink */}
        {editor.isActive("link") && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetLink().run()}
            aria-label="Hủy liên kết"
            title="Hủy liên kết"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-kawaii-mocha/80 transition hover:bg-kawaii-sky/40 hover:text-kawaii-mocha"
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}

        <div className="mx-1 h-5 w-[1px] bg-kawaii-sky/60" />

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

      {/* Accessible Link Dialog */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kawaii-mocha">Chèn liên kết</DialogTitle>
            <DialogDescription>Nhập đường dẫn URL liên kết trang web (ví dụ: https://...)</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyLink();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLinkOpen(false)}>
              Hủy
            </Button>
            <Button type="button" onClick={handleApplyLink}>
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
