import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Simulations from "@/pages/Simulations";
import SimulationDetail from "@/pages/SimulationDetail";
import Reservoirs from "@/pages/Reservoirs";
import Quartiers from "@/pages/Quartiers";
import Canalisations from "@/pages/Canalisations";
import Resultats from "@/pages/Resultats";
import Utilisateurs from "@/pages/Utilisateurs";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulations" element={<Simulations />} />
        <Route path="/simulation/:id" element={<SimulationDetail />} />
        <Route path="/reservoirs" element={<Reservoirs />} />
        <Route path="/quartiers" element={<Quartiers />} />
        <Route path="/canalisations" element={<Canalisations />} />
        <Route path="/resultats" element={<Resultats />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
