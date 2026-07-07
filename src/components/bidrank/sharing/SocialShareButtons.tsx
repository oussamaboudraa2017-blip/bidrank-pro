"use client";

import { useState } from "react";
import {
  Share2,
  Linkedin,
  Twitter,
  Link2,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnalysisShareData {
  analysisId: string;
  fileName: string;
  readinessScore: number;
  agency?: string | null;
  verdict: string;
}

export function SocialShareButtons({ data }: { data: AnalysisShareData }) {
  const [sharedLink, setSharedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);

  const ogImageUrl = `https://www.bidrank.pro/api/share-og-image?score=${data.readinessScore}&agency=${encodeURIComponent(data.agency || "Federal Agency")}&verdict=${encodeURIComponent(data.verdict)}&fileName=${encodeURIComponent(data.fileName || "RFP Analysis")}`;

  const caption = `Just analyzed a federal RFP in 3 minutes with BidRank. Compliance score: ${data.readinessScore}%! #GovCon #FederalContracting`;
  const shareUrl = sharedLink || `https://www.bidrank.pro/free-tool`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareUrl)}`;

  const handleLinkedIn = () => {
    window.open(linkedinUrl, "_blank", "width=600,height=500");
  };

  const handleTwitter = () => {
    window.open(twitterUrl, "_blank", "width=600,height=500");
  };

  const handleGeneratePublicLink = async () => {
    setGeneratingLink(true);
    try {
      const res = await fetch("/api/shared-report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: data.analysisId }),
      });
      if (res.ok) {
        const result = await res.json();
        setSharedLink(result.shareUrl);
      }
    } catch (err) {
      console.error("Failed to generate shared link:", err);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    const urlToCopy = sharedLink || shareUrl;
    await navigator.clipboard.writeText(urlToCopy);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-br-text-secondary mr-1">Share:</span>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 hover:bg-br-light hover:border-br-border hover:text-br-text-secondary"
              onClick={handleLinkedIn}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        {/* Twitter / X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 hover:bg-br-light hover:border-br-border hover:text-br-text-secondary"
              onClick={handleTwitter}
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X (Twitter)</TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {sharedLink ? "Copy public link" : "Copy page link"}
          </TooltipContent>
        </Tooltip>

        {/* Generate Public Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-br-primary border-br-primary/30 hover:bg-br-primary/5"
              onClick={handleGeneratePublicLink}
              disabled={generatingLink || !!sharedLink}
            >
              {generatingLink ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : sharedLink ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">
                {sharedLink ? "Link Created" : "Public Link"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {sharedLink
              ? "View-only link created! Click to copy."
              : "Generate a view-only link (expires in 30 days)"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}