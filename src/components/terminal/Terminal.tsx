import { type ScriptResult } from "@/lib/script-generator"
import { type Parametro } from "@/types/models"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { useTypewriter, useTerminalPreview } from "@/src/hooks"

interface TerminalProps {
  scriptResult: ScriptResult | null
  isFormValid: boolean
  parametro: Parametro
}

export function Terminal({ scriptResult, isFormValid, parametro }: TerminalProps) {
  const [copied, setCopied] = useState(false)

  const { previewCommand, statusMessage, progressPercentage } = useTerminalPreview(parametro, isFormValid)

  const { displayedText, isTyping } = useTypewriter({
    text: scriptResult?.script || "",
    speed: 3,
    charsPerStep: 15
  })

  const copyToClipboard = async () => {
    if (displayedText) {
      await navigator.clipboard.writeText(displayedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
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
          <div className="text-slate-400 space-y-3">
            <p className="text-green-400">{previewCommand}</p>
            <p className="text-blue-400">Parametreasy Single Parameter Generator v1.0</p>

            {progressPercentage > 0 && (
              <div className="space-y-2">
                <p className="text-slate-300">Progresso: {progressPercentage}%</p>
                <div className="bg-slate-700 rounded-full h-2 w-full">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            <p className="text-slate-300">Status: <span className={isFormValid ? "text-green-400" : "text-yellow-400"}>{statusMessage}</span></p>

            {parametro.desenvolvedor && (
              <p className="text-slate-500">👤 Dev: <span className="text-blue-300">{parametro.desenvolvedor}</span></p>
            )}
            {parametro.grupo && (
              <p className="text-slate-500">📁 Grupo: <span className="text-green-300">{parametro.grupo}</span></p>
            )}
            {parametro.subgrupo && (
              <p className="text-slate-500">📂 Subgrupo: <span className="text-orange-300">{parametro.subgrupo}</span></p>
            )}
            {parametro.tipo && (
              <p className="text-slate-500">🔧 Tipo: <span className="text-purple-300">{parametro.tipo}</span></p>
            )}
            {parametro.pagina && (
              <p className="text-slate-500">📄 Página: <span className="text-cyan-300">{parametro.pagina}</span></p>
            )}
          </div>
        ) : (
          <div className="text-green-300">
            {isTyping && (
              <p className="text-yellow-400 mb-3 animate-pulse">
                ⚡ Gerando script SQL...
              </p>
            )}
            <pre className="whitespace-pre-wrap leading-6 font-mono">
              {displayedText}
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
  )
}