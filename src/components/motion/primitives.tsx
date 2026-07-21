"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Restrained motion register (DESIGN.md §8):
 * ease [0.22,1,0.36,1] · 400–600ms · 16–24px travel · reveal once.
 * Every primitive collapses to a simple fade (or nothing) under
 * prefers-reduced-motion.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0.2 : 0.5, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

export function SlideUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0.2 : 0.55, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.2 : 0.5, ease: EASE },
        },
      }}
    >
      {children}
    </m.div>
  );
}
