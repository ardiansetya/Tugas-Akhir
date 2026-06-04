"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  delay?: number;
}

export function BentoCard({
  children,
  className,
  title,
  subtitle,
  icon,
  delay = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card/40 p-6 backdrop-blur-md transition-all hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      {/* Subtle decorative gradient */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
      
      {(title || icon) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-foreground/80">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className="rounded-2xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/20">
              {icon}
            </div>
          )}
        </div>
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
