"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"

interface ProgressSparklineProps {
  dadosReais: { semana: string; valor: number }[]
  dadosPlanejados: { semana: string; valor: number }[]
}

export function ProgressSparkline({ dadosReais, dadosPlanejados }: ProgressSparklineProps) {
  const dados = dadosReais.map((item, index) => ({
    semana: item.semana,
    real: item.valor,
    planejado: dadosPlanejados[index]?.valor ?? 0,
  }))

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Progresso Geral</h3>
          <p className="text-xs text-muted-foreground">Real vs. Planejado</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Real</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-warning" />
            <span className="text-xs text-muted-foreground">Planejado</span>
          </div>
        </div>
      </div>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis 
              dataKey="semana" 
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={25}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                fontSize: "12px",
                color: "var(--color-popover-foreground)",
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === "real" ? "Real" : "Planejado"
              ]}
            />
            <ReferenceLine y={100} stroke="var(--color-border)" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="planejado"
              stroke="var(--color-status-warning)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 3, fill: "var(--color-status-warning)" }}
            />
            <Line
              type="monotone"
              dataKey="real"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "var(--color-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
