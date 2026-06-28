import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyLabel?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  keyField,
  onEdit,
  onDelete,
  emptyLabel = "Aucune donnée disponible.",
}: DataTableProps<T>) {
  const hasActions = !!(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-panel ring-1 ring-slate-100">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-semibold text-slate-500">
                {col.header}
              </th>
            ))}
            {hasActions && <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-10 text-center text-slate-400">
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={keyField(row)} className="border-b border-slate-50 last:border-0 hover:bg-water-50/40">
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-3 text-slate-700 ${col.className ?? ""}`}>
                  {col.accessor(row)}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-md p-1.5 text-water-600 transition hover:bg-water-50"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
