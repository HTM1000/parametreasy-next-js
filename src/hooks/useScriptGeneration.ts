import { useState } from "react"
import { type Parametro } from "@/types/models"
import { generateSQLScript, type ScriptResult } from "@/lib/script-generator"

export function useScriptGeneration() {
  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null)
  const [loading, setLoading] = useState(false)

  const generateScript = async (parametros: Parametro[]) => {
    setLoading(true)
    try {
      const result = generateSQLScript(parametros)
      setScriptResult(result)
      return result
    } catch (error) {
      console.error("Erro ao gerar script:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearScript = () => {
    setScriptResult(null)
  }

  return {
    scriptResult,
    loading,
    generateScript,
    clearScript
  }
}