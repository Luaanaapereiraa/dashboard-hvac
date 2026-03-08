"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, FileText, Camera, CalendarDays } from "lucide-react"
import type { Obra } from "./obras-sidebar"

interface DashboardHeaderProps {
  obra: Obra | null
  ultimaVisita: string
  onSincronizar: () => void
  onGerarRDO: () => void
  onSubirFotos: () => void
  isSincronizando?: boolean
}

export function DashboardHeader({
  obra,
  ultimaVisita,
  onSincronizar,
  onGerarRDO,
  onSubirFotos,
  isSincronizando = false,
}: DashboardHeaderProps) {
  if (!obra) {
    return (
      <header className="bg-card border-b border-border px-6 py-4">
        <p className="text-muted-foreground">Selecione uma obra na barra lateral</p>
      </header>
    )
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{obra.nome}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">{obra.cliente}</span>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5" />
                <span>Última visita: {ultimaVisita}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSincronizar}
            disabled={isSincronizando}
            className="gap-2"
          >
            <RefreshCw className={`size-4 ${isSincronizando ? "animate-spin" : ""}`} />
            Sincronizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSubirFotos}
            className="gap-2"
          >
            <Camera className="size-4" />
            Subir Fotos
          </Button>
          
          <Button
            size="sm"
            onClick={onGerarRDO}
            className="gap-2"
          >
            <FileText className="size-4" />
            Gerar RDO
          </Button>
        </div>
      </div>
    </header>
  )
}
