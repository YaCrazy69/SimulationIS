import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "water" | "emerald" | "amber" | "red";
}

const ACCENTS = {
  water: "bg-water-50 text-water-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export default function StatCard({ label, value, icon: Icon, accent = "water" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-panel ring-1 ring-slate-100">
      <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-mono text-2xl font-semibold text-water-950">{value}</p>
      </div>
    </div>
  );
}
