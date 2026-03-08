"use client"

import { useState, useCallback } from "react"
import { ObrasSidebar, type Obra } from "@/components/obras-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AbaPlanejamento } from "@/components/aba-planejamento"
import { AbaPlanejamentoSemanal } from "@/components/aba-planejamento-semanal"
import { AbaExecucao, type EquipamentoExecucao } from "@/components/aba-execucao"
import { AbaMetricas } from "@/components/aba-metricas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarRange, CalendarCheck, Wrench, BarChart3 } from "lucide-react"

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

// Equipamentos por obra
const equipamentosIniciais: Record<string, EquipamentoExecucao[]> = {
  "1": [
    { id: "e1", tag: "CH-01", setor: "Central de Água Gelada", infra: 100, tubulacao: 95, instalacaoMaquina: 80, eletrica: 75, comissionamento: 40, temEvidencia: true },
    { id: "e2", tag: "CH-02", setor: "Central de Água Gelada", infra: 100, tubulacao: 90, instalacaoMaquina: 75, eletrica: 70, comissionamento: 30, temEvidencia: true },
    { id: "e3", tag: "FAN-01", setor: "UTI Adulto", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 95, comissionamento: 80, temEvidencia: true },
    { id: "e4", tag: "FAN-02", setor: "UTI Neonatal", infra: 100, tubulacao: 100, instalacaoMaquina: 95, eletrica: 90, comissionamento: 70, temEvidencia: false },
    { id: "e5", tag: "FAN-03", setor: "Centro Cirúrgico", infra: 95, tubulacao: 85, instalacaoMaquina: 60, eletrica: 50, comissionamento: 0, temEvidencia: false },
    { id: "e6", tag: "CX-EXT-01", setor: "Exaustão Cozinha", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 100, temEvidencia: true },
    { id: "e7", tag: "SPLIT-01", setor: "Sala de Servidores", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 95, temEvidencia: true },
    { id: "e8", tag: "FAN-04", setor: "Emergência", infra: 100, tubulacao: 90, instalacaoMaquina: 70, eletrica: 55, comissionamento: 20, temEvidencia: false },
    { id: "e9", tag: "VRF-01", setor: "Administração", infra: 100, tubulacao: 100, instalacaoMaquina: 85, eletrica: 80, comissionamento: 60, temEvidencia: true },
  ],
  "2": [
    { id: "e10", tag: "CH-01", setor: "Casa de Máquinas", infra: 100, tubulacao: 80, instalacaoMaquina: 60, eletrica: 40, comissionamento: 0, temEvidencia: true },
    { id: "e11", tag: "CH-02", setor: "Casa de Máquinas", infra: 100, tubulacao: 75, instalacaoMaquina: 55, eletrica: 35, comissionamento: 0, temEvidencia: false },
    { id: "e12", tag: "FAN-MALL-01", setor: "Praça de Alimentação", infra: 90, tubulacao: 70, instalacaoMaquina: 50, eletrica: 30, comissionamento: 0, temEvidencia: false },
    { id: "e13", tag: "FAN-MALL-02", setor: "Lojas Âncora", infra: 85, tubulacao: 65, instalacaoMaquina: 45, eletrica: 25, comissionamento: 0, temEvidencia: false },
    { id: "e14", tag: "VRF-01", setor: "Administração", infra: 100, tubulacao: 100, instalacaoMaquina: 90, eletrica: 85, comissionamento: 60, temEvidencia: true },
    { id: "e15", tag: "FAN-MALL-03", setor: "Cinema", infra: 80, tubulacao: 60, instalacaoMaquina: 40, eletrica: 20, comissionamento: 0, temEvidencia: false },
  ],
  "3": [
    { id: "e16", tag: "CH-IND-01", setor: "Processo Industrial", infra: 100, tubulacao: 60, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0, temEvidencia: true },
    { id: "e17", tag: "CH-IND-02", setor: "Processo Industrial", infra: 100, tubulacao: 55, instalacaoMaquina: 25, eletrica: 15, comissionamento: 0, temEvidencia: false },
    { id: "e18", tag: "DUTO-EXT-01", setor: "Exaustão Caldeiras", infra: 80, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 0, temEvidencia: false },
    { id: "e19", tag: "FAN-ADM-01", setor: "Escritório Administrativo", infra: 100, tubulacao: 100, instalacaoMaquina: 80, eletrica: 70, comissionamento: 50, temEvidencia: true },
    { id: "e20", tag: "SPLIT-LAB-01", setor: "Laboratório QC", infra: 100, tubulacao: 100, instalacaoMaquina: 90, eletrica: 85, comissionamento: 40, temEvidencia: false },
  ],
}

// Fases por obra
const fasesIniciais: Record<string, { id: string; nome: string; progresso: number; dataInicio: string; dataFim: string; previsto: number }[]> = {
  "1": [
    { id: "f1", nome: "Infraestrutura", progresso: 98, dataInicio: "01/01/2026", dataFim: "28/02/2026", previsto: 100 },
    { id: "f2", nome: "Montagem de Dutos", progresso: 85, dataInicio: "15/01/2026", dataFim: "30/03/2026", previsto: 90 },
    { id: "f3", nome: "Instalação de Máquinas", progresso: 72, dataInicio: "01/02/2026", dataFim: "30/04/2026", previsto: 80 },
    { id: "f4", nome: "Comissionamento", progresso: 45, dataInicio: "01/03/2026", dataFim: "30/05/2026", previsto: 55 },
  ],
  "2": [
    { id: "f5", nome: "Infraestrutura", progresso: 92, dataInicio: "01/12/2025", dataFim: "15/02/2026", previsto: 100 },
    { id: "f6", nome: "Montagem de Dutos", progresso: 68, dataInicio: "01/01/2026", dataFim: "30/03/2026", previsto: 85 },
    { id: "f7", nome: "Instalação de Máquinas", progresso: 52, dataInicio: "15/01/2026", dataFim: "15/04/2026", previsto: 70 },
    { id: "f8", nome: "Comissionamento", progresso: 12, dataInicio: "01/03/2026", dataFim: "30/05/2026", previsto: 35 },
  ],
  "3": [
    { id: "f9", nome: "Infraestrutura", progresso: 78, dataInicio: "15/11/2025", dataFim: "28/02/2026", previsto: 100 },
    { id: "f10", nome: "Montagem de Dutos", progresso: 45, dataInicio: "01/01/2026", dataFim: "15/04/2026", previsto: 70 },
    { id: "f11", nome: "Instalação de Máquinas", progresso: 28, dataInicio: "01/02/2026", dataFim: "30/05/2026", previsto: 55 },
    { id: "f12", nome: "Comissionamento", progresso: 0, dataInicio: "01/04/2026", dataFim: "30/06/2026", previsto: 20 },
  ],
}

// Métricas por obra
const metricasIniciais: Record<string, { desvioCronograma: number; produtividadeEquipe: number }> = {
  "1": { desvioCronograma: -5, produtividadeEquipe: 94 },
  "2": { desvioCronograma: -15, produtividadeEquipe: 82 },
  "3": { desvioCronograma: -28, produtividadeEquipe: 71 },
  "4": { desvioCronograma: 3, produtividadeEquipe: 98 },
  "5": { desvioCronograma: 0, produtividadeEquipe: 91 },
  "6": { desvioCronograma: -18, produtividadeEquipe: 78 },
  "7": { desvioCronograma: -8, produtividadeEquipe: 88 },
  "8": { desvioCronograma: -35, produtividadeEquipe: 65 },
  "9": { desvioCronograma: 2, produtividadeEquipe: 95 },
  "10": { desvioCronograma: -12, produtividadeEquipe: 80 },
}

// Dados da Curva S por obra
const dadosCurvaSIniciais: Record<string, { semana: string; planejado: number; real: number | null }[]> = {
  "1": [
    { semana: "S1", planejado: 8, real: 7 },
    { semana: "S2", planejado: 18, real: 16 },
    { semana: "S3", planejado: 30, real: 27 },
    { semana: "S4", planejado: 42, real: 38 },
    { semana: "S5", planejado: 54, real: 50 },
    { semana: "S6", planejado: 65, real: 60 },
    { semana: "S7", planejado: 75, real: 70 },
    { semana: "S8", planejado: 83, real: 78 },
    { semana: "S9", planejado: 90, real: null },
    { semana: "S10", planejado: 95, real: null },
    { semana: "S11", planejado: 98, real: null },
    { semana: "S12", planejado: 100, real: null },
  ],
  "2": [
    { semana: "S1", planejado: 10, real: 8 },
    { semana: "S2", planejado: 22, real: 17 },
    { semana: "S3", planejado: 35, real: 27 },
    { semana: "S4", planejado: 48, real: 38 },
    { semana: "S5", planejado: 60, real: 48 },
    { semana: "S6", planejado: 72, real: 58 },
    { semana: "S7", planejado: 82, real: 62 },
    { semana: "S8", planejado: 90, real: null },
    { semana: "S9", planejado: 95, real: null },
    { semana: "S10", planejado: 100, real: null },
  ],
  "3": [
    { semana: "S1", planejado: 12, real: 8 },
    { semana: "S2", planejado: 25, real: 15 },
    { semana: "S3", planejado: 40, real: 24 },
    { semana: "S4", planejado: 55, real: 32 },
    { semana: "S5", planejado: 70, real: 40 },
    { semana: "S6", planejado: 82, real: 45 },
    { semana: "S7", planejado: 92, real: null },
    { semana: "S8", planejado: 98, real: null },
    { semana: "S9", planejado: 100, real: null },
  ],
}

// Dados padrão
const equipamentosDefault: EquipamentoExecucao[] = [
  { id: "d1", tag: "EQ-01", setor: "Área Principal", infra: 50, tubulacao: 40, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0, temEvidencia: false },
  { id: "d2", tag: "EQ-02", setor: "Área Secundária", infra: 60, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 10, temEvidencia: false },
  { id: "d3", tag: "EQ-03", setor: "Área de Apoio", infra: 70, tubulacao: 60, instalacaoMaquina: 50, eletrica: 40, comissionamento: 20, temEvidencia: false },
]

const fasesDefault = [
  { id: "fd1", nome: "Infraestrutura", progresso: 70, dataInicio: "01/01/2026", dataFim: "28/02/2026", previsto: 100 },
  { id: "fd2", nome: "Montagem de Dutos", progresso: 50, dataInicio: "15/01/2026", dataFim: "30/03/2026", previsto: 80 },
  { id: "fd3", nome: "Instalação de Máquinas", progresso: 30, dataInicio: "01/02/2026", dataFim: "30/04/2026", previsto: 60 },
  { id: "fd4", nome: "Comissionamento", progresso: 10, dataInicio: "01/03/2026", dataFim: "30/05/2026", previsto: 40 },
]

const dadosCurvaSDefault = [
  { semana: "S1", planejado: 10, real: 8 },
  { semana: "S2", planejado: 25, real: 20 },
  { semana: "S3", planejado: 40, real: 32 },
  { semana: "S4", planejado: 55, real: 45 },
  { semana: "S5", planejado: 70, real: 55 },
  { semana: "S6", planejado: 85, real: null },
  { semana: "S7", planejado: 95, real: null },
  { semana: "S8", planejado: 100, real: null },
]

const ultimasVisitas: Record<string, string> = {
  "1": "08/03/2026",
  "2": "07/03/2026",
  "3": "06/03/2026",
  "4": "08/03/2026",
  "5": "05/03/2026",
  "6": "04/03/2026",
  "7": "07/03/2026",
  "8": "03/03/2026",
  "9": "08/03/2026",
  "10": "06/03/2026",
}

export default function DashboardPage() {
  const [obras] = useState<Obra[]>(obrasIniciais)
  const [obraSelecionadaId, setObraSelecionadaId] = useState<string>("1")
  const [equipamentos, setEquipamentos] = useState<Record<string, EquipamentoExecucao[]>>(equipamentosIniciais)
  const [isSincronizando, setIsSincronizando] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState("planejamento")

  const obraSelecionada = obras.find((o) => o.id === obraSelecionadaId) || null
  const equipamentosObra = equipamentos[obraSelecionadaId] || equipamentosDefault
  const fasesObra = fasesIniciais[obraSelecionadaId] || fasesDefault
  const metricasObra = metricasIniciais[obraSelecionadaId] || { desvioCronograma: -10, produtividadeEquipe: 85 }
  const dadosCurvaSObra = dadosCurvaSIniciais[obraSelecionadaId] || dadosCurvaSDefault

  const handleUpdateEquipamento = useCallback((
    equipId: string,
    campo: keyof Omit<EquipamentoExecucao, "id" | "tag" | "setor" | "temEvidencia">,
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

  const handleUploadEvidencia = useCallback((equipId: string) => {
    setEquipamentos((prev) => {
      const equipamentosAtuais = prev[obraSelecionadaId] || equipamentosDefault
      const novosEquipamentos = equipamentosAtuais.map((e) =>
        e.id === equipId ? { ...e, temEvidencia: true } : e
      )
      return { ...prev, [obraSelecionadaId]: novosEquipamentos }
    })
    alert(`Upload de evidência para equipamento ${equipId}`)
  }, [obraSelecionadaId])

  const handleUpdateTarefa = useCallback(() => {
    // Placeholder for task update
  }, [])

  const handleAdicionarTarefa = useCallback(() => {
    alert("Adicionar nova tarefa")
  }, [])

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

        <div className="flex-1 p-4 overflow-auto">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="h-full flex flex-col">
            <TabsList className="w-fit mb-4">
              <TabsTrigger value="planejamento" className="gap-1.5">
                <CalendarRange className="size-4" />
                Planejamento
              </TabsTrigger>
              <TabsTrigger value="semanal" className="gap-1.5">
                <CalendarCheck className="size-4" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="execucao" className="gap-1.5">
                <Wrench className="size-4" />
                Execução
              </TabsTrigger>
              <TabsTrigger value="metricas" className="gap-1.5">
                <BarChart3 className="size-4" />
                Métricas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planejamento" className="flex-1 mt-0">
              <AbaPlanejamento fases={fasesObra} />
            </TabsContent>

            <TabsContent value="semanal" className="flex-1 mt-0">
              <AbaPlanejamentoSemanal
                tarefas={[]}
                onUpdateTarefa={handleUpdateTarefa}
                onAdicionarTarefa={handleAdicionarTarefa}
              />
            </TabsContent>

            <TabsContent value="execucao" className="flex-1 mt-0">
              <AbaExecucao
                equipamentos={equipamentosObra}
                onUpdateEquipamento={handleUpdateEquipamento}
                onUploadEvidencia={handleUploadEvidencia}
              />
            </TabsContent>

            <TabsContent value="metricas" className="flex-1 mt-0">
              <AbaMetricas
                desvioCronograma={metricasObra.desvioCronograma}
                produtividadeEquipe={metricasObra.produtividadeEquipe}
                dadosCurvaS={dadosCurvaSObra as { semana: string; planejado: number; real: number }[]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
