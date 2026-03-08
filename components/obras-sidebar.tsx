"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Building2, Factory, ShoppingBag, Hospital, Warehouse, Building, Home, Landmark, GraduationCap, Plane } from "lucide-react"

export type ObraStatus = "em-dia" | "atrasado" | "atencao"

export interface Obra {
  id: string
  nome: string
  cliente: string
  status: ObraStatus
  progresso: number
}

const statusConfig: Record<ObraStatus, { label: string; className: string }> = {
  "em-dia": {
    label: "Em dia",
    className: "bg-status-success/20 text-status-success border-status-success/30",
  },
  atrasado: {
    label: "Atrasado",
    className: "bg-status-danger/20 text-status-danger border-status-danger/30",
  },
  atencao: {
    label: "Atenção",
    className: "bg-status-warning/20 text-status-warning border-status-warning/30",
  },
}

const iconMap: Record<string, React.ElementType> = {
  hospital: Hospital,
  shopping: ShoppingBag,
  industria: Factory,
  edificio: Building2,
  galpao: Warehouse,
  residencia: Home,
  banco: Landmark,
  escola: GraduationCap,
  aeroporto: Plane,
  default: Building,
}

function getIconForObra(nome: string): React.ElementType {
  const nomeNormalizado = nome.toLowerCase()
  if (nomeNormalizado.includes("hospital")) return iconMap.hospital
  if (nomeNormalizado.includes("shopping")) return iconMap.shopping
  if (nomeNormalizado.includes("indústria") || nomeNormalizado.includes("industria")) return iconMap.industria
  if (nomeNormalizado.includes("galpão") || nomeNormalizado.includes("galpao")) return iconMap.galpao
  if (nomeNormalizado.includes("residên") || nomeNormalizado.includes("residen")) return iconMap.residencia
  if (nomeNormalizado.includes("banco")) return iconMap.banco
  if (nomeNormalizado.includes("escola") || nomeNormalizado.includes("universidade")) return iconMap.escola
  if (nomeNormalizado.includes("aeroporto")) return iconMap.aeroporto
  if (nomeNormalizado.includes("edifício") || nomeNormalizado.includes("edificio") || nomeNormalizado.includes("torre")) return iconMap.edificio
  return iconMap.default
}

interface ObrasSidebarProps {
  obras: Obra[]
  obraSelecionada: string | null
  onSelecionarObra: (obraId: string) => void
}

export function ObrasSidebar({ obras, obraSelecionada, onSelecionarObra }: ObrasSidebarProps) {
  return (
    <aside className="w-72 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">HC</span>
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">HVAC Control</h1>
            <p className="text-xs text-muted-foreground">Gestão de Obras</p>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Obras Ativas
        </h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <ul className="space-y-1">
          {obras.map((obra) => {
            const Icon = getIconForObra(obra.nome)
            const status = statusConfig[obra.status]
            const isSelected = obra.id === obraSelecionada
            
            return (
              <li key={obra.id}>
                <button
                  onClick={() => onSelecionarObra(obra.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    isSelected && "bg-sidebar-accent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 size-8 rounded-md flex items-center justify-center shrink-0",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-sidebar-foreground" : "text-sidebar-foreground/80"
                        )}>
                          {obra.nome}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {obra.cliente}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge 
                          variant="outline" 
                          className={cn("text-[10px] px-1.5 py-0 h-4", status.className)}
                        >
                          {status.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {obra.progresso}%
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-sidebar-border">
        <div className="px-2 py-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">
            {obras.length} obras ativas
          </p>
        </div>
      </div>
    </aside>
  )
}
