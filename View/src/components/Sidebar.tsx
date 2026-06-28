import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Waves,
  Building2,
  GitBranch,
  PlayCircle,
  BarChart3,
  Users,
} from "lucide-react";

const LINKS = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/simulations", label: "Simulations", icon: PlayCircle },
  { to: "/reservoirs", label: "Réservoirs", icon: Waves },
  { to: "/quartiers", label: "Quartiers", icon: Building2 },
  { to: "/canalisations", label: "Canalisations", icon: GitBranch },
  { to: "/resultats", label: "Résultats", icon: BarChart3 },
  { to: "/utilisateurs", label: "Utilisateurs", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="flex w-60 flex-none flex-col border-r border-slate-200 bg-water-950 text-water-100">
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-water-400">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-water-700 text-white shadow-sm"
                    : "text-water-200 hover:bg-water-900 hover:text-white"
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-water-800 px-4 py-4 text-[11px] text-water-400">
        Plateforme de simulation hydraulique
        <br />v1.0
      </div>
    </aside>
  );
}
