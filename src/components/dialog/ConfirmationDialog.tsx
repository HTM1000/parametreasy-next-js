import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Zap } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmationDialog({ isOpen, loading, onClose, onConfirm }: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Campo Página Vazio</h3>
            <p className="text-sm text-muted-foreground">Confirme antes de continuar</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            O campo <strong>Página</strong> não foi preenchido. Recomendamos informar a página onde o parâmetro será usado.
          </p>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">💡 Exemplo de preenchimento:</p>
            <p className="text-sm font-mono">frmParametro</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
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
  )
}