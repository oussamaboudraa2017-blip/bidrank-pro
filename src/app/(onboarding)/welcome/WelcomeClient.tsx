"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Upload,
  PlayCircle,
  FileDown,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  { icon: Clock, label: "Save 4+ hours per RFP" },
  { icon: ShieldCheck, label: "FAR/DFARS compliance checks" },
  { icon: CheckCircle, label: "Bid readiness scoring" },
];

export default function WelcomeClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-br-primary via-br-secondary/30 to-br-primary px-6">
      {/* Floating dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-2 rounded-full bg-br-accent/30"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${5 + (i * 13) % 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Logo */}
        <motion.a
          href="/"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-block text-3xl font-bold text-white no-underline"
        >
          BidRank<span className="text-br-accent">.pro</span>
        </motion.a>

        {/* Welcome heading */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-br-accent/20 mb-6">
            <Sparkles className="size-8 text-br-accent" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Welcome to BidRank!
          </h1>
          <p className="mt-4 text-lg text-br-text-secondary">
            Your 3-day free trial has started. Let&apos;s analyze your first
            RFP.
          </p>
        </motion.div>

        {/* Primary CTA — Upload First RFP */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10"
        >
          <Button
            size="lg"
            className="w-full bg-br-accent text-br-dark font-semibold hover:bg-br-accent/90 text-lg px-8 h-14"
            onClick={() => router.push("/analyzer")}
          >
            <Upload className="mr-2 size-5" />
            Upload Your First RFP
          </Button>
        </motion.div>

        {/* Secondary & Tertiary CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 h-12"
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "_blank"
              )
            }
          >
            <PlayCircle className="mr-2 size-5" />
            Watch 2-Min Demo
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 h-12"
            onClick={() => router.push("/free-tool")}
          >
            <FileDown className="mr-2 size-5" />
            Try Sample RFP
          </Button>
        </motion.div>

        {/* Quick feature pills */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
            >
              <f.icon className="size-4 text-br-accent" />
              <span className="text-sm text-br-text-secondary">{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Skip link */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-br-text-secondary hover:text-white transition-colors"
          >
            Go to Dashboard <ArrowRight className="inline size-3 ml-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}