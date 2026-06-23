"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface TechCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export const TechCard = ({
  title,
  subtitle,
  children,
  className,
  icon,
  variant = "default",
}: TechCardProps) => {
  return (
    <div className={cn("group relative h-full", className)}>
      <Card className={cn(
        "relative h-full overflow-hidden rounded-3xl border-border/40 bg-card/40 backdrop-blur-md transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
        variant === "outline" && "border-2",
        className
      )}>
        {title && (
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-foreground/80 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {title}
                </h3>
                {subtitle && <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{subtitle}</p>}
              </div>
              {icon && (
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary transition-colors group-hover:bg-primary/20">
                  {icon}
                </div>
              )}
            </div>
          </div>
        )}
        <CardContent className={cn("p-6", title && "pt-2")}>{children}</CardContent>
        
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
      </Card>
    </div>
  );
};

