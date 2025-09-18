import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

interface GenerationStatusProps {
  isFormValid: boolean
  loading: boolean
  onGenerate: () => void
}

export function GenerationStatus({ isFormValid, loading, onGenerate }: GenerationStatusProps) {
  return (
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
        onClick={onGenerate}
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
  )
}