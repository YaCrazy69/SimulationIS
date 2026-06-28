import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, GitBranch } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Loader from "@/components/Loader";
import NetworkDiagram from "@/components/Charts/NetworkDiagram";
import { canalisationApi } from "@/api/canalisationApi";
import { reservoirApi } from "@/api/reservoirApi";
import { quartierApi } from "@/api/quartierApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { canalisationSchema, type CanalisationFormValues } from "@/utils/validators";
import type { Canalisation, Quartier, Reservoir } from "@/types";

export default function Canalisations() {
  const [canalisations, setCanalisations] = useState<Canalisation[]>([]);
  const [reservoirs, setReservoirs] = useState<Reservoir[]>([]);
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Canalisation | null>(null);
  const [deleting, setDeleting] = useState<Canalisation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CanalisationFormValues>({ resolver: zodResolver(canalisationSchema) });

  async function load() {
    setLoading(true);
    try {
      const [c, r, q] = await Promise.all([
        canalisationApi.getAll(),
        reservoirApi.getAll(),
        quartierApi.getAll(),
      ]);
      setCanalisations(c.data);
      setReservoirs(r.data);
      setQuartiers(q.data);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    reset({ Longueur_Canal: 0, Debit_max: 0, Reservoir_id: 0, Quartier_id: 0 });
    setModalOpen(true);
  }

  function openEdit(c: Canalisation) {
    setEditing(c);
    reset({
      Longueur_Canal: c.Longueur_Canal,
      Debit_max: c.Debit_max,
      Reservoir_id: c.Reservoir_id,
      Quartier_id: c.Quartier_id,
    });
    setModalOpen(true);
  }

  async function onSubmit(values: CanalisationFormValues) {
    try {
      if (editing) {
        await canalisationApi.update(editing.Id_Canal, values);
        toast.success("Canalisation mise à jour.");
      } else {
        await canalisationApi.create(values);
        toast.success("Canalisation créée.");
      }
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await canalisationApi.remove(deleting.Id_Canal);
      toast.success("Canalisation supprimée.");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  }

  function reservoirName(id: number) {
    return reservoirs.find((r) => r.id_reservoir === id)?.nom_reservoir ?? String(id);
  }
  function quartierName(id: number) {
    return quartiers.find((q) => q.id_quartier === id)?.Nom_quartier ?? String(id);
  }

  const columns: Column<Canalisation>[] = [
    { header: "Réservoir", accessor: (c) => reservoirName(c.Reservoir_id) },
    { header: "Quartier", accessor: (c) => quartierName(c.Quartier_id) },
    { header: "Longueur (m)", accessor: (c) => c.Longueur_Canal, className: "font-mono" },
    { header: "Débit max (m³/h)", accessor: (c) => c.Debit_max, className: "font-mono" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
            <GitBranch className="h-6 w-6 text-water-600" /> Canalisations
          </h1>
          <p className="text-sm text-slate-500">Liaisons entre réservoirs et quartiers.</p>
        </div>
        <button
          onClick={openCreate}
          disabled={reservoirs.length === 0 || quartiers.length === 0}
          className="flex items-center gap-2 rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-water-800 disabled:opacity-50"
          title={reservoirs.length === 0 || quartiers.length === 0 ? "Créez d'abord un réservoir et un quartier" : ""}
        >
          <Plus className="h-4 w-4" /> Nouvelle canalisation
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <NetworkDiagram reservoirs={reservoirs} quartiers={quartiers} canalisations={canalisations} />
          <DataTable
            columns={columns}
            rows={canalisations}
            keyField={(c) => String(c.Id_Canal)}
            onEdit={openEdit}
            onDelete={setDeleting}
            emptyLabel="Aucune canalisation enregistrée."
          />
        </>
      )}

      <Modal open={modalOpen} title={editing ? "Modifier la canalisation" : "Nouvelle canalisation"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Reservoir_id">Réservoir</label>
              <select id="Reservoir_id" {...register("Reservoir_id")}>
                <option value="">Sélectionner…</option>
                {reservoirs.map((r) => (
                  <option key={r.id_reservoir} value={r.id_reservoir}>
                    {r.nom_reservoir}
                  </option>
                ))}
              </select>
              {errors.Reservoir_id && <p className="mt-1 text-xs text-red-600">{errors.Reservoir_id.message}</p>}
            </div>
            <div>
              <label htmlFor="Quartier_id">Quartier</label>
              <select id="Quartier_id" {...register("Quartier_id")}>
                <option value="">Sélectionner…</option>
                {quartiers.map((q) => (
                  <option key={q.id_quartier} value={q.id_quartier}>
                    {q.Nom_quartier}
                  </option>
                ))}
              </select>
              {errors.Quartier_id && <p className="mt-1 text-xs text-red-600">{errors.Quartier_id.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Longueur_Canal">Longueur (m)</label>
              <input id="Longueur_Canal" type="number" step="any" {...register("Longueur_Canal")} />
              {errors.Longueur_Canal && <p className="mt-1 text-xs text-red-600">{errors.Longueur_Canal.message}</p>}
            </div>
            <div>
              <label htmlFor="Debit_max">Débit max (m³/h)</label>
              <input id="Debit_max" type="number" step="any" {...register("Debit_max")} />
              {errors.Debit_max && <p className="mt-1 text-xs text-red-600">{errors.Debit_max.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white hover:bg-water-800 disabled:opacity-60">
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        message="Voulez-vous vraiment supprimer cette canalisation ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
