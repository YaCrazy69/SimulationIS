import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Droplets, UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/utils/validators";
import { utilisateurApi } from "@/api/utilisateurApi";
import { getApiErrorMessage } from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/toastStore";

/**
 * Le backend POST /utilisateur/Create_User renvoie uniquement { "Nom_User": "..." }.
 * Pour obtenir l'id_User, on enchaîne un GET /utilisateur/all et on cherche
 * l'utilisateur par email après création.
 */
export default function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      // 1. Créer le compte
      await utilisateurApi.create(values);

      // 2. Récupérer la liste pour trouver l'id_User par email
      const allRes = await utilisateurApi.getAll();
      const created = allRes.data.find((u) => u.email === values.email);

      if (!created) {
        toast.error("Compte créé mais introuvable. Connectez-vous manuellement.");
        navigate("/login");
        return;
      }

      setSession(created.id_User, created);
      toast.success("Compte créé avec succès.");
      navigate("/dashboard");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-water-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-water-700 text-white">
            <Droplets className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-water-950">Créer un compte</h1>
          <p className="text-sm text-slate-500">Rejoignez la plateforme Hydraulix</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Nom_User">Nom</label>
            <input id="Nom_User" type="text" placeholder="Jean Dupont" {...register("Nom_User")} />
            {errors.Nom_User && <p className="mt-1 text-xs text-red-600">{errors.Nom_User.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="jean.dupont@email.com" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="mot_de_passe">Mot de passe</label>
            <input id="mot_de_passe" type="password" placeholder="••••••••" {...register("mot_de_passe")} />
            {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600">{errors.mot_de_passe.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-water-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-water-800 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold text-water-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
