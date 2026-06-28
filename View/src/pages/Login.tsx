import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Droplets, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { utilisateurApi } from "@/api/utilisateurApi";
import { getApiErrorMessage } from "@/api/axios";
import { toast } from "@/stores/toastStore";
import type { Utilisateur } from "@/types";
import Loader from "@/components/Loader";

/**
 * Le backend ne fournit pas de route d'authentification (login).
 * L'identifiant utilisé comme token est l'id_User numérique (int).
 * On propose : saisie manuelle de l'id_User, ou sélection dans la liste GET /utilisateur/all.
 */
export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [idInput, setIdInput] = useState("");
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    utilisateurApi
      .getAll()
      .then((res) => setUsers(res.data))
      .catch(() => {
        // Liste optionnelle : si l'appel échoue, l'utilisateur peut toujours saisir un id manuellement.
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  function handleConnect(id: string | number) {
    const parsed = typeof id === "string" ? parseInt(String(id).trim(), 10) : id;
    if (isNaN(parsed) || parsed <= 0) {
      setError("Veuillez saisir un identifiant utilisateur valide (nombre entier).");
      return;
    }
    setSession(parsed);
    toast.success("Connecté avec succès.");
    navigate("/dashboard");
  }

  async function handleSelectUser(user: Utilisateur) {
    try {
      // Vérifier que l'utilisateur existe toujours côté backend
      await utilisateurApi.getById(user.id_User);
      setSession(user.id_User, user);
      toast.success("Connecté avec succès.");
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
          <h1 className="text-xl font-bold text-water-950">Hydraulix</h1>
          <p className="text-sm text-slate-500">Plateforme de simulation hydraulique</p>
        </div>

        <div className="mb-4">
          <label htmlFor="idUser">Identifiant utilisateur (id_User)</label>
          <input
            id="idUser"
            type="number"
            min="1"
            placeholder="Entrez votre id_User (ex: 1)"
            value={idInput}
            onChange={(e) => {
              setIdInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleConnect(idInput)}
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <button
          onClick={() => handleConnect(idInput)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-water-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-water-800"
        >
          <LogIn className="h-4 w-4" />
          Se connecter
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">ou choisir un compte existant</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {loadingUsers ? (
          <Loader label="Chargement des utilisateurs…" />
        ) : users.length === 0 ? (
          <p className="text-center text-xs text-slate-400">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {users.map((u) => (
              <button
                key={u.id_User}
                onClick={() => handleSelectUser(u)}
                className="flex w-full items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-left text-sm transition hover:border-water-200 hover:bg-water-50"
              >
                <span>
                  <span className="block font-medium text-slate-700">{u.Nom_User}</span>
                  <span className="block text-xs text-slate-400">{u.email}</span>
                </span>
                <span className="font-mono text-xs text-slate-300">#{u.id_User}</span>
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold text-water-700 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
