"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"

type StatusTarefa = "programado" | "em-andamento" | "impedido" | "concluido"

interface Tarefa {
  id: string
  descricao: string
  local: string
  status: StatusTarefa
  concluida: boolean
  responsavel?: string
  impedimento?: string
}

interface AbaPlanejamentoSemanalProps {
  tarefas: Tarefa[]
  onUpdateTarefa: (id: string, updates: Partial<Tarefa>) => void
  onAdicionarTarefa: () => void
}

const statusConfig: Record<StatusTarefa, { label: string; icon: React.ElementType; className: string }> = {
  programado: {
    label: "Programado",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  "em-andamento": {
    label: "Em Andamento",
    icon: Clock,
    className: "bg-primary/20 text-primary border-primary/30",
  },
  impedido: {
    label: "Impedido",
    icon: AlertTriangle,
    className: "bg-status-danger/20 text-status-danger border-status-danger/30",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-status-success/20 text-status-success border-status-success/30",
  },
}

const tarefasDefault: Tarefa[] = [
  { id: "1", descricao: "Instalar 40m de duto no 2º andar", local: "Ala Norte - 2º Andar", status: "em-andamento", concluida: false, responsavel: "Equipe A" },
  { id: "2", descricao: "Finalizar conexão elétrica FAN-01", local: "UTI Adulto", status: "programado", concluida: false, responsavel: "Equipe B" },
  { id: "3", descricao: "Teste de pressão tubulação água gelada", local: "Casa de Máquinas", status: "impedido", concluida: false, impedimento: "Aguardando material" },
  { id: "4", descricao: "Instalação de dampers no retorno", local: "Centro Cirúrgico", status: "programado", concluida: false, responsavel: "Equipe A" },
  { id: "5", descricao: "Isolamento térmico dutos setor leste", local: "Ala Leste - 1º Andar", status: "concluido", concluida: true, responsavel: "Equipe C" },
  { id: "6", descricao: "Montagem suportes para fancoils", local: "Ambulatório", status: "em-andamento", concluida: false, responsavel: "Equipe B" },
]

export function AbaPlanejamentoSemanal({
  tarefas,
  onUpdateTarefa,
  onAdicionarTarefa,
}: AbaPlanejamentoSemanalProps) {
  const tarefasIniciais = tarefas.length > 0 ? tarefas : tarefasDefault
  const [tarefasLocais, setTarefasLocais] = useState(tarefasIniciais)

  const handleToggleConcluida = (id: string) => {
    setTarefasLocais((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, concluida: !t.concluida, status: !t.concluida ? "concluido" : "programado" }
          : t
      )
    )
    onUpdateTarefa?.(id, { concluida: !tarefasLocais.find((t) => t.id === id)?.concluida })
  }

  const handleChangeStatus = (id: string, status: StatusTarefa) => {
    setTarefasLocais((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, concluida: status === "concluido" } : t
      )
    )
    onUpdateTarefa?.(id, { status, concluida: status === "concluido" })
  }

  const concluidas = tarefasLocais.filter((t) => t.concluida).length
  const total = tarefasLocais.length
  const impedidas = tarefasLocais.filter((t) => t.status === "impedido").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Metas da Semana</h2>
          <p className="text-sm text-muted-foreground">
            Semana 10 - 04/03 a 08/03/2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-status-success">{concluidas}</span>/{total} concluídas
            </span>
            {impedidas > 0 && (
              <span className="text-status-danger">
                <span className="font-semibold">{impedidas}</span> impedida{impedidas > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Button size="sm" onClick={onAdicionarTarefa} className="gap-1.5">
            <Plus className="size-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Barra de progresso semanal */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progresso Semanal</span>
          <span className="text-sm font-medium text-foreground">
            {Math.round((concluidas / total) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-status-success transition-all duration-300"
            style={{ width: `${(concluidas / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de tarefas */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {tarefasLocais.map((tarefa) => {
            const config = statusConfig[tarefa.status]
            const Icon = config.icon

            return (
              <div
                key={tarefa.id}
                className={cn(
                  "flex items-start gap-4 p-4 transition-colors hover:bg-muted/30",
                  tarefa.concluida && "opacity-60"
                )}
              >
                <Checkbox
                  checked={tarefa.concluida}
                  onCheckedChange={() => handleToggleConcluida(tarefa.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium text-foreground",
                    tarefa.concluida && "line-through"
                  )}>
                    {tarefa.descricao}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{tarefa.local}</span>
                    {tarefa.responsavel && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-xs text-muted-foreground">{tarefa.responsavel}</span>
                      </>
                    )}
                  </div>
                  {tarefa.impedimento && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-status-danger">
                      <AlertTriangle className="size-3" />
                      {tarefa.impedimento}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={tarefa.status}
                    onChange={(e) => handleChangeStatus(tarefa.id, e.target.value as StatusTarefa)}
                    className="text-xs bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="programado">Programado</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="impedido">Impedido</option>
                    <option value="concluido">Concluído</option>
                  </select>
                  <Badge variant="outline" className={cn("text-[10px] gap-1", config.className)}>
                    <Icon className="size-3" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
