"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

export interface RichTextContentProps {
  content?: string | null;
  fallback?: string;
  className?: string;
}

const htmlPattern = /<\/?[a-z][\s\S]*>/i;

export function RichTextContent({
  content,
  fallback = "Chưa có mô tả cho giao diện này.",
  className,
}: RichTextContentProps) {
  const isHtml = useMemo(() => {
    if (!content) return false;
    return htmlPattern.test(content);
  }, [content]);

  const sanitizedHtml = useMemo(() => {
    if (!content || !isHtml) return "";
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p",
        "h2",
        "h3",
        "h4",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "s",
        "strike",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "br",
        "code",
        "pre",
        "span",
        "hr",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
    });
  }, [content, isHtml]);

  if (!content || (!isHtml && !content.trim())) {
    return (
      <p className={cn("text-sm font-medium text-kawaii-mocha/65 italic", className)}>
        {fallback}
      </p>
    );
  }

  if (isHtml && sanitizedHtml) {
    return (
      <div
        className={cn(
          "prose-kawaii w-full text-sm font-medium leading-relaxed text-kawaii-mocha/80 md:text-base dark:text-foreground",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  return (
    <p
      className={cn(
        "whitespace-pre-line text-sm font-medium leading-7 text-kawaii-mocha/80 md:text-base dark:text-foreground",
        className,
      )}
    >
      {content}
    </p>
  );
}
