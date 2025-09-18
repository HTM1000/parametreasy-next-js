import { useMemo } from "react"
import { type Parametro } from "@/types/models"

export function useTerminalPreview(parametro: Parametro, isFormValid: boolean) {
  const previewCommand = useMemo(() => {
    if (!parametro.desenvolvedor && !parametro.grupo && !parametro.subgrupo && !parametro.descricao) {
      return "$ parametreasy --single-param"
    }

    let command = "$ parametreasy --generate"

    if (parametro.desenvolvedor) {
      command += ` --dev="${parametro.desenvolvedor}"`
    }

    if (parametro.grupo) {
      command += ` --group="${parametro.grupo}"`
    }

    if (parametro.subgrupo) {
      command += ` --subgroup="${parametro.subgrupo}"`
    }

    if (parametro.tipo) {
      command += ` --type="${parametro.tipo}"`
    }

    if (parametro.pagina) {
      command += ` --page="${parametro.pagina}"`
    }

    return command
  }, [parametro])

  const statusMessage = useMemo(() => {
    const filledFields = [
      parametro.desenvolvedor,
      parametro.grupo,
      parametro.subgrupo,
      parametro.descricao,
      parametro.descricaoAjuda
    ].filter(Boolean).length

    if (filledFields === 0) {
      return "Aguardando preenchimento dos campos..."
    } else if (filledFields < 5) {
      return `Preenchido ${filledFields}/5 campos obrigatórios`
    } else if (isFormValid) {
      return "✅ Todos os campos obrigatórios preenchidos - Pronto para gerar!"
    } else {
      return "⚠️ Verificando validação dos campos..."
    }
  }, [parametro, isFormValid])

  const progressPercentage = useMemo(() => {
    const filledFields = [
      parametro.desenvolvedor,
      parametro.grupo,
      parametro.subgrupo,
      parametro.descricao,
      parametro.descricaoAjuda
    ].filter(Boolean).length

    return Math.round((filledFields / 5) * 100)
  }, [parametro])

  return {
    previewCommand,
    statusMessage,
    progressPercentage
  }
}