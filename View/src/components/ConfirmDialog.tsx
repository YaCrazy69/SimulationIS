import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title = "Confirmer la suppression",
  message,
  confirmLabel = "Supprimer",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} widthClass="max-w-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Suppression…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
