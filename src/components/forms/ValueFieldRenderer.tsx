import { type Parametro, ParameterType } from "@/types/models"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface ValueFieldRendererProps {
  parametro: Parametro
  onUpdateParametro: (field: string, value: unknown) => void
}

export function ValueFieldRenderer({ parametro, onUpdateParametro }: ValueFieldRendererProps) {
  const commonClass = "h-12 pl-4 pr-4 text-sm border-2 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 hover:border-slate-300 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"

  switch (parametro.tipo) {
    case ParameterType.Int:
      return (
        <Input
          type="number"
          value={parametro.valorInt || ""}
          onChange={(e) => onUpdateParametro("valorInt", Number.parseInt(e.target.value) || undefined)}
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
          onChange={(e) => onUpdateParametro("valorDecimal", Number.parseFloat(e.target.value) || undefined)}
          className={commonClass}
          placeholder="Ex: 10.5"
        />
      )
    case ParameterType.Bit:
      return (
        <Select
          value={parametro.valorBit ? "true" : "false"}
          onChange={(e) => onUpdateParametro("valorBit", e.target.value === "true")}
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
          onChange={(e) => onUpdateParametro("valorDate", e.target.value ? new Date(e.target.value) : undefined)}
          className={commonClass}
        />
      )
    case ParameterType.Image:
      return (
        <Input
          type="url"
          value={parametro.valorImagem || ""}
          onChange={(e) => onUpdateParametro("valorImagem", e.target.value)}
          className={commonClass}
          placeholder="https://exemplo.com/img.jpg"
        />
      )
    case ParameterType.MultipleItems:
      return (
        <Select
          value={parametro.valorString || ""}
          onChange={(e) => onUpdateParametro("valorString", e.target.value)}
          className={commonClass}
        >
          <option value="">Selecione um item</option>
          {parametro.itens?.split(',').map((item, index) => (
            <option key={index} value={item.trim()}>
              {item.trim()}
            </option>
          ))}
        </Select>
      )
    default:
      return (
        <Input
          type="text"
          value={parametro.valorString || ""}
          onChange={(e) => onUpdateParametro("valorString", e.target.value)}
          className={commonClass}
          placeholder="Valor padrão"
        />
      )
  }
}