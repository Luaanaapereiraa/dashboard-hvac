"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"

export type MetaStatus = "programado" | "em-andamento" | "impedido" | "concluido"

export interface MetaSemanal {
  id: string
  descricao: string
  responsavel: string
  setor: string
  status: MetaStatus
  concluida: boolean
  prioridade: "alta" | "media" | "baixa"
}

interface TabPlanejamentoSemanalProps {
  metas: MetaSemanal[]
  onUpdateMeta: (id: string, updates: Partial<MetaSemanal>) => void
  onAddMeta: () => void
}

const statusConfig: Record<MetaStatus, { label: string; icon: React.ElementType; className: string }> = {
  programado: { 
    label: "Programado", 
    icon: Clock,
    className: "bg-muted text-muted-foreground" 
  },
  "em-andamento": { 
    label: "Em Andamento", 
    icon: Clock,
    className: "bg-primary/20 text-primary" 
  },
  impedido: { 
    label: "Impedido", 
    icon: AlertTriangle,
    className: "bg-status-danger/20 text-status-danger" 
  },
  concluido: { 
    label: "Concluído", 
    icon: CheckCircle2,
    className: "bg-status-success/20 text-status-success" 
  },
}

const prioridadeColors: Record<MetaSemanal["prioridade"], string> = {
  alta: "bg-status-danger",
  media: "bg-status-warning",
  baixa: "bg-muted-foreground/40",
}

export function TabPlanejamentoSemanal({ metas, onUpdateMeta, onAddMeta }: TabPlanejamentoSemanalProps) {
  const totalMetas = metas.length
  const metasConcluidas = metas.filter(m => m.concluida).length
  const metasImpedidas = metas.filter(m => m.status === "impedido").length

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Metas da Semana</p>
            <p className="text-lg font-bold text-foreground">{metasConcluidas}/{totalMetas}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-status-success" />
              <span className="text-xs text-muted-foreground">{metasConcluidas} Concluídas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-status-danger" />
              <span className="text-xs text-muted-foreground">{metasImpedidas} Impedidas</span>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={onAddMeta} className="gap-2">
          <Plus className="size-4" />
          Nova Meta
        </Button>
      </div>

      {/* Meta list */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[32px_1fr_140px_140px_120px_100px] gap-3 p-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
          <div></div>
          <div>Descrição</div>
          <div>Responsável</div>
          <div>Setor</div>
          <div>Status</div>
          <div className="text-center">Prioridade</div>
        </div>
        <div className="divide-y divide-border">
          {metas.map((meta) => {
            const statusInfo = statusConfig[meta.status]
            const StatusIcon = statusInfo.icon
            
            return (
              <div 
                key={meta.id}
                className={cn(
                  "grid grid-cols-[32px_1fr_140px_140px_120px_100px] gap-3 p-3 items-center transition-colors",
                  meta.concluida ? "bg-muted/30" : "hover:bg-muted/20"
                )}
              >
                <div className="flex justify-center">
                  <Checkbox
                    checked={meta.concluida}
                    onCheckedChange={(checked) => {
                      onUpdateMeta(meta.id, { 
                        concluida: !!checked,
                        status: checked ? "concluido" : "programado"
                      })
                    }}
                  />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    meta.concluida ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {meta.descricao}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {meta.responsavel}
                </div>
                <div className="text-sm text-muted-foreground">
                  {meta.setor}
                </div>
                <div>
                  <button
                    onClick={() => {
                      const statuses: MetaStatus[] = ["programado", "em-andamento", "impedido", "concluido"]
                      const currentIndex = statuses.indexOf(meta.status)
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                      onUpdateMeta(meta.id, { 
                        status: nextStatus,
                        concluida: nextStatus === "concluido"
                      })
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full font-medium transition-colors",
                      statusInfo.className
                    )}
                  >
                    <StatusIcon className="size-3" />
                    {statusInfo.label}
                  </button>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("size-2 rounded-full", prioridadeColors[meta.prioridade])} />
                    <span className="text-xs text-muted-foreground capitalize">{meta.prioridade}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
