"use client"

import { cn } from "@/lib/utils"

interface Fase {
  id: string
  nome: string
  progresso: number
  dataInicio: string
  dataFim: string
  previsto: number
}

interface AbaPlanejamentoProps {
  fases: Fase[]
}

const fasesDefault: Fase[] = [
  { id: "1", nome: "Infraestrutura", progresso: 95, dataInicio: "01/01/2026", dataFim: "15/02/2026", previsto: 100 },
  { id: "2", nome: "Montagem de Dutos", progresso: 75, dataInicio: "01/02/2026", dataFim: "30/03/2026", previsto: 85 },
  { id: "3", nome: "Instalação de Máquinas", progresso: 55, dataInicio: "15/02/2026", dataFim: "30/04/2026", previsto: 70 },
  { id: "4", nome: "Comissionamento", progresso: 20, dataInicio: "15/03/2026", dataFim: "30/05/2026", previsto: 40 },
]

function BarraProgresso({ progresso, previsto }: { progresso: number; previsto: number }) {
  const desvio = previsto - progresso
  const statusCor = desvio <= 0 ? "bg-status-success" : desvio <= 10 ? "bg-status-warning" : "bg-status-danger"

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden relative">
        {/* Linha de previsto */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10"
          style={{ left: `${previsto}%` }}
        />
        {/* Barra de progresso real */}
        <div
          className={cn("h-full transition-all duration-500 rounded-md", statusCor)}
          style={{ width: `${progresso}%` }}
        />
      </div>
      <div className="w-16 text-right">
        <span className={cn(
          "text-sm font-bold",
          desvio <= 0 ? "text-status-success" : desvio <= 10 ? "text-status-warning" : "text-status-danger"
        )}>
          {progresso}%
        </span>
      </div>
    </div>
  )
}

export function AbaPlanejamento({ fases = fasesDefault }: AbaPlanejamentoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cronograma de Fases</h2>
          <p className="text-sm text-muted-foreground">Visão geral do progresso por fase de execução</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-success" />
            <span className="text-muted-foreground">Em dia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-warning" />
            <span className="text-muted-foreground">Atenção</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-danger" />
            <span className="text-muted-foreground">Atrasado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-foreground/30" />
            <span className="text-muted-foreground">Previsto</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[180px_100px_100px_1fr] gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div>Fase</div>
          <div>Início</div>
          <div>Término</div>
          <div>Progresso</div>
        </div>

        {fases.map((fase) => (
          <div
            key={fase.id}
            className="grid grid-cols-[180px_100px_100px_1fr] gap-4 px-4 py-3 border-t border-border items-center hover:bg-muted/30 transition-colors"
          >
            <div className="font-medium text-foreground">{fase.nome}</div>
            <div className="text-sm text-muted-foreground">{fase.dataInicio}</div>
            <div className="text-sm text-muted-foreground">{fase.dataFim}</div>
            <BarraProgresso progresso={fase.progresso} previsto={fase.previsto} />
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        {fases.map((fase) => {
          const desvio = fase.previsto - fase.progresso
          return (
            <div key={fase.id} className="bg-card rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{fase.nome}</div>
              <div className="flex items-end justify-between">
                <span className={cn(
                  "text-2xl font-bold",
                  desvio <= 0 ? "text-status-success" : desvio <= 10 ? "text-status-warning" : "text-status-danger"
                )}>
                  {fase.progresso}%
                </span>
                <span className="text-xs text-muted-foreground">
                  Previsto: {fase.previsto}%
                </span>
              </div>
              {desvio > 0 && (
                <p className="text-xs text-status-danger mt-1">
                  Desvio: -{desvio}%
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
