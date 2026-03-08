"use client"

import { cn } from "@/lib/utils"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  ReferenceLine
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react"

export interface DadosCurvaS {
  semana: string
  planejado: number
  real: number
}

interface TabMetricasProps {
  desvioCronograma: number // em dias
  produtividadeEquipe: number // porcentagem
  tendenciaProdutividade: "up" | "down" | "stable"
  dadosCurvaS: DadosCurvaS[]
}

export function TabMetricas({ 
  desvioCronograma, 
  produtividadeEquipe, 
  tendenciaProdutividade,
  dadosCurvaS 
}: TabMetricasProps) {
  const isAtrasado = desvioCronograma > 0

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Desvio de Cronograma */}
        <div className={cn(
          "bg-card rounded-lg border p-4",
          isAtrasado ? "border-status-danger/30" : "border-status-success/30"
        )}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Desvio de Cronograma</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={cn(
                  "text-3xl font-bold",
                  isAtrasado ? "text-status-danger" : "text-status-success"
                )}>
                  {isAtrasado ? "+" : ""}{desvioCronograma}
                </span>
                <span className="text-sm text-muted-foreground">dias</span>
              </div>
              <p className={cn(
                "text-xs mt-1",
                isAtrasado ? "text-status-danger" : "text-status-success"
              )}>
                {isAtrasado ? "Atrasado" : desvioCronograma === 0 ? "No prazo" : "Adiantado"}
              </p>
            </div>
            <div className={cn(
              "size-10 rounded-lg flex items-center justify-center",
              isAtrasado ? "bg-status-danger/10" : "bg-status-success/10"
            )}>
              <Clock className={cn(
                "size-5",
                isAtrasado ? "text-status-danger" : "text-status-success"
              )} />
            </div>
          </div>
        </div>

        {/* Produtividade da Equipe */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Produtividade da Equipe</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={cn(
                  "text-3xl font-bold",
                  produtividadeEquipe >= 100 ? "text-status-success" :
                  produtividadeEquipe >= 80 ? "text-primary" :
                  "text-status-warning"
                )}>
                  {produtividadeEquipe}%
                </span>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs",
                  tendenciaProdutividade === "up" ? "text-status-success" :
                  tendenciaProdutividade === "down" ? "text-status-danger" :
                  "text-muted-foreground"
                )}>
                  {tendenciaProdutividade === "up" && <TrendingUp className="size-3" />}
                  {tendenciaProdutividade === "down" && <TrendingDown className="size-3" />}
                  {tendenciaProdutividade === "up" ? "+5%" : tendenciaProdutividade === "down" ? "-3%" : "0%"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs. meta de 100%
              </p>
            </div>
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="size-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Curva S Chart */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Curva S - Avanço Físico</h3>
            <p className="text-xs text-muted-foreground">Comparativo entre linha de base e realizado</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-muted-foreground/50" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-muted-foreground">Planejado (Baseline)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-primary" />
              <span className="text-xs text-muted-foreground">Realizado</span>
            </div>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosCurvaS} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPlanejado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-muted-foreground)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--color-muted-foreground)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="semana" 
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={35}
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
                  name === "real" ? "Realizado" : "Planejado"
                ]}
              />
              <ReferenceLine y={100} stroke="var(--color-border)" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="planejado"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeDasharray="6 4"
                fill="url(#colorPlanejado)"
              />
              <Area
                type="monotone"
                dataKey="real"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#colorReal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional metrics row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">HH Planejado</p>
          <p className="text-lg font-bold text-foreground mt-1">2,450h</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">HH Realizado</p>
          <p className="text-lg font-bold text-foreground mt-1">2,180h</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Efetivo Médio</p>
          <p className="text-lg font-bold text-foreground mt-1">12 pessoas</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Índice SPI</p>
          <p className={cn(
            "text-lg font-bold mt-1",
            produtividadeEquipe >= 100 ? "text-status-success" : "text-status-warning"
          )}>
            {(produtividadeEquipe / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
