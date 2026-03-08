"use client"

import { useState, useCallback } from "react"
import { ObrasSidebar, type Obra } from "@/components/obras-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TabPlanejamento, type FaseCronograma } from "@/components/tabs/tab-planejamento"
import { TabPlanejamentoSemanal, type MetaSemanal } from "@/components/tabs/tab-planejamento-semanal"
import { TabExecucao, type EquipamentoExecucao } from "@/components/tabs/tab-execucao"
import { TabMetricas, type DadosCurvaS } from "@/components/tabs/tab-metricas"
import { Calendar, ClipboardList, Wrench, BarChart3 } from "lucide-react"

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

// Fases do cronograma por obra
const fasesIniciais: Record<string, FaseCronograma[]> = {
  "1": [
    { id: "f1", nome: "Infraestrutura", dataInicio: "01/01/2026", dataFim: "15/02/2026", progressoPlanejado: 100, progressoReal: 100, status: "concluido" },
    { id: "f2", nome: "Montagem de Dutos", dataInicio: "16/02/2026", dataFim: "30/03/2026", progressoPlanejado: 100, progressoReal: 95, status: "em-andamento" },
    { id: "f3", nome: "Instalação de Máquinas", dataInicio: "01/04/2026", dataFim: "15/05/2026", progressoPlanejado: 80, progressoReal: 75, status: "em-andamento" },
    { id: "f4", nome: "Comissionamento", dataInicio: "16/05/2026", dataFim: "30/06/2026", progressoPlanejado: 30, progressoReal: 20, status: "atrasado" },
  ],
  "2": [
    { id: "f1", nome: "Infraestrutura", dataInicio: "15/01/2026", dataFim: "28/02/2026", progressoPlanejado: 100, progressoReal: 100, status: "concluido" },
    { id: "f2", nome: "Montagem de Dutos", dataInicio: "01/03/2026", dataFim: "15/04/2026", progressoPlanejado: 90, progressoReal: 70, status: "atrasado" },
    { id: "f3", nome: "Instalação de Máquinas", dataInicio: "16/04/2026", dataFim: "31/05/2026", progressoPlanejado: 50, progressoReal: 45, status: "em-andamento" },
    { id: "f4", nome: "Comissionamento", dataInicio: "01/06/2026", dataFim: "15/07/2026", progressoPlanejado: 0, progressoReal: 0, status: "pendente" },
  ],
  "3": [
    { id: "f1", nome: "Infraestrutura", dataInicio: "01/02/2026", dataFim: "15/03/2026", progressoPlanejado: 100, progressoReal: 85, status: "atrasado" },
    { id: "f2", nome: "Montagem de Dutos", dataInicio: "16/03/2026", dataFim: "30/04/2026", progressoPlanejado: 70, progressoReal: 50, status: "atrasado" },
    { id: "f3", nome: "Instalação de Máquinas", dataInicio: "01/05/2026", dataFim: "15/06/2026", progressoPlanejado: 30, progressoReal: 20, status: "atrasado" },
    { id: "f4", nome: "Comissionamento", dataInicio: "16/06/2026", dataFim: "31/07/2026", progressoPlanejado: 0, progressoReal: 0, status: "pendente" },
  ],
}

// Metas semanais por obra
const metasSemanaisIniciais: Record<string, MetaSemanal[]> = {
  "1": [
    { id: "m1", descricao: "Instalar 40m de duto no 2º andar", responsavel: "Carlos Silva", setor: "UTI Adulto", status: "em-andamento", concluida: false, prioridade: "alta" },
    { id: "m2", descricao: "Finalizar tubulação do Chiller 01", responsavel: "José Santos", setor: "CAG", status: "concluido", concluida: true, prioridade: "alta" },
    { id: "m3", descricao: "Passar cabos elétricos sala de cirurgia", responsavel: "Ana Costa", setor: "Centro Cirúrgico", status: "programado", concluida: false, prioridade: "media" },
    { id: "m4", descricao: "Testar vazamento Fan Coil 03", responsavel: "Pedro Lima", setor: "UTI Neonatal", status: "impedido", concluida: false, prioridade: "alta" },
    { id: "m5", descricao: "Ajustar suportes do difusor", responsavel: "Maria Oliveira", setor: "Recepção", status: "programado", concluida: false, prioridade: "baixa" },
  ],
  "2": [
    { id: "m1", descricao: "Montar dutos da praça de alimentação", responsavel: "Ricardo Souza", setor: "Praça de Alimentação", status: "em-andamento", concluida: false, prioridade: "alta" },
    { id: "m2", descricao: "Instalar VRF do escritório administrativo", responsavel: "Fernando Dias", setor: "Administração", status: "programado", concluida: false, prioridade: "media" },
    { id: "m3", descricao: "Pressurizar tubulação lojas âncora", responsavel: "Bruno Alves", setor: "Lojas Âncora", status: "impedido", concluida: false, prioridade: "alta" },
  ],
  "3": [
    { id: "m1", descricao: "Finalizar base do Chiller Industrial", responsavel: "Marcos Pereira", setor: "Processo Industrial", status: "em-andamento", concluida: false, prioridade: "alta" },
    { id: "m2", descricao: "Soldar dutos de exaustão caldeira", responsavel: "Lucas Ferreira", setor: "Caldeiras", status: "impedido", concluida: false, prioridade: "alta" },
  ],
}

// Equipamentos por obra (para aba Execução)
const equipamentosIniciais: Record<string, EquipamentoExecucao[]> = {
  "1": [
    { id: "e1", tag: "CH-01", descricao: "Chiller 500TR", setor: "Central de Água Gelada", infra: 100, tubulacao: 95, instalacaoMaquina: 80, eletrica: 75, comissionamento: 40, temEvidencia: true },
    { id: "e2", tag: "CH-02", descricao: "Chiller 500TR", setor: "Central de Água Gelada", infra: 100, tubulacao: 90, instalacaoMaquina: 75, eletrica: 70, comissionamento: 30, temEvidencia: true },
    { id: "e3", tag: "FAN-01", descricao: "Fan Coil 60.000 BTU", setor: "UTI Adulto", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 95, comissionamento: 80, temEvidencia: true },
    { id: "e4", tag: "FAN-02", descricao: "Fan Coil 48.000 BTU", setor: "UTI Neonatal", infra: 100, tubulacao: 100, instalacaoMaquina: 95, eletrica: 90, comissionamento: 70, temEvidencia: false },
    { id: "e5", tag: "FAN-03", descricao: "Fan Coil 80.000 BTU", setor: "Centro Cirúrgico", infra: 95, tubulacao: 85, instalacaoMaquina: 60, eletrica: 50, comissionamento: 0, temEvidencia: false },
    { id: "e6", tag: "CX-EXT-01", descricao: "Caixa Exaustão 5000m³/h", setor: "Exaustão Cozinha", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 100, temEvidencia: true },
    { id: "e7", tag: "SPLIT-01", descricao: "Split 36.000 BTU", setor: "Sala de Servidores", infra: 100, tubulacao: 100, instalacaoMaquina: 100, eletrica: 100, comissionamento: 95, temEvidencia: true },
    { id: "e8", tag: "BA-01", descricao: "Bomba de Água Gelada", setor: "Casa de Máquinas", infra: 100, tubulacao: 100, instalacaoMaquina: 90, eletrica: 85, comissionamento: 60, temEvidencia: false },
  ],
  "2": [
    { id: "e9", tag: "CH-01", descricao: "Chiller 800TR", setor: "Casa de Máquinas", infra: 100, tubulacao: 80, instalacaoMaquina: 60, eletrica: 40, comissionamento: 0, temEvidencia: true },
    { id: "e10", tag: "CH-02", descricao: "Chiller 800TR", setor: "Casa de Máquinas", infra: 100, tubulacao: 75, instalacaoMaquina: 55, eletrica: 35, comissionamento: 0, temEvidencia: false },
    { id: "e11", tag: "FAN-MALL-01", descricao: "AHU 150.000 BTU", setor: "Praça de Alimentação", infra: 90, tubulacao: 70, instalacaoMaquina: 50, eletrica: 30, comissionamento: 0, temEvidencia: false },
    { id: "e12", tag: "FAN-MALL-02", descricao: "AHU 200.000 BTU", setor: "Lojas Âncora", infra: 85, tubulacao: 65, instalacaoMaquina: 45, eletrica: 25, comissionamento: 0, temEvidencia: false },
    { id: "e13", tag: "VRF-01", descricao: "VRF 120.000 BTU", setor: "Administração", infra: 100, tubulacao: 100, instalacaoMaquina: 90, eletrica: 85, comissionamento: 60, temEvidencia: true },
  ],
  "3": [
    { id: "e14", tag: "CH-IND-01", descricao: "Chiller Industrial 1200TR", setor: "Processo Industrial", infra: 100, tubulacao: 60, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0, temEvidencia: false },
    { id: "e15", tag: "CH-IND-02", descricao: "Chiller Industrial 1200TR", setor: "Processo Industrial", infra: 100, tubulacao: 55, instalacaoMaquina: 25, eletrica: 15, comissionamento: 0, temEvidencia: false },
    { id: "e16", tag: "DUTO-EXT-01", descricao: "Sistema Exaustão 20.000m³/h", setor: "Exaustão Caldeiras", infra: 80, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 0, temEvidencia: false },
    { id: "e17", tag: "FAN-ADM-01", descricao: "Fan Coil 60.000 BTU", setor: "Escritório Administrativo", infra: 100, tubulacao: 100, instalacaoMaquina: 80, eletrica: 70, comissionamento: 50, temEvidencia: true },
  ],
}

// Dados da Curva S por obra
const dadosCurvaSIniciais: Record<string, DadosCurvaS[]> = {
  "1": [
    { semana: "S1", planejado: 8, real: 7 },
    { semana: "S2", planejado: 16, real: 15 },
    { semana: "S3", planejado: 26, real: 25 },
    { semana: "S4", planejado: 38, real: 36 },
    { semana: "S5", planejado: 50, real: 48 },
    { semana: "S6", planejado: 62, real: 60 },
    { semana: "S7", planejado: 72, real: 70 },
    { semana: "S8", planejado: 80, real: 78 },
    { semana: "S9", planejado: 86, real: 82 },
    { semana: "S10", planejado: 92, real: 85 },
  ],
  "2": [
    { semana: "S1", planejado: 10, real: 8 },
    { semana: "S2", planejado: 20, real: 16 },
    { semana: "S3", planejado: 32, real: 26 },
    { semana: "S4", planejado: 44, real: 35 },
    { semana: "S5", planejado: 56, real: 45 },
    { semana: "S6", planejado: 68, real: 55 },
    { semana: "S7", planejado: 78, real: 62 },
    { semana: "S8", planejado: 86, real: 68 },
  ],
  "3": [
    { semana: "S1", planejado: 12, real: 8 },
    { semana: "S2", planejado: 24, real: 15 },
    { semana: "S3", planejado: 38, real: 22 },
    { semana: "S4", planejado: 52, real: 30 },
    { semana: "S5", planejado: 66, real: 38 },
    { semana: "S6", planejado: 78, real: 45 },
  ],
}

// Métricas por obra
const metricasIniciais: Record<string, { desvio: number; produtividade: number; tendencia: "up" | "down" | "stable" }> = {
  "1": { desvio: 3, produtividade: 94, tendencia: "up" },
  "2": { desvio: 12, produtividade: 78, tendencia: "down" },
  "3": { desvio: 25, produtividade: 65, tendencia: "down" },
  "4": { desvio: -2, produtividade: 105, tendencia: "up" },
  "5": { desvio: 0, produtividade: 100, tendencia: "stable" },
  "6": { desvio: 8, produtividade: 82, tendencia: "down" },
  "7": { desvio: 1, produtividade: 96, tendencia: "stable" },
  "8": { desvio: 18, produtividade: 70, tendencia: "down" },
  "9": { desvio: -3, produtividade: 108, tendencia: "up" },
  "10": { desvio: 10, produtividade: 80, tendencia: "down" },
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
const fasesDefault: FaseCronograma[] = [
  { id: "f1", nome: "Infraestrutura", dataInicio: "01/01/2026", dataFim: "28/02/2026", progressoPlanejado: 100, progressoReal: 80, status: "em-andamento" },
  { id: "f2", nome: "Montagem de Dutos", dataInicio: "01/03/2026", dataFim: "30/04/2026", progressoPlanejado: 60, progressoReal: 50, status: "em-andamento" },
  { id: "f3", nome: "Instalação de Máquinas", dataInicio: "01/05/2026", dataFim: "30/06/2026", progressoPlanejado: 30, progressoReal: 25, status: "em-andamento" },
  { id: "f4", nome: "Comissionamento", dataInicio: "01/07/2026", dataFim: "31/07/2026", progressoPlanejado: 0, progressoReal: 0, status: "pendente" },
]

const metasDefault: MetaSemanal[] = [
  { id: "m1", descricao: "Atividade pendente de definição", responsavel: "A definir", setor: "Geral", status: "programado", concluida: false, prioridade: "media" },
]

const equipamentosDefault: EquipamentoExecucao[] = [
  { id: "d1", tag: "EQ-01", descricao: "Equipamento 01", setor: "Área Principal", infra: 50, tubulacao: 40, instalacaoMaquina: 30, eletrica: 20, comissionamento: 0, temEvidencia: false },
  { id: "d2", tag: "EQ-02", descricao: "Equipamento 02", setor: "Área Secundária", infra: 60, tubulacao: 50, instalacaoMaquina: 40, eletrica: 30, comissionamento: 10, temEvidencia: false },
]

const curvaDefault: DadosCurvaS[] = [
  { semana: "S1", planejado: 10, real: 8 },
  { semana: "S2", planejado: 22, real: 18 },
  { semana: "S3", planejado: 36, real: 30 },
  { semana: "S4", planejado: 50, real: 42 },
  { semana: "S5", planejado: 64, real: 55 },
  { semana: "S6", planejado: 76, real: 65 },
]

export default function DashboardPage() {
  const [obras] = useState<Obra[]>(obrasIniciais)
  const [obraSelecionadaId, setObraSelecionadaId] = useState<string>("1")
  const [equipamentos, setEquipamentos] = useState<Record<string, EquipamentoExecucao[]>>(equipamentosIniciais)
  const [metas, setMetas] = useState<Record<string, MetaSemanal[]>>(metasSemanaisIniciais)
  const [isSincronizando, setIsSincronizando] = useState(false)
  const [activeTab, setActiveTab] = useState("execucao")

  const obraSelecionada = obras.find((o) => o.id === obraSelecionadaId) || null
  const equipamentosObra = equipamentos[obraSelecionadaId] || equipamentosDefault
  const fasesObra = fasesIniciais[obraSelecionadaId] || fasesDefault
  const metasObra = metas[obraSelecionadaId] || metasDefault
  const curvaObra = dadosCurvaSIniciais[obraSelecionadaId] || curvaDefault
  const metricasObra = metricasIniciais[obraSelecionadaId] || { desvio: 5, produtividade: 85, tendencia: "stable" as const }

  const handleUpdateEquipamento = useCallback((
    equipId: string,
    campo: keyof Omit<EquipamentoExecucao, "id" | "tag" | "descricao" | "setor" | "temEvidencia">,
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

  const handleUpdateMeta = useCallback((id: string, updates: Partial<MetaSemanal>) => {
    setMetas((prev) => {
      const metasAtuais = prev[obraSelecionadaId] || metasDefault
      const novasMetas = metasAtuais.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      )
      return { ...prev, [obraSelecionadaId]: novasMetas }
    })
  }, [obraSelecionadaId])

  const handleAddMeta = useCallback(() => {
    const novaMeta: MetaSemanal = {
      id: `m${Date.now()}`,
      descricao: "Nova meta semanal",
      responsavel: "A definir",
      setor: "A definir",
      status: "programado",
      concluida: false,
      prioridade: "media",
    }
    setMetas((prev) => {
      const metasAtuais = prev[obraSelecionadaId] || []
      return { ...prev, [obraSelecionadaId]: [...metasAtuais, novaMeta] }
    })
  }, [obraSelecionadaId])

  const handleUploadEvidencia = useCallback((equipId: string) => {
    setEquipamentos((prev) => {
      const equipamentosAtuais = prev[obraSelecionadaId] || equipamentosDefault
      const novosEquipamentos = equipamentosAtuais.map((e) =>
        e.id === equipId ? { ...e, temEvidencia: true } : e
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-fit mb-4">
              <TabsTrigger value="planejamento" className="gap-2">
                <Calendar className="size-4" />
                Planejamento
              </TabsTrigger>
              <TabsTrigger value="semanal" className="gap-2">
                <ClipboardList className="size-4" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="execucao" className="gap-2">
                <Wrench className="size-4" />
                Execução
              </TabsTrigger>
              <TabsTrigger value="metricas" className="gap-2">
                <BarChart3 className="size-4" />
                Métricas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="planejamento" className="mt-0 flex-1">
              <TabPlanejamento fases={fasesObra} />
            </TabsContent>
            
            <TabsContent value="semanal" className="mt-0 flex-1">
              <TabPlanejamentoSemanal 
                metas={metasObra}
                onUpdateMeta={handleUpdateMeta}
                onAddMeta={handleAddMeta}
              />
            </TabsContent>
            
            <TabsContent value="execucao" className="mt-0 flex-1">
              <TabExecucao 
                equipamentos={equipamentosObra}
                onUpdateEquipamento={handleUpdateEquipamento}
                onUploadEvidencia={handleUploadEvidencia}
              />
            </TabsContent>
            
            <TabsContent value="metricas" className="mt-0 flex-1">
              <TabMetricas 
                desvioCronograma={metricasObra.desvio}
                produtividadeEquipe={metricasObra.produtividade}
                tendenciaProdutividade={metricasObra.tendencia}
                dadosCurvaS={curvaObra}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
