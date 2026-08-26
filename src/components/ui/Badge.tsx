import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono text-[11px] tracking-wide text-fg-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
