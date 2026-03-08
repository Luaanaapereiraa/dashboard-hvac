"use client"

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Equipamento {
  id: string
  tag: string
  setor: string
  infra: number
  tubulacao: number
  instalacaoMaquina: number
  eletrica: number
  comissionamento: number
}

interface TabelaAvancoProps {
  equipamentos: Equipamento[]
  onUpdateEquipamento: (id: string, campo: keyof Omit<Equipamento, "id" | "tag" | "setor">, valor: number) => void
}

const colunas: { key: keyof Omit<Equipamento, "id" | "tag" | "setor">; label: string }[] = [
  { key: "infra", label: "Infra (%)" },
  { key: "tubulacao", label: "Tubulação (%)" },
  { key: "instalacaoMaquina", label: "Inst. Máquina (%)" },
  { key: "eletrica", label: "Elétrica (%)" },
  { key: "comissionamento", label: "Comissão (%)" },
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

  // Update input value when external value changes
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
      // Let Tab work naturally for horizontal navigation
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
    // Select all text on focus
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
          "relative z-10 w-full h-9 px-2 text-center text-sm font-medium",
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

export function TabelaAvanco({ equipamentos, onUpdateEquipamento }: TabelaAvancoProps) {
  // Grid of input refs for keyboard navigation
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

  const calcularMedia = (equip: Equipamento) => {
    const valores = colunas.map(col => equip[col.key])
    const soma = valores.reduce((acc, val) => acc + val, 0)
    return Math.round(soma / valores.length)
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[140px] font-semibold">Equipamento (TAG)</TableHead>
            <TableHead className="w-[160px] font-semibold">Setor</TableHead>
            {colunas.map((col) => (
              <TableHead key={col.key} className="w-[110px] text-center font-semibold">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="w-[80px] text-center font-semibold">Média</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipamentos.map((equip) => {
            const media = calcularMedia(equip)
            return (
              <TableRow key={equip.id} className="group">
                <TableCell className="font-medium text-foreground">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {equip.tag}
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
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
                <TableCell className="text-center">
                  <div className="relative">
                    <ProgressBar value={media} />
                    <span className={cn(
                      "relative z-10 text-sm font-bold",
                      media >= 100 ? "text-status-success" :
                      media >= 70 ? "text-primary" :
                      media > 0 ? "text-foreground" :
                      "text-muted-foreground"
                    )}>
                      {media}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
