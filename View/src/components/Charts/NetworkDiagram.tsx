import { Waves, GitBranch, Building2 } from "lucide-react";
import type { Canalisation, Quartier, Reservoir } from "@/types";

interface NetworkDiagramProps {
  reservoirs: Reservoir[];
  quartiers: Quartier[];
  canalisations: Canalisation[];
}

/**
 * Représentation visuelle simple du réseau Réservoirs -> Canalisations -> Quartiers.
 * Utilise les clés réelles du backend : id_reservoir, id_quartier, Id_Canal.
 */
export default function NetworkDiagram({ reservoirs, quartiers, canalisations }: NetworkDiagramProps) {
  function reservoirName(id: number) {
    return reservoirs.find((r) => r.id_reservoir === id)?.nom_reservoir ?? String(id);
  }
  function quartierName(id: number) {
    return quartiers.find((q) => q.id_quartier === id)?.Nom_quartier ?? String(id);
  }

  if (canalisations.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-400 shadow-panel ring-1 ring-slate-100">
        Aucune canalisation enregistrée. Le schéma du réseau apparaîtra ici une fois des
        canalisations créées.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-panel ring-1 ring-slate-100">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Schéma du réseau
      </p>
      <div className="flex flex-col gap-3">
        {canalisations.map((c) => (
          <div
            key={c.Id_Canal}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100"
          >
            <div className="flex items-center gap-2 rounded-md bg-water-50 px-3 py-2 text-water-800">
              <Waves className="h-4 w-4 flex-none" />
              <span className="truncate text-sm font-medium">{reservoirName(c.Reservoir_id)}</span>
            </div>

            <div className="flex flex-col items-center text-slate-400">
              <GitBranch className="h-4 w-4" />
              <span className="font-mono text-[11px]">{c.Longueur_Canal} m</span>
              <span className="font-mono text-[10px] text-slate-300">{c.Debit_max} m³/h max</span>
            </div>

            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">
              <Building2 className="h-4 w-4 flex-none" />
              <span className="truncate text-sm font-medium">{quartierName(c.Quartier_id)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
