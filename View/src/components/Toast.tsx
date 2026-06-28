import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  error: "bg-red-50 text-red-800 ring-red-200",
  info: "bg-water-50 text-water-800 ring-water-200",
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-lg px-4 py-3 shadow-panel ring-1 ${STYLES[t.type]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 flex-none" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
