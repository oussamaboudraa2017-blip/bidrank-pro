"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FirstUploadCelebrationProps {
  open: boolean;
  onClose: () => void;
  score: number;
  onAnalyzeAnother: () => void;
  onTourStart: () => void;
}

const TIME_SAVED_HOURS = 4;

export function FirstUploadCelebration({
  open,
  onClose,
  score,
  onAnalyzeAnother,
  onTourStart,
}: FirstUploadCelebrationProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-br-surface p-8 shadow-br-xl border border-br-border text-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-br-text-secondary hover:text-br-dark transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Trophy animation */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 200,
                delay: 0.2,
              }}
              className="mx-auto flex size-20 items-center justify-center rounded-full bg-br-accent/20 mb-5"
            >
              <Trophy className="size-10 text-br-accent" />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-heading text-2xl font-bold text-br-dark"
            >
              Your First Analysis is Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-br-text-secondary"
            >
              Great job getting started. Here&apos;s what we found:
            </motion.p>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 15 }}
              className="mt-6 inline-flex flex-col items-center rounded-xl border border-br-accent/30 bg-br-light p-6"
            >
              <div className="text-5xl font-bold text-br-primary">{score}</div>
              <div className="mt-1 text-sm text-br-text-secondary">
                Bid Readiness Score
              </div>
            </motion.div>

            {/* Time saved */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-5 flex items-center justify-center gap-2"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-br-success/10">
                <Clock className="size-4 text-br-success" />
              </div>
              <p className="text-sm text-br-dark">
                <span className="font-bold">{TIME_SAVED_HOURS} hours saved</span>{" "}
                — this would have taken{" "}
                {TIME_SAVED_HOURS} hours manually
              </p>
            </motion.div>

            {/* Tooltip tour CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onTourStart}
                      className="inline-flex items-center gap-2 text-sm font-medium text-br-primary hover:text-br-secondary transition-colors"
                    >
                      <Sparkles className="size-4" />
                      Take a quick tour of your results
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Learn how to navigate your compliance details, risk
                      explanations, and recommendations.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-6 flex flex-col gap-3"
            >
              <Button
                className="w-full bg-br-accent text-br-dark font-semibold hover:bg-br-accent/90"
                onClick={onAnalyzeAnother}
              >
                <CheckCircle className="mr-2 size-4" />
                Analyze Another RFP
              </Button>
              <Button
                variant="outline"
                className="w-full border-br-primary text-br-primary hover:bg-br-primary hover:text-white"
                onClick={onClose}
              >
                View Full Results
              </Button>
            </motion.div>

            {/* Confetti particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute size-2 rounded-full"
                  style={{
                    backgroundColor:
                      i % 3 === 0
                        ? "#D4A843"
                        : i % 3 === 1
                        ? "#1A3A5C"
                        : "#38A169",
                    left: `${15 + (i * 11) % 70}%`,
                    top: "-5%",
                  }}
                  animate={{
                    y: [0, 400],
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    rotate: [0, 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 0.3 + i * 0.1,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Tooltip Tour Overlay
 * Shows 3 step-by-step tooltips pointing to key sections of the results.
 */
interface TourOverlayProps {
  open: boolean;
  onClose: () => void;
  step: number;
  setStep: (s: number) => void;
}

const TOUR_STEPS = [
  {
    title: "Compliance Details",
    description: 'Click here for compliance details — see which FAR/DFARS clauses are met, warned, or missing.',
  },
  {
    title: "Risk Explanation",
    description: "Hover for risk explanation — each risk is rated by severity with actionable mitigation steps.",
  },
  {
    title: "Recommendations",
    description: "Your personalized action items to improve your bid. Follow these to maximize your win probability.",
  },
];

export function TourOverlay({ open, onClose, step, setStep }: TourOverlayProps) {
  const current = TOUR_STEPS[step];

  if (!open || !current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2"
      >
        <div className="rounded-xl border border-br-primary/20 bg-br-surface p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-br-primary text-white text-sm font-bold">
              {step + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-br-dark">{current.title}</h4>
              <p className="mt-1 text-sm text-br-text-secondary">
                {current.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-br-text-secondary hover:text-br-dark"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`size-2 rounded-full transition-colors ${
                    i === step ? "bg-br-primary" : "bg-br-light"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {step < TOUR_STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="bg-br-primary text-white hover:bg-br-primary/90"
                  onClick={() => setStep(step + 1)}
                >
                  Next <ArrowRight className="ml-1 size-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-br-accent text-br-dark font-semibold hover:bg-br-accent/90"
                  onClick={onClose}
                >
                  Got it!
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}