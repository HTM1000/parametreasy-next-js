"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type Parametro, ParameterType, SimNaoEnum } from "@/types/models"
import { parametroSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  FileText,
  Check,
  Code,
  RotateCcw,
  Copy,
  Zap,
  AlertTriangle,
  X
} from "lucide-react"
import { z } from "zod"
import { generateSQLScript, type ScriptResult } from "@/lib/script-generator"

export default function ScriptGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [parametro, setParametro] = useState<Parametro>(createEmptyParametro())
  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null)
  const [displayedScript, setDisplayedScript] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [lastProcessedScript, setLastProcessedScript] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  function createEmptyParametro(): Parametro {
    return {
      id: crypto.randomUUID(),
      desenvolvedor: "",
      grupo: "",
      subgrupo: "",
      descricao: "",
      tipo: ParameterType.String,
      descricaoAjuda: "",
      pagina: "",
      itens: "",
      homologando: SimNaoEnum.Nao,
      valorString: "",
      valorInt: undefined,
      valorDecimal: undefined,
      valorBit: false,
      valorDate: undefined,
      valorImagem: "",
    }
  }

  useEffect(() => {
    const htmlFromEditor = searchParams.get("html")
    if (htmlFromEditor) {
      const decodedHtml = decodeURIComponent(htmlFromEditor)
      setParametro(prev => ({ ...prev, descricaoAjuda: decodedHtml }))
      router.replace("/", { scroll: false })
    }
  }, [searchParams, router])

  // Efeito de digitação no terminal - super rápido
  useEffect(() => {
    if (scriptResult && scriptResult.script && scriptResult.script !== lastProcessedScript) {
      setIsTyping(true)
      setDisplayedScript("")
      setLastProcessedScript(scriptResult.script)

      const script = scriptResult.script
      let currentIndex = 0

      const typeWriter = () => {
        if (currentIndex < script.length) {
          const charsToAdd = Math.min(15, script.length - currentIndex) // Bem rápido
          setDisplayedScript(script.slice(0, currentIndex + charsToAdd))
          currentIndex += charsToAdd
          setTimeout(typeWriter, 3) // Muito rápido
        } else {
          setIsTyping(false)
        }
      }

      setTimeout(typeWriter, 50) // Delay mínimo
    }
  }, [scriptResult, lastProcessedScript])

  const resetForm = () => {
    setParametro(createEmptyParametro())
    setErrors({})
    setScriptResult(null)
    setDisplayedScript("")
    setIsTyping(false)
    setLastProcessedScript("")
  }

  const handleGenerateHtml = () => {
    const currentText = parametro.descricaoAjuda || ""
    router.push(`/html-editor?text=${encodeURIComponent(currentText)}`)
  }

  const updateParametro = (field: string, value: unknown) => {
    setParametro(prev => {
      const updated = { ...prev, [field]: value }

      // Se mudou o tipo, resetar todos os valores para valores padrão
      if (field === 'tipo') {
        updated.valorString = ""
        updated.valorInt = undefined
        updated.valorDecimal = undefined
        updated.valorBit = false
        updated.valorDate = undefined
        updated.valorImagem = ""

        // Definir valores padrão baseado no novo tipo
        switch (value as ParameterType) {
          case ParameterType.String:
            updated.valorString = ""
            break
          case ParameterType.Int:
            updated.valorInt = undefined
            break
          case ParameterType.Decimal:
            updated.valorDecimal = undefined
            break
          case ParameterType.Bit:
            updated.valorBit = false
            break
          case ParameterType.Date:
            updated.valorDate = undefined
            break
          case ParameterType.Image:
            updated.valorImagem = ""
            break
        }
      }

      return updated
    })

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateParametro = () => {
    try {
      parametroSchema.parse({
        ...parametro,
        pagina: parametro.pagina || undefined,
        itens: parametro.itens || undefined,
        valorImagem: parametro.valorImagem || undefined,
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
        return false
      }
      return false
    }
  }

  const generateScript = () => {
    // Verificar se página está vazia e mostrar dialog
    if (!parametro.pagina || parametro.pagina.trim() === "") {
      setShowConfirmDialog(true)
      return
    }

    executeGeneration()
  }

  const executeGeneration = () => {
    if (!validateParametro()) {
      return
    }

    setLoading(true)
    try {
      const result = generateSQLScript([parametro])
      setScriptResult(result)
    } catch (error) {
      console.error("Erro ao gerar script:", error)
      alert("Erro ao gerar script")
    } finally {
      setLoading(false)
      setShowConfirmDialog(false)
    }
  }

  const copyToClipboard = async () => {
    if (displayedScript) {
      await navigator.clipboard.writeText(displayedScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const renderValueField = () => {
    const commonClass = "h-9 bg-input border-border focus:border-primary focus:ring-primary/20 text-sm"
    
    switch (parametro.tipo) {
      case ParameterType.Int:
        return (
          <Input
            type="number"
            value={parametro.valorInt || ""}
            onChange={(e) => updateParametro("valorInt", Number.parseInt(e.target.value) || undefined)}
            className={commonClass}
            placeholder="Ex: 30"
          />
        )
      case ParameterType.Decimal:
        return (
          <Input
            type="number"
            step="0.01"
            value={parametro.valorDecimal || ""}
            onChange={(e) => updateParametro("valorDecimal", Number.parseFloat(e.target.value) || undefined)}
            className={commonClass}
            placeholder="Ex: 10.5"
          />
        )
      case ParameterType.Bit:
        return (
          <Select
            value={parametro.valorBit ? "true" : "false"}
            onChange={(e) => updateParametro("valorBit", e.target.value === "true")}
            className={commonClass}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </Select>
        )
      case ParameterType.Date:
        return (
          <Input
            type="date"
            value={parametro.valorDate ? new Date(parametro.valorDate).toISOString().split("T")[0] : ""}
            onChange={(e) => updateParametro("valorDate", e.target.value ? new Date(e.target.value) : undefined)}
            className={commonClass}
          />
        )
      case ParameterType.Image:
        return (
          <Input
            type="url"
            value={parametro.valorImagem || ""}
            onChange={(e) => updateParametro("valorImagem", e.target.value)}
            className={commonClass}
            placeholder="https://exemplo.com/img.jpg"
          />
        )
      default:
        return (
          <Input
            type="text"
            value={parametro.valorString || ""}
            onChange={(e) => updateParametro("valorString", e.target.value)}
            className={commonClass}
            placeholder="Valor padrão"
          />
        )
    }
  }

  const isFormValid = parametro.desenvolvedor && parametro.grupo && parametro.subgrupo && parametro.descricao && parametro.descricaoAjuda

  return (
    <div className="min-h-screen bg-background p-4">
      
      {/* Header Super Simples */}
      <div className="mb-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold">Parametreasy</h1>
          </div>
          <p className="text-muted-foreground">Gerador de Scripts SQL - Um parâmetro por vez</p>
        </div>
      </div>
      
      {/* Layout Principal - 50/50 */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
        
        {/* Lado Esquerdo - Formulário */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Dados do Parâmetro</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
          
          <div className="space-y-4">
            
            {/* Grid Principal 2x2 */}
            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Desenvolvedor *</Label>
                <Input
                  value={parametro.desenvolvedor}
                  onChange={(e) => updateParametro("desenvolvedor", e.target.value)}
                  className={`h-10 ${errors.desenvolvedor ? "border-destructive" : ""}`}
                  placeholder="Seu nome"
                />
                {errors.desenvolvedor && (
                  <p className="text-xs text-destructive mt-1">{errors.desenvolvedor}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Tipo *</Label>
                <Select
                  value={parametro.tipo}
                  onChange={(e) => updateParametro("tipo", e.target.value as ParameterType)}
                  className="h-10"
                >
                  <option value={ParameterType.String}>String</option>
                  <option value={ParameterType.Int}>Int</option>
                  <option value={ParameterType.Decimal}>Decimal</option>
                  <option value={ParameterType.Bit}>Bool</option>
                  <option value={ParameterType.Date}>Date</option>
                  <option value={ParameterType.Image}>Image</option>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Grupo *</Label>
                <Input
                  value={parametro.grupo}
                  onChange={(e) => updateParametro("grupo", e.target.value)}
                  className={`h-10 ${errors.grupo ? "border-destructive" : ""}`}
                  placeholder="Ex: Sistema"
                />
                {errors.grupo && (
                  <p className="text-xs text-destructive mt-1">{errors.grupo}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Subgrupo *</Label>
                <Input
                  value={parametro.subgrupo}
                  onChange={(e) => updateParametro("subgrupo", e.target.value)}
                  className={`h-10 ${errors.subgrupo ? "border-destructive" : ""}`}
                  placeholder="Ex: Configuração"
                />
                {errors.subgrupo && (
                  <p className="text-xs text-destructive mt-1">{errors.subgrupo}</p>
                )}
              </div>
              
            </div>

            {/* Campos full-width */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Descrição *</Label>
              <Input
                value={parametro.descricao}
                onChange={(e) => updateParametro("descricao", e.target.value)}
                className={`h-10 ${errors.descricao ? "border-destructive" : ""}`}
                placeholder="O que este parâmetro controla"
              />
              {errors.descricao && (
                <p className="text-xs text-destructive mt-1">{errors.descricao}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Descrição de Ajuda *</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateHtml}
                  className="h-7 px-3 text-xs"
                >
                  <Code className="w-3 h-3 mr-1" />
                  Editor HTML
                </Button>
              </div>
              <Input
                value={parametro.descricaoAjuda}
                onChange={(e) => updateParametro("descricaoAjuda", e.target.value)}
                className={`h-10 ${errors.descricaoAjuda ? "border-destructive" : ""}`}
                placeholder="Texto explicativo detalhado"
              />
              {errors.descricaoAjuda && (
                <p className="text-xs text-destructive mt-1">{errors.descricaoAjuda}</p>
              )}
            </div>

            {/* Campo Página e Homologando */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Página (recomendado)</Label>
                <Input
                  value={parametro.pagina || ""}
                  onChange={(e) => updateParametro("pagina", e.target.value)}
                  className="h-10"
                  placeholder="frmParametro"
                />
                <p className="text-xs text-muted-foreground mt-1">Se vazio, será solicitada confirmação</p>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Homologando</Label>
                <Select
                  value={parametro.homologando}
                  onChange={(e) => updateParametro("homologando", e.target.value as SimNaoEnum)}
                  className="h-10"
                >
                  <option value={SimNaoEnum.Nao}>Não</option>
                  <option value={SimNaoEnum.Sim}>Sim</option>
                </Select>
              </div>
            </div>


            <div>
              <Label className="text-sm font-medium mb-2 block">Itens (opcional)</Label>
              <Input
                value={parametro.itens || ""}
                onChange={(e) => updateParametro("itens", e.target.value)}
                className="h-10"
                placeholder="item1,item2,item3"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Valor Padrão ({parametro.tipo})</Label>
              {renderValueField()}
            </div>

          </div>
        </div>

        {/* Lado Direito - Geração e Terminal */}
        <div className="space-y-6">
          
          {/* Status e Botão de Gerar */}
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="mb-4">
              {isFormValid ? (
                <div className="text-green-600 mb-3">
                  <Check className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-semibold">Parâmetro pronto!</p>
                  <p className="text-sm text-muted-foreground">Todos os campos obrigatórios preenchidos</p>
                </div>
              ) : (
                <div className="text-muted-foreground mb-3">
                  <Zap className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-semibold">Preencha o formulário</p>
                  <p className="text-sm">Campos obrigatórios: Desenvolvedor, Grupo, Subgrupo, Descrição, Ajuda</p>
                </div>
              )}
            </div>
            
            <Button
              onClick={generateScript}
              disabled={loading || !isFormValid}
              className="w-full h-12 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent mr-3"></div>
                  Gerando Script...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3" />
                  Gerar Script SQL
                </>
              )}
            </Button>
          </div>

          {/* Terminal */}
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            
            <div className="bg-slate-800 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-slate-400 text-sm font-mono font-semibold">
                  parametreasy@dev-sql
                </span>
              </div>
              
              {scriptResult && (
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="ghost"
                  className={`text-sm ${copied ? "text-green-400" : "text-slate-400"} hover:text-white`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Script
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="p-4 bg-slate-900 font-mono text-sm min-h-96 max-h-96 overflow-y-auto">
              {!scriptResult ? (
                <div className="text-slate-400 space-y-2">
                  <p className="text-green-400">$ parametreasy --single-param</p>
                  <p className="text-blue-400">Parametreasy Single Parameter Generator v1.0</p>
                  <p>Status: {isFormValid ? <span className="text-green-400">Pronto para gerar</span> : <span className="text-yellow-400">Aguardando preenchimento do formulário</span>}</p>
                  <p className="text-slate-500 mt-4">Aguardando comando de geração...</p>
                  <p className="flex items-center text-slate-600">
                    $ <span className="animate-pulse ml-2 bg-green-400 w-2 h-4 inline-block"></span>
                  </p>
                </div>
              ) : (
                <div className="text-green-300">
                  {isTyping && (
                    <p className="text-yellow-400 mb-3 animate-pulse">
                      ⚡ Gerando script SQL...
                    </p>
                  )}
                  <pre className="whitespace-pre-wrap leading-6 font-mono">
                    {displayedScript}
                    {isTyping && (
                      <span className="animate-pulse bg-green-400 text-green-400 ml-1">█</span>
                    )}
                  </pre>
                  {!isTyping && scriptResult && (
                    <div className="text-slate-400 mt-4 text-sm border-t border-slate-700 pt-2">
                      <p className="text-green-400">✅ Script pronto para usar!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Dialog de Confirmação */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">

            {/* Header do Dialog */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Campo Página Vazio</h3>
                <p className="text-sm text-muted-foreground">Confirme antes de continuar</p>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                O campo <strong>Página</strong> não foi preenchido. Recomendamos informar a página onde o parâmetro será usado.
              </p>
              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">💡 Exemplo de preenchimento:</p>
                <p className="text-sm font-mono">frmParametro</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="ghost"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={executeGeneration}
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Continuar Assim Mesmo
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}