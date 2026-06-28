import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
  full?: boolean;
}

export default function Loader({ label = "Chargement…", full = false }: LoaderProps) {
  return (
    <div
      className={
        full
          ? "flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-water-700"
          : "flex items-center justify-center gap-2 py-8 text-water-700"
      }
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
