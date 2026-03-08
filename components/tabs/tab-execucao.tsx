"use client"

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface EquipamentoExecucao {
  id: string
  tag: string
  descricao: string
  setor: string
  infra: number
  tubulacao: number
  instalacaoMaquina: number
  eletrica: number
  comissionamento: number
  temEvidencia: boolean
}

interface TabExecucaoProps {
  equipamentos: EquipamentoExecucao[]
  onUpdateEquipamento: (id: string, campo: keyof Omit<EquipamentoExecucao, "id" | "tag" | "descricao" | "setor" | "temEvidencia">, valor: number) => void
  onUploadEvidencia: (equipId: string) => void
}

const colunas: { key: keyof Omit<EquipamentoExecucao, "id" | "tag" | "descricao" | "setor" | "temEvidencia">; label: string; short: string }[] = [
  { key: "infra", label: "Infraestrutura", short: "Infra" },
  { key: "tubulacao", label: "Tubulação", short: "Tub." },
  { key: "instalacaoMaquina", label: "Inst. Máquina", short: "Inst." },
  { key: "eletrica", label: "Elétrica", short: "Elét." },
  { key: "comissionamento", label: "Comissionamento", short: "Com." },
]

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className={cn(
          "h-full transition-all duration-300 ease-out",
          value >= 100 ? "bg-status-success/20" :
          value >= 70 ? "bg-primary/15" :
          value >= 30 ? "bg-status-warning/15" :
          "bg-transparent"
        )}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

interface CelulaEditavelProps {
  value: number
  onChange: (valor: number) => void
  onNavigate: (direction: "up" | "down" | "left" | "right") => void
  onRegisterRef: (el: HTMLInputElement | null) => void
}

function CelulaEditavel({ value, onChange, onNavigate, onRegisterRef }: CelulaEditavelProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onRegisterRef(inputRef.current)
  }, [onRegisterRef])

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  const handleBlur = () => {
    setIsFocused(false)
    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue)) {
      const clamped = Math.max(0, Math.min(100, numValue))
      onChange(clamped)
      setInputValue(clamped.toString())
    } else {
      setInputValue(value.toString())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    } else if (e.key === "Tab") {
      return
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      onNavigate("up")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      onNavigate("down")
    } else if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
      e.preventDefault()
      onNavigate("left")
    } else if (e.key === "ArrowRight" && e.currentTarget.selectionStart === inputValue.length) {
      e.preventDefault()
      onNavigate("right")
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setInputValue(value.toString())
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }

  return (
    <div className="relative">
      <ProgressBar value={value} />
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={isFocused ? inputValue : value}
        onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ""))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 w-full h-8 px-1 text-center text-xs font-medium",
          "bg-transparent border-0 outline-none",
          "focus:ring-2 focus:ring-primary focus:ring-inset",
          "transition-all",
          value >= 100 ? "text-status-success" :
          value >= 70 ? "text-primary" :
          value > 0 ? "text-foreground" :
          "text-muted-foreground"
        )}
      />
    </div>
  )
}

export function TabExecucao({ equipamentos, onUpdateEquipamento, onUploadEvidencia }: TabExecucaoProps) {
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map())

  const getRefKey = (equipId: string, colIndex: number) => `${equipId}-${colIndex}`

  const registerRef = useCallback((equipId: string, colIndex: number) => {
    return (el: HTMLInputElement | null) => {
      inputRefs.current.set(getRefKey(equipId, colIndex), el)
    }
  }, [])

  const navigate = useCallback((
    currentEquipId: string, 
    currentColIndex: number, 
    direction: "up" | "down" | "left" | "right"
  ) => {
    const equipIndex = equipamentos.findIndex(e => e.id === currentEquipId)
    if (equipIndex === -1) return

    let newEquipIndex = equipIndex
    let newColIndex = currentColIndex

    switch (direction) {
      case "up":
        newEquipIndex = Math.max(0, equipIndex - 1)
        break
      case "down":
        newEquipIndex = Math.min(equipamentos.length - 1, equipIndex + 1)
        break
      case "left":
        newColIndex = Math.max(0, currentColIndex - 1)
        break
      case "right":
        newColIndex = Math.min(colunas.length - 1, currentColIndex + 1)
        break
    }

    const targetEquipId = equipamentos[newEquipIndex].id
    const targetRef = inputRefs.current.get(getRefKey(targetEquipId, newColIndex))
    if (targetRef) {
      targetRef.focus()
    }
  }, [equipamentos])

  const calcularMedia = (equip: EquipamentoExecucao) => {
    const valores = colunas.map(col => equip[col.key])
    const soma = valores.reduce((acc, val) => acc + val, 0)
    return Math.round(soma / valores.length)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Tab para navegar | Setas para mover | Enter para confirmar
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-success" />
            <span>100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span>{">"}70%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-status-warning" />
            <span>{">"}30%</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[90px] text-xs font-semibold">TAG</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Setor</TableHead>
              {colunas.map((col) => (
                <TableHead key={col.key} className="w-[70px] text-center text-xs font-semibold">
                  {col.short}
                </TableHead>
              ))}
              <TableHead className="w-[50px] text-center text-xs font-semibold">Avg</TableHead>
              <TableHead className="w-[80px] text-center text-xs font-semibold">Evid.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipamentos.map((equip) => {
              const media = calcularMedia(equip)
              return (
                <TableRow key={equip.id} className="group">
                  <TableCell className="py-1">
                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded font-medium">
                      {equip.tag}
                    </code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-1 truncate max-w-[140px]">
                    {equip.setor}
                  </TableCell>
                  {colunas.map((col, colIndex) => (
                    <TableCell key={col.key} className="p-0">
                      <CelulaEditavel
                        value={equip[col.key]}
                        onChange={(valor) => onUpdateEquipamento(equip.id, col.key, valor)}
                        onNavigate={(dir) => navigate(equip.id, colIndex, dir)}
                        onRegisterRef={registerRef(equip.id, colIndex)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center py-1">
                    <div className="relative inline-flex items-center justify-center w-full">
                      <ProgressBar value={media} />
                      <span className={cn(
                        "relative z-10 text-xs font-bold",
                        media >= 100 ? "text-status-success" :
                        media >= 70 ? "text-primary" :
                        media > 0 ? "text-foreground" :
                        "text-muted-foreground"
                      )}>
                        {media}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <Button
                      variant={equip.temEvidencia ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => onUploadEvidencia(equip.id)}
                      className={cn(
                        "h-7 w-full gap-1 text-xs",
                        equip.temEvidencia && "border-status-success/30 text-status-success"
                      )}
                    >
                      {equip.temEvidencia ? (
                        <ImageIcon className="size-3" />
                      ) : (
                        <Upload className="size-3" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
