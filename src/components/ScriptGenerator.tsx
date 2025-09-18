"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText } from "lucide-react"

import { useParametroForm, useScriptGeneration } from "@/src/hooks"
import { ParametroForm, GenerationStatus, Terminal, ConfirmationDialog } from "@/src/components"

export default function ScriptGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    parametro,
    errors,
    updateParametro,
    validateParametro,
    resetForm,
    isFormValid
  } = useParametroForm()

  const {
    scriptResult,
    loading,
    generateScript,
    clearScript
  } = useScriptGeneration()

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    const htmlFromEditor = searchParams.get("html")
    if (htmlFromEditor) {
      const decodedHtml = decodeURIComponent(htmlFromEditor)
      updateParametro("descricaoAjuda", decodedHtml)
      router.replace("/", { scroll: false })
    }
  }, [searchParams, router, updateParametro])

  const handleReset = () => {
    resetForm()
    clearScript()
  }

  const handleGenerateHtml = () => {
    const currentText = parametro.descricaoAjuda || ""
    router.push(`/html-editor?text=${encodeURIComponent(currentText)}`)
  }

  const handleGenerateScript = () => {
    if (!parametro.pagina || parametro.pagina.trim() === "") {
      setShowConfirmDialog(true)
      return
    }
    executeGeneration()
  }

  const executeGeneration = async () => {
    if (!validateParametro()) {
      return
    }

    try {
      await generateScript([parametro])
    } catch (error) {
      console.error("Erro ao gerar script:", error)
      alert("Erro ao gerar script")
    } finally {
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold">Parametreasy</h1>
          </div>
          <p className="text-muted-foreground">Gerador de Scripts SQL - Um parâmetro por vez</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
        <ParametroForm
          parametro={parametro}
          errors={errors}
          onUpdateParametro={updateParametro}
          onReset={handleReset}
          onGenerateHtml={handleGenerateHtml}
        />

        <div className="space-y-6">
          <GenerationStatus
            isFormValid={isFormValid}
            loading={loading}
            onGenerate={handleGenerateScript}
          />

          <Terminal
            scriptResult={scriptResult}
            isFormValid={isFormValid}
            parametro={parametro}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        loading={loading}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={executeGeneration}
      />
    </div>
  )
}