import { type Parametro, ParameterType, SimNaoEnum } from "@/types/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { RotateCcw, Code, User, Tag, Layers, FileText, HelpCircle, File, Settings } from "lucide-react"
import { ValueFieldRenderer } from "./ValueFieldRenderer"

interface ParametroFormProps {
  parametro: Parametro
  errors: Record<string, string>
  onUpdateParametro: (field: string, value: unknown) => void
  onReset: () => void
  onGenerateHtml: () => void
}

export function ParametroForm({
  parametro,
  errors,
  onUpdateParametro,
  onReset,
  onGenerateHtml
}: ParametroFormProps) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200/60 rounded-2xl p-8 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dados do Parâmetro</h2>
            <p className="text-sm text-slate-500">Preencha as informações necessárias</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-10 px-4 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Desenvolvedor *
            </Label>
            <div className="relative">
              <Input
                value={parametro.desenvolvedor}
                onChange={(e) => onUpdateParametro("desenvolvedor", e.target.value)}
                className={`h-12 pl-4 pr-4 text-sm border-2 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm
                  ${errors.desenvolvedor
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-300"
                  }`}
                placeholder="Seu nome"
              />
            </div>
            {errors.desenvolvedor && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {errors.desenvolvedor}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-500" />
              Tipo *
            </Label>
            <Select
              value={parametro.tipo}
              onChange={(e) => onUpdateParametro("tipo", e.target.value as ParameterType)}
              className="h-12 border-2 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 hover:border-slate-300 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
              <option value={ParameterType.String}>📝 String</option>
              <option value={ParameterType.Int}>🔢 Int</option>
              <option value={ParameterType.Decimal}>💯 Decimal</option>
              <option value={ParameterType.Bit}>✅ Bool</option>
              <option value={ParameterType.Date}>📅 Date</option>
              <option value={ParameterType.Image}>🖼️ Image</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-500" />
              Grupo *
            </Label>
            <div className="relative">
              <Input
                value={parametro.grupo}
                onChange={(e) => onUpdateParametro("grupo", e.target.value)}
                className={`h-12 pl-4 pr-4 text-sm border-2 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm
                  ${errors.grupo
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-green-500 focus:ring-green-500/20 hover:border-slate-300"
                  }`}
                placeholder="Ex: Sistema"
              />
            </div>
            {errors.grupo && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {errors.grupo}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              Subgrupo *
            </Label>
            <div className="relative">
              <Input
                value={parametro.subgrupo}
                onChange={(e) => onUpdateParametro("subgrupo", e.target.value)}
                className={`h-12 pl-4 pr-4 text-sm border-2 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm
                  ${errors.subgrupo
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 hover:border-slate-300"
                  }`}
                placeholder="Ex: Configuração"
              />
            </div>
            {errors.subgrupo && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {errors.subgrupo}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Descrição *
          </Label>
          <div className="relative">
            <Input
              value={parametro.descricao}
              onChange={(e) => onUpdateParametro("descricao", e.target.value)}
              className={`h-12 pl-4 pr-4 text-sm border-2 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm
                ${errors.descricao
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-300"
                }`}
              placeholder="O que este parâmetro controla"
            />
          </div>
          {errors.descricao && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {errors.descricao}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              Descrição de Ajuda *
            </Label>
            <Button
              type="button"
              size="sm"
              onClick={onGenerateHtml}
              className="h-8 px-3 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 shadow-sm"
            >
              <Code className="w-3 h-3 mr-1" />
              Editor HTML
            </Button>
          </div>
          <div className="relative">
            <Input
              value={parametro.descricaoAjuda}
              onChange={(e) => onUpdateParametro("descricaoAjuda", e.target.value)}
              className={`h-12 pl-4 pr-4 text-sm border-2 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm
                ${errors.descricaoAjuda
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-300"
                }`}
              placeholder="Texto explicativo detalhado"
            />
          </div>
          {errors.descricaoAjuda && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {errors.descricaoAjuda}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <File className="w-4 h-4 text-teal-500" />
              Página (recomendado)
            </Label>
            <div className="relative">
              <Input
                value={parametro.pagina || ""}
                onChange={(e) => onUpdateParametro("pagina", e.target.value)}
                className="h-12 pl-4 pr-4 text-sm border-2 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 hover:border-slate-300 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"
                placeholder="frmParametro"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Se vazio, será solicitada confirmação
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-500" />
              Homologando
            </Label>
            <Select
              value={parametro.homologando}
              onChange={(e) => onUpdateParametro("homologando", e.target.value as SimNaoEnum)}
              className="h-12 border-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 hover:border-slate-300 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
              <option value={SimNaoEnum.Nao}>❌ Não</option>
              <option value={SimNaoEnum.Sim}>✅ Sim</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            Itens (opcional)
          </Label>
          <div className="relative">
            <Input
              value={parametro.itens || ""}
              onChange={(e) => onUpdateParametro("itens", e.target.value)}
              className="h-12 pl-4 pr-4 text-sm border-2 border-slate-200 focus:border-pink-500 focus:ring-pink-500/20 hover:border-slate-300 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"
              placeholder="item1,item2,item3"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Settings className="w-4 h-4 text-violet-500" />
            Valor Padrão ({parametro.tipo})
          </Label>
          <ValueFieldRenderer
            parametro={parametro}
            onUpdateParametro={onUpdateParametro}
          />
        </div>
      </div>
    </div>
  )
}