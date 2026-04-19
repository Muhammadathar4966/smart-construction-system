import { HardHat } from "lucide-react";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-xl bg-gradient-primary shadow-glow"
        style={{ width: size, height: size }}
      >
        <HardHat className="text-primary-foreground" size={size * 0.55} strokeWidth={2.5} />
      </div>
      <div className="font-display font-bold text-lg leading-none">
        Build<span className="gradient-text">Smart</span>
      </div>
    </div>
  );
}
