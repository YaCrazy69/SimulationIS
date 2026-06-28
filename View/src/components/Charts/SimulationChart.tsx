import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PointSim } from "@/types";

interface SimulationChartProps {
  points: PointSim[];
}

/** Formate un nombre à 6 décimales */
function fmt6(value: number | string): string {
  return Number(value).toFixed(6);
}

export default function SimulationChart({ points }: SimulationChartProps) {
  return (
    <div className="h-[480px] w-full rounded-xl bg-white p-4 shadow-panel ring-1 ring-slate-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 10, right: 60, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          {/* Axe X : temps en secondes */}
          <XAxis
            dataKey="Temps_Sim"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${Number(v).toFixed(0)}`}
            label={{
              value: "Temps (s)",
              position: "insideBottom",
              offset: -20,
              fontSize: 12,
              fill: "#64748b",
            }}
          />

          {/* Axe Y gauche : Volume (m³) — grande échelle */}
          <YAxis
            yAxisId="volume"
            orientation="left"
            tick={{ fontSize: 11, fill: "#1c6794" }}
            tickFormatter={fmt6}
            label={{
              value: "Volume (m³)",
              angle: -90,
              position: "insideLeft",
              offset: 15,
              fontSize: 11,
              fill: "#1c6794",
            }}
            width={120}
          />

          {/* Axe Y droit : Niveau d'eau (m³) — petite échelle */}
          <YAxis
            yAxisId="niveau"
            orientation="right"
            tick={{ fontSize: 11, fill: "#4ba1cb" }}
            tickFormatter={fmt6}
            label={{
              value: "Niveau (m³)",
              angle: 90,
              position: "insideRight",
              offset: 15,
              fontSize: 11,
              fill: "#4ba1cb",
            }}
            width={120}
          />

          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
            labelFormatter={(v) => `Temps : ${Number(v).toFixed(0)} s`}
            formatter={(value: number | string, name: string) => [
              `${fmt6(value)} m³`,
              name,
            ]}
          />

          <Legend wrapperStyle={{ fontSize: 12 }} />

          <Line
            yAxisId="volume"
            type="monotone"
            dataKey="Volume"
            name="Volume (m³)"
            stroke="#1c6794"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="niveau"
            type="monotone"
            dataKey="Nv_eau"
            name="Niveau d'eau (m³)"
            stroke="#4ba1cb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
