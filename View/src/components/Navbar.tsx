import { Droplets, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { idUser, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-16 flex-none items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-water-700 text-white">
          <Droplets className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-water-950">Hydraulix</p>
          <p className="text-[11px] leading-none text-slate-400">Supervision hydraulique</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-100">
          <User className="h-4 w-4 text-slate-400" />
          <span className="font-mono text-xs text-slate-500">
            {idUser !== null ? `Utilisateur #${idUser}` : "Invité"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </header>
  );
}
