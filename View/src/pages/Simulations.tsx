import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { PlayCircle, Rocket, CheckCircle2 } from "lucide-react";
import { simulationApi } from "@/api/simulationApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { simulationSchema, type SimulationFormValues } from "@/utils/validators";
import { useSimulationHistoryStore } from "@/stores/simulationStore";
import type { SimulationLaunchResponse } from "@/types";

export default function Simulations() {
  const { history, addSimulation } = useSimulationHistoryStore();
  const [launching, setLaunching] = useState<number | null>(null);
  const [launchResults, setLaunchResults] = useState<Record<number, SimulationLaunchResponse>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: { methode: "RungeKutta" },
  });

  async function onSubmit(values: SimulationFormValues) {
    try {
      // Le backend attend Date_sim en ISO datetime complet
      const payload = {
        ...values,
        Date_sim: values.Date_sim.includes("T")
          ? values.Date_sim
          : `${values.Date_sim}T00:00:00`,
      };
      const res = await simulationApi.create(payload);
      const { id_sim } = res.data;

      // On enrichit l'objet local avec les valeurs du formulaire pour l'affichage
      addSimulation({
        id_sim,
        Date_sim: payload.Date_sim,
        methode: values.methode,
        Duree: values.Duree,
        Interval_pas: values.Interval_pas,
      });

      toast.success(`Simulation créée (id_sim : ${id_sim}).`);
      reset({ Date_sim: "", methode: "RungeKutta", Duree: 0, Interval_pas: 0 });
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  async function handleLaunch(idSim: number) {
    setLaunching(idSim);
    try {
      const res = await simulationApi.launch(idSim);
      setLaunchResults((prev) => ({ ...prev, [idSim]: res.data }));
      toast.success(res.data.message || "Simulation lancée avec succès.");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLaunching(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
          <PlayCircle className="h-6 w-6 text-water-600" /> Simulations
        </h1>
        <p className="text-sm text-slate-500">
          Créez et lancez des simulations hydrauliques (méthode Runge-Kutta).
          Durée et intervalle en secondes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-slate-100 lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-water-950">Nouvelle simulation</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="Date_sim">Date de simulation</label>
              <input id="Date_sim" type="date" {...register("Date_sim")} />
              {errors.Date_sim && <p className="mt-1 text-xs text-red-600">{errors.Date_sim.message}</p>}
            </div>
            <div>
              <label htmlFor="methode">Méthode</label>
              <select id="methode" {...register("methode")}>
                <option value="RungeKutta">Runge-Kutta</option>
              </select>
              {errors.methode && <p className="mt-1 text-xs text-red-600">{errors.methode.message}</p>}
            </div>
            <div>
              <label htmlFor="Duree">Durée (secondes)</label>
              <input id="Duree" type="number" step="any" min="1" placeholder="ex: 3600" {...register("Duree")} />
              {errors.Duree && <p className="mt-1 text-xs text-red-600">{errors.Duree.message}</p>}
            </div>
            <div>
              <label htmlFor="Interval_pas">Intervalle de pas (secondes)</label>
              <input id="Interval_pas" type="number" step="any" min="0.01" placeholder="ex: 60" {...register("Interval_pas")} />
              {errors.Interval_pas && <p className="mt-1 text-xs text-red-600">{errors.Interval_pas.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-water-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-water-800 disabled:opacity-60"
            >
              <Rocket className="h-4 w-4" />
              {isSubmitting ? "Création…" : "Créer la simulation"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-water-950">Historique de la session</h2>
          {history.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-400 shadow-panel ring-1 ring-slate-100">
              Aucune simulation créée pour l'instant. Le backend ne fournit pas de liste globale
              des simulations : seules celles créées pendant cette session sont affichées ici.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((sim) => {
                const result = launchResults[sim.id_sim];
                return (
                  <div key={sim.id_sim} className="rounded-xl bg-white p-4 shadow-panel ring-1 ring-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-slate-400">#{sim.id_sim}</p>
                        <p className="text-sm font-medium text-slate-700">
                          {sim.methode} — durée {sim.Duree}s · pas {sim.Interval_pas}s · {sim.Date_sim.split("T")[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLaunch(sim.id_sim)}
                          disabled={launching === sim.id_sim}
                          className="flex items-center gap-1.5 rounded-md bg-water-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-water-800 disabled:opacity-60"
                        >
                          <Rocket className="h-3.5 w-3.5" />
                          {launching === sim.id_sim ? "Lancement…" : "Lancer simulation"}
                        </button>
                        <Link
                          to={`/simulation/${sim.id_sim}`}
                          className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          Voir les points
                        </Link>
                        <Link
                          to="/resultats"
                          state={{ id_sim: sim.id_sim }}
                          className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Résultats
                        </Link>
                      </div>
                    </div>
                    {result && (
                      <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {result.message} — {result.points_generated} points générés
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
