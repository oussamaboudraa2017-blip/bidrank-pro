"use client";

import { TableOfContents } from "./TableOfContents";

export function TableOfContentsClient({ content }: { content: string }) {
  return <TableOfContents content={content} />;
}