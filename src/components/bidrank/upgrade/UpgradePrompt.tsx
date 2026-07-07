"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, FileText, Users, Upload, Download } from "lucide-react";

export type UpgradeTrigger =
  | "analysis_limit"
  | "export"
  | "team"
  | "file_size";

const TRIGGER_CONFIG: Record<
  UpgradeTrigger,
  {
    icon: typeof Lock;
    title: string;
    description: string;
    ctaPlan: string;
    ctaPrice: string;
    featureLabel: string;
  }
> = {
  analysis_limit: {
    icon: Upload,
    title: "Monthly Analysis Limit Reached",
    description:
      "You've used all 3 free analyses this month. Upgrade to keep analyzing RFPs and never miss a deadline.",
    ctaPlan: "Starter",
    ctaPrice: "$49",
    featureLabel: "Unlimited analyses on paid plans",
  },
  export: {
    icon: Download,
    title: "Export Reports",
    description:
      "Download your analysis as a polished PDF report to share with your team or clients. Available on Starter and above.",
    ctaPlan: "Starter",
    ctaPrice: "$49",
    featureLabel: "PDF & Excel exports",
  },
  team: {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Add team members, assign RFP sections, and track progress together. Available on Pro and Enterprise plans.",
    ctaPlan: "Pro",
    ctaPrice: "$149",
    featureLabel: "Up to 5 team members on Pro",
  },
  file_size: {
    icon: FileText,
    title: "Upload Larger RFPs",
    description:
      "Free accounts can upload up to 500 KB. Upgrade to Starter for files up to 2 MB, or Pro for up to 5 MB.",
    ctaPlan: "Starter",
    ctaPrice: "$49",
    featureLabel: "Upload up to 5 MB on Pro",
  },
};

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: UpgradeTrigger;
}

export function UpgradePrompt({ open, onOpenChange, trigger }: UpgradePromptProps) {
  const router = useRouter();
  const config = TRIGGER_CONFIG[trigger];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-br-accent/20 mb-4">
            <Icon className="size-7 text-br-accent" />
          </div>
          <DialogTitle className="font-heading text-center text-xl">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border border-br-accent/30 bg-br-light p-4 text-center">
          <p className="text-sm font-medium text-br-dark">
            Unlock this feature — upgrade to{" "}
            <span className="text-br-primary font-bold">{config.ctaPlan}</span>{" "}
            for <span className="text-br-primary font-bold">{config.ctaPrice}/month</span>
          </p>
          <Badge className="mt-2 bg-br-success/10 text-br-success border-br-success/30 text-xs">
            30-day money-back guarantee
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            className="w-full bg-br-accent text-br-dark font-semibold hover:bg-br-accent/90"
            onClick={() => {
              onOpenChange(false);
              router.push("/pricing");
            }}
          >
            Upgrade to {config.ctaPlan} <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full text-br-text-secondary"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-br-text-secondary">
          {config.featureLabel}
        </p>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Inline banner variant for use within the analyzer page
 * when the limit is reached (non-blocking, shows at top).
 */
export function UpgradeBanner({ trigger }: { trigger: UpgradeTrigger }) {
  const router = useRouter();
  const config = TRIGGER_CONFIG[trigger];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-br-accent/40 bg-br-accent/5 px-4 py-3">
      <Icon className="size-5 flex-shrink-0 text-br-accent" />
      <p className="flex-1 text-sm text-br-dark">
        <span className="font-semibold">{config.title}</span>{" "}
        <button
          onClick={() => router.push("/pricing")}
          className="text-br-primary underline underline-offset-2 hover:text-br-secondary"
        >
          Upgrade to {config.ctaPlan} for {config.ctaPrice}/month
        </button>
      </p>
      <ArrowRight
        className="size-4 flex-shrink-0 text-br-primary cursor-pointer"
        onClick={() => router.push("/pricing")}
      />
    </div>
  );
}