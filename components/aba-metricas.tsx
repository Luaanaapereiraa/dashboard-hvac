"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts"

interface DadosCurvaS {
  semana: string
  planejado: number
  real: number
}

interface AbaMetricasProps {
  desvioCronograma: number // em dias (positivo = adiantado, negativo = atrasado)
  produtividadeEquipe: number // porcentagem (100 = meta)
  dadosCurvaS: DadosCurvaS[]
}

const dadosCurvaSDefault: DadosCurvaS[] = [
  { semana: "S1", planejado: 5, real: 4 },
  { semana: "S2", planejado: 12, real: 10 },
  { semana: "S3", planejado: 22, real: 18 },
  { semana: "S4", planejado: 35, real: 30 },
  { semana: "S5", planejado: 48, real: 42 },
  { semana: "S6", planejado: 60, real: 52 },
  { semana: "S7", planejado: 72, real: 63 },
  { semana: "S8", planejado: 82, real: 72 },
  { semana: "S9", planejado: 90, real: 78 },
  { semana: "S10", planejado: 95, real: 85 },
  { semana: "S11", planejado: 98, real: null as unknown as number },
  { semana: "S12", planejado: 100, real: null as unknown as number },
]

function KPICard({
  titulo,
  valor,
  unidade,
  descricao,
  tendencia,
  icon: Icon,
  isPositive,
}: {
  titulo: string
  valor: number | string
  unidade?: string
  descricao: string
  tendencia?: "up" | "down" | "neutral"
  icon: React.ElementType
  isPositive: boolean
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "size-10 rounded-lg flex items-center justify-center",
          isPositive ? "bg-status-success/20" : "bg-status-danger/20"
        )}>
          <Icon className={cn(
            "size-5",
            isPositive ? "text-status-success" : "text-status-danger"
          )} />
        </div>
        {tendencia && tendencia !== "neutral" && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            tendencia === "up" ? "text-status-success" : "text-status-danger"
          )}>
            {tendencia === "up" ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>{tendencia === "up" ? "Melhorando" : "Piorando"}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{titulo}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-3xl font-bold",
            isPositive ? "text-status-success" : "text-status-danger"
          )}>
            {valor}
          </span>
          {unidade && <span className="text-sm text-muted-foreground">{unidade}</span>}
        </div>
        <p className="text-xs text-muted-foreground">{descricao}</p>
      </div>
    </div>
  )
}

export function AbaMetricas({
  desvioCronograma = -12,
  produtividadeEquipe = 87,
  dadosCurvaS = dadosCurvaSDefault,
}: AbaMetricasProps) {
  const desvioPositivo = desvioCronograma >= 0
  const produtividadeOk = produtividadeEquipe >= 90

  // Encontrar o último ponto real
  const ultimoReal = dadosCurvaS.filter((d) => d.real !== null)
  const ultimoRealIndex = ultimoReal.length - 1
  const pontoAtual = ultimoReal[ultimoRealIndex]
  const pontoPlanejadoAtual = dadosCurvaS.find((d) => d.semana === pontoAtual?.semana)
  const gap = pontoPlanejadoAtual ? pontoPlanejadoAtual.planejado - pontoAtual.real : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Indicadores de Performance</h2>
          <p className="text-sm text-muted-foreground">Análise de desempenho da obra</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <KPICard
          titulo="Desvio de Cronograma"
          valor={desvioPositivo ? `+${desvioCronograma}` : desvioCronograma}
          unidade="dias"
          descricao={desvioPositivo ? "Obra adiantada em relação ao planejado" : "Obra atrasada em relação ao planejado"}
          tendencia={desvioPositivo ? "up" : "down"}
          icon={Clock}
          isPositive={desvioPositivo}
        />
        <KPICard
          titulo="Produtividade da Equipe"
          valor={produtividadeEquipe}
          unidade="%"
          descricao={produtividadeOk ? "Acima da meta estabelecida" : "Abaixo da meta de 90%"}
          tendencia={produtividadeOk ? "up" : "down"}
          icon={Users}
          isPositive={produtividadeOk}
        />
      </div>

      {/* Curva S */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Curva S - Avanço Físico Acumulado</h3>
            <p className="text-xs text-muted-foreground">Linha de base (planejado) vs. Realizado</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-muted-foreground" style={{ borderTop: "2px dashed" }} />
              <span className="text-muted-foreground">Planejado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-primary" />
              <span className="text-muted-foreground">Realizado</span>
            </div>
            {gap > 0 && (
              <div className="flex items-center gap-1.5 text-status-danger">
                <span className="font-medium">Gap: {gap}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosCurvaS} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id="fillReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                width={30}
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
                formatter={(value: number | null, name: string) => [
                  value !== null ? `${value}%` : "—",
                  name === "real" ? "Realizado" : "Planejado",
                ]}
              />
              <ReferenceLine y={100} stroke="var(--color-border)" strokeDasharray="3 3" />
              
              {/* Área do realizado */}
              <Area
                type="monotone"
                dataKey="real"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#fillReal)"
                connectNulls={false}
                dot={{ r: 3, fill: "var(--color-primary)" }}
                activeDot={{ r: 5, fill: "var(--color-primary)" }}
              />
              
              {/* Linha do planejado */}
              <Line
                type="monotone"
                dataKey="planejado"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 3, fill: "var(--color-muted-foreground)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Previsto Hoje</p>
          <p className="text-xl font-bold text-foreground">{pontoPlanejadoAtual?.planejado || 0}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Realizado</p>
          <p className="text-xl font-bold text-primary">{pontoAtual?.real || 0}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gap</p>
          <p className={cn(
            "text-xl font-bold",
            gap > 0 ? "text-status-danger" : "text-status-success"
          )}>
            {gap > 0 ? `-${gap}%` : gap === 0 ? "0%" : `+${Math.abs(gap)}%`}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Semana Atual</p>
          <p className="text-xl font-bold text-foreground">{pontoAtual?.semana || "—"}</p>
        </div>
      </div>
    </div>
  )
}
