import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Building2 } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Loader from "@/components/Loader";
import { quartierApi } from "@/api/quartierApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { quartierSchema, type QuartierFormValues } from "@/utils/validators";
import type { Quartier } from "@/types";

export default function Quartiers() {
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Quartier | null>(null);
  const [deleting, setDeleting] = useState<Quartier | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuartierFormValues>({ resolver: zodResolver(quartierSchema) });

  async function load() {
    setLoading(true);
    try {
      const res = await quartierApi.getAll();
      setQuartiers(res.data);
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
    reset({ Nom_quartier: "", Popu_Quartier: 0, Conso_Moyen: 0 });
    setModalOpen(true);
  }

  function openEdit(q: Quartier) {
    setEditing(q);
    reset({ Nom_quartier: q.Nom_quartier, Popu_Quartier: q.Popu_Quartier, Conso_Moyen: q.Conso_Moyen });
    setModalOpen(true);
  }

  async function onSubmit(values: QuartierFormValues) {
    try {
      if (editing) {
        await quartierApi.update(editing.id_quartier, values);
        toast.success("Quartier mis à jour.");
      } else {
        await quartierApi.create(values);
        toast.success("Quartier créé.");
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
      await quartierApi.remove(deleting.id_quartier);
      toast.success("Quartier supprimé.");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns: Column<Quartier>[] = [
    { header: "Nom du quartier", accessor: (q) => <span className="font-medium text-slate-800">{q.Nom_quartier}</span> },
    { header: "Population", accessor: (q) => q.Popu_Quartier.toLocaleString("fr-FR"), className: "font-mono" },
    { header: "Consommation moyenne", accessor: (q) => q.Conso_Moyen, className: "font-mono" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
            <Building2 className="h-6 w-6 text-water-600" /> Quartiers
          </h1>
          <p className="text-sm text-slate-500">Gestion des quartiers desservis par le réseau.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-water-800"
        >
          <Plus className="h-4 w-4" /> Nouveau quartier
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={quartiers}
          keyField={(q) => String(q.id_quartier)}
          onEdit={openEdit}
          onDelete={setDeleting}
          emptyLabel="Aucun quartier enregistré."
        />
      )}

      <Modal open={modalOpen} title={editing ? "Modifier le quartier" : "Nouveau quartier"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Nom_quartier">Nom du quartier</label>
            <input id="Nom_quartier" type="text" {...register("Nom_quartier")} />
            {errors.Nom_quartier && <p className="mt-1 text-xs text-red-600">{errors.Nom_quartier.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Popu_Quartier">Population</label>
              <input id="Popu_Quartier" type="number" {...register("Popu_Quartier")} />
              {errors.Popu_Quartier && <p className="mt-1 text-xs text-red-600">{errors.Popu_Quartier.message}</p>}
            </div>
            <div>
              <label htmlFor="Conso_Moyen">Consommation moyenne</label>
              <input id="Conso_Moyen" type="number" step="any" {...register("Conso_Moyen")} />
              {errors.Conso_Moyen && <p className="mt-1 text-xs text-red-600">{errors.Conso_Moyen.message}</p>}
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
        message={`Voulez-vous vraiment supprimer le quartier "${deleting?.Nom_quartier}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
