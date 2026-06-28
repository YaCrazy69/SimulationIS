import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Droplet, Building2, AlertTriangle, Search } from "lucide-react";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { resultatApi } from "@/api/resultatApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { useSimulationHistoryStore } from "@/stores/simulationStore";
import type { ResultatSim } from "@/types";

export default function Resultats() {
  const location = useLocation();
  const presetId = (location.state as { id_sim?: number } | undefined)?.id_sim ?? null;
  const { history } = useSimulationHistoryStore();

  const [idSimInput, setIdSimInput] = useState<string>(presetId ? String(presetId) : "");
  const [resultat, setResultat] = useState<ResultatSim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchResultat(id: number | string) {
    const parsed = typeof id === "string" ? parseInt(id.trim(), 10) : id;
    if (isNaN(parsed) || parsed <= 0) {
      setError("Identifiant de simulation invalide.");
      return;
    }
    setLoading(true);
    setError(null);
    setResultat(null);
    try {
      const res = await resultatApi.getResultat(parsed);
      setResultat(res.data);
    } catch (e) {
      const msg = getApiErrorMessage(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (presetId) fetchResultat(presetId);
  }, [presetId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
          <Droplet className="h-6 w-6 text-water-600" /> Résultats de simulation
        </h1>
        <p className="text-sm text-slate-500">Consultez le résultat final d'une simulation déjà lancée.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-panel ring-1 ring-slate-100">
        <div className="min-w-[260px] flex-1">
          <label htmlFor="idSim">Identifiant de simulation (id_sim)</label>
          <input
            id="idSim"
            type="number"
            min="1"
            placeholder="Entrez l'id_sim (ex: 1)"
            value={idSimInput}
            onChange={(e) => setIdSimInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchResultat(idSimInput)}
          />
        </div>
        <button
          onClick={() => fetchResultat(idSimInput)}
          className="flex items-center gap-2 rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white hover:bg-water-800"
        >
          <Search className="h-4 w-4" /> Rechercher
        </button>

        {history.length > 0 && (
          <select
            className="w-auto"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                setIdSimInput(e.target.value);
                fetchResultat(parseInt(e.target.value, 10));
              }
            }}
          >
            <option value="">Ou choisir depuis l'historique…</option>
            {history.map((s) => (
              <option key={s.id_sim} value={s.id_sim}>
                #{s.id_sim} — {s.methode} ({s.Date_sim.split("T")[0]})
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <Loader full label="Chargement du résultat…" />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-6 text-sm text-red-700 ring-1 ring-red-100">{error}</div>
      ) : resultat ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Volume final" value={`${Number(resultat.Volume_Final).toFixed(6)} m³`} icon={Droplet} accent="water" />
          <StatCard label="Quartiers alimentés" value={resultat.Quartier_alimentes} icon={Building2} accent="emerald" />
          <StatCard label="Quartiers en pénurie" value={resultat.Quartiers_penurie} icon={AlertTriangle} accent="red" />
        </div>
      ) : (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-400 shadow-panel ring-1 ring-slate-100">
          Saisissez ou sélectionnez un identifiant de simulation pour afficher son résultat.
        </div>
      )}
    </div>
  );
}
