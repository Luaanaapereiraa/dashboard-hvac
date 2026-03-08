"use client"

import { useState, useCallback } from "react"
import { ObrasSidebar, type Obra } from "@/components/obras-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { TabelaAvanco, type Equipamento } from "@/components/tabela-avanco"
import { ProgressSparkline } from "@/components/progress-sparkline"

// Dados mock para demonstração
const obrasIniciais: Obra[] = [
  { id: "1", nome: "Hospital Santa Catarina", cliente: "Rede D'Or", status: "em-dia", progresso: 78 },
  { id: "2", nome: "Shopping Iguatemi", cliente: "Iguatemi S.A.", status: "atencao", progresso: 62 },
  { id: "3", nome: "Indústria Klabin", cliente: "Klabin S.A.", status: "atrasado", progresso: 45 },
  { id: "4", nome: "Torre Corporativa JK", cliente: "JHSF Participações", status: "em-dia", progresso: 91 },
  { id: "5", nome: "Galpão Logístico GLP", cliente: "GLP Brasil", status: "em-dia", progresso: 85 },
  { id: "6", nome: "Banco Central - Anexo", cliente: "Banco Central do Brasil", status: "atencao", progresso: 58 },
  { id: "7", nome: "Escola Técnica SENAI", cliente: "SENAI Nacional", status: "em-dia", progresso: 72 },
  { id: "8", nome: "Aeroporto Santos Dumont", cliente: "Infraero", status: "atrasado", progresso: 38 },
  { id: "9", nome: "Edifício Faria Lima 4500", cliente: "BR Properties", status: "em-dia", progresso: 88 },
  { id: "10", nome: "Data Center Equinix SP4", cliente: "Equinix Brasil", status: "atencao", progresso: 55 },
]

const equipamentosIniciais: Record<string, Equipamento[]> = {
  "1": [
    { id: "e1", tag: "CH-01", setor: "Central de Água Gelada", infra: 100, tubulacao: 95, instalacaoMaquina: 80, eletrica: 75, comissionamento: 40 },
    { id: "e2", tag: "CH-02", setor: "Central de Água Gelada", infra: 100, tubulacao: 90, instalacaoMaquina: 75, eletrica: 70, comissionamento: 30 },
    { id: "e3", tag: "FAN-01", setor: "UTI Adulto", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 95, comissionamento: 80 },
    { id: "e4", tag: "FAN-02", setor: "UTI Neonatal", infra: 100, tubulacao: 100, instalacaoMaquina: 95, eletrica: 90, comissionamento: 70 },
    { id: "e5", tag: "FAN-03", setor: "Centro Cirúrgico", infra: 95, tubulacao: 85, instalacaoMaquina: 60, eletrica: 50, comissionamento: 0 },
    { id: "e6", tag: "CX-EXT-01", setor: "Exaustão Cozinha", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 100 },
    { id: "e7", tag: "SPLIT-01", setor: "Sala de Servidores", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 95 },
  ],
  "2": [
    { id: "e8", tag: "CH-01", setor: "Casa de Máquinas", infra: 100, tubulacao: 80, instalacaoMaquina: 60, eletrica: 40, comissionamento: 0 },
    { id: "e9", tag: "CH-02", setor: "Casa de Máquinas", infra: 100, tubulacao: 75, instalacaoMaquina: 55, eletrica: 35, comissionamento: 0 },
    { id: "e10", tag: "FAN-MALL-01", setor: "Praça de Alimentação", infra: 90, tubulacao: 70, instalacaoMaquina: 50, eletrica: 30, comissionamento: 0 },
    { id: "e11", tag: "FAN-MALL-02", setor: "Lojas Âncora", infra: 85, tubulacao: 65, instalacaoMaquina: 45, eletrica: 25, comissionamento: 0 },
    { id: "e12", tag: "VRF-01", setor: "Administração", infra: 100, tubulacao: 100, instalacaoMaquina: 90, eletrica: 85, comissionamento: 60 },
  ],
  "3": [
    { id: "e13", tag: "CH-IND-01", setor: "Processo Industrial", infra: 100, tubulacao: 60, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0 },
    { id: "e14", tag: "CH-IND-02", setor: "Processo Industrial", infra: 100, tubulacao: 55, instalacaoMaquina: 25, eletrica: 15, comissionamento: 0 },
    { id: "e15", tag: "DUTO-EXT-01", setor: "Exaustão Caldeiras", infra: 80, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 0 },
    { id: "e16", tag: "FAN-ADM-01", setor: "Escritório Administrativo", infra: 100, tubulacao: 100, instalacaoMaquina: 80, eletrica: 70, comissionamento: 50 },
  ],
}

// Dados de progresso para sparkline
const dadosProgressoReais: Record<string, { semana: string; valor: number }[]> = {
  "1": [
    { semana: "S1", valor: 15 },
    { semana: "S2", valor: 28 },
    { semana: "S3", valor: 42 },
    { semana: "S4", valor: 55 },
    { semana: "S5", valor: 68 },
    { semana: "S6", valor: 78 },
  ],
  "2": [
    { semana: "S1", valor: 10 },
    { semana: "S2", valor: 22 },
    { semana: "S3", valor: 35 },
    { semana: "S4", valor: 45 },
    { semana: "S5", valor: 55 },
    { semana: "S6", valor: 62 },
  ],
  "3": [
    { semana: "S1", valor: 8 },
    { semana: "S2", valor: 15 },
    { semana: "S3", valor: 22 },
    { semana: "S4", valor: 30 },
    { semana: "S5", valor: 38 },
    { semana: "S6", valor: 45 },
  ],
}

const dadosProgressoPlanejados: Record<string, { semana: string; valor: number }[]> = {
  "1": [
    { semana: "S1", valor: 15 },
    { semana: "S2", valor: 30 },
    { semana: "S3", valor: 45 },
    { semana: "S4", valor: 60 },
    { semana: "S5", valor: 75 },
    { semana: "S6", valor: 85 },
  ],
  "2": [
    { semana: "S1", valor: 12 },
    { semana: "S2", valor: 25 },
    { semana: "S3", valor: 40 },
    { semana: "S4", valor: 55 },
    { semana: "S5", valor: 70 },
    { semana: "S6", valor: 82 },
  ],
  "3": [
    { semana: "S1", valor: 15 },
    { semana: "S2", valor: 30 },
    { semana: "S3", valor: 45 },
    { semana: "S4", valor: 60 },
    { semana: "S5", valor: 75 },
    { semana: "S6", valor: 90 },
  ],
}

const ultimasVisitas: Record<string, string> = {
  "1": "07/03/2026",
  "2": "06/03/2026",
  "3": "05/03/2026",
  "4": "07/03/2026",
  "5": "04/03/2026",
  "6": "03/03/2026",
  "7": "06/03/2026",
  "8": "02/03/2026",
  "9": "07/03/2026",
  "10": "05/03/2026",
}

// Dados padrão para obras sem dados específicos
const dadosProgressoDefault = [
  { semana: "S1", valor: 10 },
  { semana: "S2", valor: 20 },
  { semana: "S3", valor: 35 },
  { semana: "S4", valor: 50 },
  { semana: "S5", valor: 65 },
  { semana: "S6", valor: 75 },
]

const equipamentosDefault: Equipamento[] = [
  { id: "d1", tag: "EQ-01", setor: "Área Principal", infra: 50, tubulacao: 40, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0 },
  { id: "d2", tag: "EQ-02", setor: "Área Secundária", infra: 60, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 10 },
  { id: "d3", tag: "EQ-03", setor: "Área de Apoio", infra: 70, tubulacao: 60, instalacaoMaquina: 50, eletrica: 40, comissionamento: 20 },
]

export default function DashboardPage() {
  const [obras] = useState<Obra[]>(obrasIniciais)
  const [obraSelecionadaId, setObraSelecionadaId] = useState<string>("1")
  const [equipamentos, setEquipamentos] = useState<Record<string, Equipamento[]>>(equipamentosIniciais)
  const [isSincronizando, setIsSincronizando] = useState(false)

  const obraSelecionada = obras.find((o) => o.id === obraSelecionadaId) || null
  const equipamentosObra = equipamentos[obraSelecionadaId] || equipamentosDefault
  const dadosReais = dadosProgressoReais[obraSelecionadaId] || dadosProgressoDefault
  const dadosPlanejados = dadosProgressoPlanejados[obraSelecionadaId] || dadosProgressoDefault

  const handleUpdateEquipamento = useCallback((
    equipId: string,
    campo: keyof Omit<Equipamento, "id" | "tag" | "setor">,
    valor: number
  ) => {
    setEquipamentos((prev) => {
      const equipamentosAtuais = prev[obraSelecionadaId] || equipamentosDefault
      const novosEquipamentos = equipamentosAtuais.map((e) =>
        e.id === equipId ? { ...e, [campo]: valor } : e
      )
      return { ...prev, [obraSelecionadaId]: novosEquipamentos }
    })
  }, [obraSelecionadaId])

  const handleSincronizar = useCallback(() => {
    setIsSincronizando(true)
    // Simula sincronização
    setTimeout(() => {
      setIsSincronizando(false)
    }, 1500)
  }, [])

  const handleGerarRDO = useCallback(() => {
    alert(`Gerando RDO para: ${obraSelecionada?.nome}`)
  }, [obraSelecionada])

  const handleSubirFotos = useCallback(() => {
    alert(`Abrir seletor de fotos para: ${obraSelecionada?.nome}`)
  }, [obraSelecionada])

  return (
    <div className="flex min-h-screen bg-background">
      <ObrasSidebar
        obras={obras}
        obraSelecionada={obraSelecionadaId}
        onSelecionarObra={setObraSelecionadaId}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          obra={obraSelecionada}
          ultimaVisita={ultimasVisitas[obraSelecionadaId] || "—"}
          onSincronizar={handleSincronizar}
          onGerarRDO={handleGerarRDO}
          onSubirFotos={handleSubirFotos}
          isSincronizando={isSincronizando}
        />
        
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <ProgressSparkline
            dadosReais={dadosReais}
            dadosPlanejados={dadosPlanejados}
          />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Controle de Avanço Físico</h2>
                <p className="text-sm text-muted-foreground">
                  Use Tab para navegar entre células • Setas para mover • Enter para confirmar
                </p>
              </div>
            </div>
            
            <TabelaAvanco
              equipamentos={equipamentosObra}
              onUpdateEquipamento={handleUpdateEquipamento}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
