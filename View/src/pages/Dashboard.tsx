import { useEffect, useState } from "react";
import { Waves, Building2, PlayCircle, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { reservoirApi } from "@/api/reservoirApi";
import { quartierApi } from "@/api/quartierApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { useSimulationHistoryStore } from "@/stores/simulationStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [reservoirCount, setReservoirCount] = useState(0);
  const [quartierCount, setQuartierCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const history = useSimulationHistoryStore((s) => s.history);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([reservoirApi.getAll(), quartierApi.getAll()])
      .then(([resReservoir, resQuartier]) => {
        if (!active) return;
        setReservoirCount(resReservoir.data.length);
        setQuartierCount(resQuartier.data.length);
      })
      .catch((e) => toast.error(getApiErrorMessage(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loader full label="Chargement du tableau de bord…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-water-950">Tableau de bord</h1>
        <p className="text-sm text-slate-500">Vue d'ensemble du réseau hydraulique supervisé.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Simulations (session)" value={history.length} icon={PlayCircle} accent="water" />
        <StatCard label="Réservoirs" value={reservoirCount} icon={Waves} accent="emerald" />
        <StatCard label="Quartiers" value={quartierCount} icon={Building2} accent="amber" />
        <StatCard
          label="Dernière méthode"
          value={history[0]?.methode ?? "—"}
          icon={Activity}
          accent="water"
        />
      </div>

      <div className="rounded-xl bg-white shadow-panel ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-water-950">Dernières simulations</h2>
          <Link to="/simulations" className="text-xs font-medium text-water-700 hover:underline">
            Voir toutes →
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            Aucune simulation créée pendant cette session. Rendez-vous dans la page Simulations
            pour en lancer une.
          </p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {history.slice(0, 5).map((sim) => (
              <li key={sim.id_sim} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{sim.methode}</p>
                  <p className="font-mono text-xs text-slate-400">#{sim.id_sim}</p>
                </div>
                <Link
                  to={`/simulation/${sim.id_sim}`}
                  className="rounded-md bg-water-50 px-3 py-1.5 text-xs font-semibold text-water-700 hover:bg-water-100"
                >
                  Voir les points
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
