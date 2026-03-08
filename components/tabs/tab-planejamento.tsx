"use client"

import { cn } from "@/lib/utils"

export interface FaseCronograma {
  id: string
  nome: string
  dataInicio: string
  dataFim: string
  progressoPlanejado: number
  progressoReal: number
  status: "concluido" | "em-andamento" | "pendente" | "atrasado"
}

interface TabPlanejamentoProps {
  fases: FaseCronograma[]
}

const statusColors: Record<FaseCronograma["status"], { bg: string; bar: string }> = {
  concluido: { bg: "bg-status-success/10", bar: "bg-status-success" },
  "em-andamento": { bg: "bg-primary/10", bar: "bg-primary" },
  pendente: { bg: "bg-muted", bar: "bg-muted-foreground/30" },
  atrasado: { bg: "bg-status-danger/10", bar: "bg-status-danger" },
}

const statusLabels: Record<FaseCronograma["status"], string> = {
  concluido: "Concluído",
  "em-andamento": "Em Andamento",
  pendente: "Pendente",
  atrasado: "Atrasado",
}

export function TabPlanejamento({ fases }: TabPlanejamentoProps) {
  const totalPlanejado = fases.reduce((acc, f) => acc + f.progressoPlanejado, 0) / fases.length
  const totalReal = fases.reduce((acc, f) => acc + f.progressoReal, 0) / fases.length
  const desvio = Math.round(totalReal - totalPlanejado)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Progresso Geral</p>
          <p className="text-2xl font-bold text-foreground mt-1">{Math.round(totalReal)}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Meta Planejada</p>
          <p className="text-2xl font-bold text-foreground mt-1">{Math.round(totalPlanejado)}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Desvio</p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            desvio >= 0 ? "text-status-success" : "text-status-danger"
          )}>
            {desvio >= 0 ? "+" : ""}{desvio}%
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Fases em Atraso</p>
          <p className="text-2xl font-bold text-status-danger mt-1">
            {fases.filter(f => f.status === "atrasado").length}
          </p>
        </div>
      </div>

      {/* Gantt-like view */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[200px_1fr_100px_100px_80px] gap-4 p-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
          <div>Fase</div>
          <div>Progresso</div>
          <div className="text-center">Planejado</div>
          <div className="text-center">Real</div>
          <div className="text-center">Status</div>
        </div>
        <div className="divide-y divide-border">
          {fases.map((fase) => {
            const colors = statusColors[fase.status]
            return (
              <div 
                key={fase.id} 
                className="grid grid-cols-[200px_1fr_100px_100px_80px] gap-4 p-3 items-center hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{fase.nome}</p>
                  <p className="text-xs text-muted-foreground">{fase.dataInicio} - {fase.dataFim}</p>
                </div>
                <div className="space-y-1">
                  {/* Planejado */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-muted-foreground/40 transition-all duration-500"
                        style={{ width: `${fase.progressoPlanejado}%` }}
                      />
                    </div>
                  </div>
                  {/* Real */}
                  <div className="flex items-center gap-2">
                    <div className={cn("flex-1 h-3 rounded-full overflow-hidden", colors.bg)}>
                      <div 
                        className={cn("h-full transition-all duration-500", colors.bar)}
                        style={{ width: `${fase.progressoReal}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {fase.progressoPlanejado}%
                </div>
                <div className={cn(
                  "text-center text-sm font-semibold",
                  fase.progressoReal >= fase.progressoPlanejado ? "text-status-success" : "text-status-danger"
                )}>
                  {fase.progressoReal}%
                </div>
                <div className="flex justify-center">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    fase.status === "concluido" && "bg-status-success/20 text-status-success",
                    fase.status === "em-andamento" && "bg-primary/20 text-primary",
                    fase.status === "pendente" && "bg-muted text-muted-foreground",
                    fase.status === "atrasado" && "bg-status-danger/20 text-status-danger",
                  )}>
                    {statusLabels[fase.status]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
