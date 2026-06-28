import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import SimulationChart from "@/components/Charts/SimulationChart";
import Loader from "@/components/Loader";
import { resultatApi } from "@/api/resultatApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import type { PointSim } from "@/types";

export default function SimulationDetail() {
  const { id } = useParams<{ id: string }>();
  const [points, setPoints] = useState<PointSim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const simId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!simId || isNaN(simId)) {
      setError("Identifiant de simulation invalide.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    resultatApi
      .getPoints(simId)
      .then((res) => setPoints(res.data))
      .catch((e) => {
        const msg = getApiErrorMessage(e);
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [simId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/simulations" className="mb-1 flex items-center gap-1 text-xs font-medium text-water-700 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour aux simulations
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
            <BarChart3 className="h-6 w-6 text-water-600" /> Points de simulation
          </h1>
          <p className="font-mono text-xs text-slate-400">#{id}</p>
        </div>
        <Link
          to="/resultats"
          state={{ id_sim: simId }}
          className="rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white hover:bg-water-800"
        >
          Voir le résultat final
        </Link>
      </div>

      {loading ? (
        <Loader full label="Chargement des points…" />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-sm text-red-700 ring-1 ring-red-100">{error}</div>
      ) : points.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-400 shadow-panel ring-1 ring-slate-100">
          Aucun point disponible. Avez-vous lancé cette simulation ?
        </div>
      ) : (
        <SimulationChart points={points} />
      )}
    </div>
  );
}
