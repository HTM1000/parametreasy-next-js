import { useState } from "react"
import { type Parametro, ParameterType, SimNaoEnum } from "@/types/models"
import { parametroSchema } from "@/lib/validation"
import { z } from "zod"

export function useParametroForm() {
  const [parametro, setParametro] = useState<Parametro>(createEmptyParametro())
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const updateParametro = (field: string, value: unknown) => {
    setParametro(prev => {
      const updated = { ...prev, [field]: value }

      if (field === 'tipo') {
        updated.valorString = ""
        updated.valorInt = undefined
        updated.valorDecimal = undefined
        updated.valorBit = false
        updated.valorDate = undefined
        updated.valorImagem = ""

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

  const resetForm = () => {
    setParametro(createEmptyParametro())
    setErrors({})
  }

  const isFormValid = Boolean(parametro.desenvolvedor && parametro.grupo && parametro.subgrupo && parametro.descricao && parametro.descricaoAjuda)

  return {
    parametro,
    errors,
    updateParametro,
    validateParametro,
    resetForm,
    isFormValid
  }
}