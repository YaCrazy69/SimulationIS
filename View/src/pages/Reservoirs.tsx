import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Waves } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Loader from "@/components/Loader";
import { reservoirApi } from "@/api/reservoirApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { reservoirSchema, type ReservoirFormValues } from "@/utils/validators";
import type { Reservoir } from "@/types";

export default function Reservoirs() {
  const [reservoirs, setReservoirs] = useState<Reservoir[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reservoir | null>(null);
  const [deleting, setDeleting] = useState<Reservoir | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservoirFormValues>({ resolver: zodResolver(reservoirSchema) });

  async function load() {
    setLoading(true);
    try {
      const res = await reservoirApi.getAll();
      setReservoirs(res.data);
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
    reset({ nom_reservoir: "", capacite_res: 0, niveau_init_res: 0, debit_res: 0 });
    setModalOpen(true);
  }

  function openEdit(r: Reservoir) {
    setEditing(r);
    reset({
      nom_reservoir: r.nom_reservoir,
      capacite_res: r.capacite_res,
      niveau_init_res: r.niveau_init_res,
      debit_res: r.debit_res,
    });
    setModalOpen(true);
  }

  async function onSubmit(values: ReservoirFormValues) {
    try {
      if (editing) {
        await reservoirApi.update(editing.id_reservoir, values);
        toast.success("Réservoir mis à jour.");
      } else {
        await reservoirApi.create(values);
        toast.success("Réservoir créé.");
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
      await reservoirApi.remove(deleting.id_reservoir);
      toast.success("Réservoir supprimé.");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns: Column<Reservoir>[] = [
    { header: "Nom", accessor: (r) => <span className="font-medium text-slate-800">{r.nom_reservoir}</span> },
    { header: "Capacité (m³)", accessor: (r) => r.capacite_res, className: "font-mono" },
    { header: "Niveau initial (m³)", accessor: (r) => r.niveau_init_res, className: "font-mono" },
    { header: "Débit (m³/h)", accessor: (r) => r.debit_res, className: "font-mono" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
            <Waves className="h-6 w-6 text-water-600" /> Réservoirs
          </h1>
          <p className="text-sm text-slate-500">Gestion des réservoirs d'eau du réseau.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-water-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-water-800"
        >
          <Plus className="h-4 w-4" /> Nouveau réservoir
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={reservoirs}
          keyField={(r) => String(r.id_reservoir)}
          onEdit={openEdit}
          onDelete={setDeleting}
          emptyLabel="Aucun réservoir enregistré."
        />
      )}

      <Modal open={modalOpen} title={editing ? "Modifier le réservoir" : "Nouveau réservoir"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nom_reservoir">Nom du réservoir</label>
            <input id="nom_reservoir" type="text" {...register("nom_reservoir")} />
            {errors.nom_reservoir && <p className="mt-1 text-xs text-red-600">{errors.nom_reservoir.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="capacite_res">Capacité</label>
              <input id="capacite_res" type="number" step="any" {...register("capacite_res")} />
              {errors.capacite_res && <p className="mt-1 text-xs text-red-600">{errors.capacite_res.message}</p>}
            </div>
            <div>
              <label htmlFor="niveau_init_res">Niveau initial</label>
              <input id="niveau_init_res" type="number" step="any" {...register("niveau_init_res")} />
              {errors.niveau_init_res && <p className="mt-1 text-xs text-red-600">{errors.niveau_init_res.message}</p>}
            </div>
            <div>
              <label htmlFor="debit_res">Débit</label>
              <input id="debit_res" type="number" step="any" {...register("debit_res")} />
              {errors.debit_res && <p className="mt-1 text-xs text-red-600">{errors.debit_res.message}</p>}
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
        message={`Voulez-vous vraiment supprimer le réservoir "${deleting?.nom_reservoir}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
