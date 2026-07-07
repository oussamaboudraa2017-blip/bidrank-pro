"use client";

import { useState, useCallback } from "react";
import { Linkedin, Twitter, Mail, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-br-dark/50 mr-1">Share:</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-br-dark/50 hover:text-br-primary hover:bg-br-primary/10"
        asChild
      >
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-br-dark/50 hover:text-br-primary hover:bg-br-primary/10"
        asChild
      >
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-br-dark/50 hover:text-br-primary hover:bg-br-primary/10"
        asChild
      >
        <a
          href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`}
          aria-label="Share via email"
        >
          <Mail className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-br-dark/50 hover:text-br-primary hover:bg-br-primary/10"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}