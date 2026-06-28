import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Loader from "@/components/Loader";
import { utilisateurApi } from "@/api/utilisateurApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import { utilisateurUpdateSchema, type UtilisateurUpdateFormValues } from "@/utils/validators";
import type { Utilisateur } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export default function Utilisateurs() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Utilisateur | null>(null);
  const [deleting, setDeleting] = useState<Utilisateur | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const currentIdUser = useAuthStore((s) => s.idUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UtilisateurUpdateFormValues>({ resolver: zodResolver(utilisateurUpdateSchema) });

  async function load() {
    setLoading(true);
    try {
      const res = await utilisateurApi.getAll();
      setUsers(res.data);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(u: Utilisateur) {
    setEditing(u);
    // mot_de_passe est requis côté backend (PUT attend les 3 champs)
    reset({ Nom_User: u.Nom_User, email: u.email, mot_de_passe: "" });
  }

  async function onSubmit(values: UtilisateurUpdateFormValues) {
    if (!editing) return;
    try {
      await utilisateurApi.update(editing.id_User, {
        Nom_User: values.Nom_User,
        email: values.email,
        mot_de_passe: values.mot_de_passe,
      });
      toast.success("Utilisateur mis à jour.");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await utilisateurApi.remove(deleting.id_User);
      toast.success("Utilisateur supprimé.");
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns: Column<Utilisateur>[] = [
    {
      header: "Nom",
      accessor: (u) => (
        <span className="font-medium text-slate-800">
          {u.Nom_User}{" "}
          {u.id_User === currentIdUser && (
            <span className="ml-1 rounded bg-water-50 px-1.5 py-0.5 text-[10px] font-semibold text-water-700">
              VOUS
            </span>
          )}
        </span>
      ),
    },
    { header: "Email", accessor: (u) => u.email },
    { header: "id_User", accessor: (u) => <span className="font-mono text-xs text-slate-400">#{u.id_User}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-water-950">
          <Users className="h-6 w-6 text-water-600" /> Utilisateurs
        </h1>
        <p className="text-sm text-slate-500">Gestion des comptes de la plateforme.</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          keyField={(u) => String(u.id_User)}
          onEdit={openEdit}
          onDelete={setDeleting}
          emptyLabel="Aucun utilisateur enregistré."
        />
      )}

      <Modal open={!!editing} title="Modifier l'utilisateur" onClose={() => setEditing(null)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Nom_User">Nom</label>
            <input id="Nom_User" type="text" {...register("Nom_User")} />
            {errors.Nom_User && <p className="mt-1 text-xs text-red-600">{errors.Nom_User.message}</p>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="mot_de_passe">
              Mot de passe <span className="text-xs text-slate-400">(requis pour la mise à jour)</span>
            </label>
            <input id="mot_de_passe" type="password" placeholder="••••••••" {...register("mot_de_passe")} />
            {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600">{errors.mot_de_passe.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
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
        message={`Voulez-vous vraiment supprimer l'utilisateur "${deleting?.Nom_User}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
