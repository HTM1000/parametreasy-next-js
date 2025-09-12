"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import WpfRenderer from "@/components/wpf-renderer"
import {
  Copy,
  Check,
  Save,
  Eye,
  Search,
  BookOpen,
  Code,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface Examples {
  format: string
  result: string
  description: string
  category: string
  example: string
}

export default function HtmlEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [htmlText, setHtmlText] = useState("")
  const [htmlCopied, setHtmlCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const formattingExamples: Examples[] = [
    // Text formatting
    {
      format: "**texto**",
      result: "texto",
      description: "Negrito",
      category: "text",
      example: "Este é um **texto importante**",
    },
    {
      format: "*texto*",
      result: "texto",
      description: "Itálico",
      category: "text",
      example: "Palavra em *itálico* na frase",
    },
    {
      format: "***texto***",
      result: "texto",
      description: "Negrito + Itálico",
      category: "text",
      example: "Texto ***muito importante***",
    },
    {
      format: "~~texto~~",
      result: "texto",
      description: "Riscado",
      category: "text",
      example: "~~Preço antigo~~ Novo preço",
    },
    {
      format: "__texto__",
      result: "texto",
      description: "Sublinhado",
      category: "text",
      example: "Texto __sublinhado__ aqui",
    },

    // Headers
    {
      format: "# Título",
      result: "Título H1",
      description: "Título Principal",
      category: "headers",
      example: "# Manual do Usuário",
    },
    {
      format: "## Título",
      result: "Título H2",
      description: "Subtítulo",
      category: "headers",
      example: "## Instalação",
    },
    {
      format: "### Título",
      result: "Título H3",
      description: "Seção",
      category: "headers",
      example: "### Configuração",
    },

    // Code
    {
      format: "`código`",
      result: "código",
      description: "Código Inline",
      category: "code",
      example: "Use `console.log()` para debug",
    },
    {
      format: "```\ncódigo\n```",
      result: "código",
      description: "Bloco de Código",
      category: "code",
      example: "```python\ndef hello():\n    return 'world'\n```",
    },

    // Lists
    {
      format: "- Item",
      result: "• Item",
      description: "Lista Simples",
      category: "lists",
      example: "- Planejar projeto\n- Desenvolver\n- Testar",
    },
    {
      format: "1. Item",
      result: "1. Item",
      description: "Lista Numerada",
      category: "lists",
      example: "1. Primeiro passo\n2. Segundo passo",
    },
    {
      format: "- [ ] Tarefa",
      result: "☐ Tarefa",
      description: "Lista de Tarefas",
      category: "lists",
      example: "- [ ] Revisar código\n- [x] Escrever testes",
    },

    // Special blocks
    {
      format: "> Citação",
      result: "Citação",
      description: "Citação",
      category: "blocks",
      example: "> A imaginação é mais importante que o conhecimento",
    },
    {
      format: "---",
      result: "━━━━━",
      description: "Linha Horizontal",
      category: "blocks",
      example: "Introdução\n\n---\n\nDesenvolvimento",
    },

    // HTML specific elements
    {
      format: "<kbd>Ctrl+C</kbd>",
      result: "Ctrl+C",
      description: "Tecla do Teclado",
      category: "html",
      example: "Pressione <kbd>Ctrl+C</kbd> para copiar",
    },
    {
      format: "<mark>destaque</mark>",
      result: "destaque",
      description: "Texto Destacado",
      category: "html",
      example: "Este é um <mark>texto destacado</mark>",
    },
    {
      format: "<small>texto pequeno</small>",
      result: "texto pequeno",
      description: "Texto Pequeno",
      category: "html",
      example: "<small>Nota de rodapé</small>",
    },
    {
      format: "x<sup>2</sup>",
      result: "x²",
      description: "Sobrescrito",
      category: "html",
      example: "Fórmula: E=mc<sup>2</sup>",
    },
    {
      format: "H<sub>2</sub>O",
      result: "H₂O",
      description: "Subscrito",
      category: "html",
      example: "Água: H<sub>2</sub>O",
    },
    {
      format: "<abbr title='World Wide Web'>WWW</abbr>",
      result: "WWW",
      description: "Abreviação",
      category: "html",
      example: "<abbr title='Hypertext Markup Language'>HTML</abbr>",
    },
    {
      format: "<time datetime='2024-01-01'>Janeiro 2024</time>",
      result: "Janeiro 2024",
      description: "Data/Hora",
      category: "html",
      example: "Publicado em <time datetime='2024-01-01'>1º de Janeiro</time>",
    },
    {
      format: "<progress value='70' max='100'></progress>",
      result: "[████████░░] 70%",
      description: "Barra de Progresso",
      category: "html",
      example: "<progress value='85' max='100'>85%</progress>",
    },

  ]

  const categories = [
    { id: "all", name: "Todos", icon: "📋" },
    { id: "text", name: "Texto", icon: "✏️" },
    { id: "headers", name: "Títulos", icon: "📰" },
    { id: "lists", name: "Listas", icon: "📝" },
    { id: "code", name: "Código", icon: "💻" },
    { id: "blocks", name: "Blocos", icon: "🧱" },
    { id: "html", name: "HTML", icon: "🏷️" },
  ]

  const filteredExamples = formattingExamples.filter((example) => {
    const matchesSearch =
      example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.example.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || example.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    const initialText = searchParams.get("text")
    if (initialText) {
      setHtmlText(decodeURIComponent(initialText))
    }
  }, [searchParams])

  const convertTextToHtml = (text: string): string => {
    let html = text

    // Headers
    html = html.replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
    html = html.replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
    html = html.replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
    html = html.replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    html = html.replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    html = html.replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")

    // Text formatting
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "<em>$1</em>")
    html = html.replace(/__(.*?)__/g, "<u>$1</u>")
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>")

    // Code
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    html = html.replace(/`(.*?)`/g, "<code>$1</code>")

    // Links e imagens não são suportados no WPF FlowDocument

    // Lists
    html = html.replace(/^- \[ \]\s+(.+)$/gm, '<input type="checkbox"> $1')
    html = html.replace(/^- \[x\]\s+(.+)$/gm, '<input type="checkbox" checked> $1')
    html = html.replace(/^\*\s+(.+)$/gm, "<li>$1</li>")
    html = html.replace(/^-\s+(.+)$/gm, "<li>$1</li>")
    html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")

    // Blockquotes and horizontal rules
    html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    html = html.replace(/^---+$/gm, "<hr>")

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>")
    html = html.replace(/\n/g, "<br>")

    if (
      !html.includes("<h") &&
      !html.includes("<p>") &&
      !html.includes("<ul>") &&
      !html.includes("<ol>") &&
      !html.includes("<blockquote>")
    ) {
      html = "<p>" + html + "</p>"
    }

    return html.replace(/\s+/g, " ").trim()
  }

  const handleCopyHtml = async () => {
    const htmlOutput = convertTextToHtml(htmlText)
    try {
      await navigator.clipboard.writeText(htmlOutput)
      setHtmlCopied(true)
      setTimeout(() => setHtmlCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar HTML:", error)
    }
  }

  const handleSaveAndReturn = () => {
    const htmlOutput = convertTextToHtml(htmlText)
    router.push(`/?html=${encodeURIComponent(htmlOutput)}`)
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editor HTML</h1>
                <p className="text-sm text-muted-foreground">Transforme texto em HTML facilmente</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md font-medium">
              {htmlText ? `${htmlText.length} caracteres` : "0 caracteres"}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`${sidebarCollapsed ? "w-12" : "w-80"} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 flex-shrink-0`}
        >
          <div className="p-4 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sidebar-foreground" />
                  <h2 className="font-semibold text-sidebar-foreground">Guia de Formatação</h2>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {!sidebarCollapsed && (
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar formatação..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="w-full px-3 py-2 border border-sidebar-border rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredExamples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-sidebar-primary rounded-lg p-3 border border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer group"
                    onClick={() => setHtmlText((prev) => prev + (prev ? "\n" : "") + example.format)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-sidebar-primary-foreground group-hover:text-sidebar-accent-foreground">
                        {example.description}
                      </span>
                      <Copy className="w-3 h-3 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
                    </div>
                    <div className="font-mono text-xs bg-muted p-2 rounded border text-muted-foreground">
                      {example.format}
                    </div>
                  </div>
                ))}
              </div>

              {filteredExamples.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Nenhum exemplo encontrado</p>
                </div>
              )}
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-card border-b border-border p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "editor"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("editor")}
                >
                  📝 Editor
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "preview"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  👁️ Preview
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "html"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("html")}
                >
                  🔧 HTML
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="text-sm text-muted-foreground font-medium">
                  {htmlText ? `${htmlText.split("\n").length} linhas` : "0 linhas"}
                </div>
                <Button
                  variant="outline"
                  onClick={handleCopyHtml}
                  disabled={!htmlText}
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  {htmlCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar HTML
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSaveAndReturn}
                  disabled={!htmlText}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            {activeTab === "editor" && (
              <div className="h-full flex flex-col">
                <div className="mb-4 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">✍️ Área de Edição</h3>
                  <p className="text-sm text-muted-foreground">Digite ou cole seu texto aqui para converter em HTML</p>
                </div>
                <Textarea
                  value={htmlText}
                  onChange={(e) => setHtmlText(e.target.value)}
                  placeholder="Digite seu texto aqui...

Exemplos de formatação:
**Este texto ficará em negrito**
*Este texto ficará em itálico*
__Este texto ficará sublinhado__
`Este texto ficará como código`
[Google](https://google.com)

# Título Principal
## Subtítulo
### Seção

- Lista com marcadores
1. Lista numerada
- [ ] Tarefa pendente
- [x] Tarefa concluída

> Esta é uma citação importante"
                  className="flex-1 w-full bg-background border border-border focus:border-primary focus:ring-2 focus:ring-ring font-mono text-sm rounded-lg resize-none"
                />
              </div>
            )}

            {activeTab === "preview" && (
              <div className="h-full flex flex-col">
                <div className="mb-4 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">🖥️ Preview WPF</h3>
                  <p className="text-sm text-muted-foreground">Veja como ficará na aplicação WPF (mesmo visual do sistema)</p>
                </div>
                <div className="flex-1 bg-slate-100 rounded-lg border border-border overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border bg-slate-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600 text-sm ml-3 font-mono">WPF FlowDocument Preview</span>
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-300 px-2 py-1 rounded font-mono">
                      Verdana 12px
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto bg-white">
                    <WpfRenderer html={convertTextToHtml(htmlText)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "html" && (
              <div className="h-full flex flex-col">
                <div className="mb-4 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">🔧 Código HTML</h3>
                  <p className="text-sm text-muted-foreground">Código HTML gerado automaticamente</p>
                </div>
                <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground text-sm ml-3 font-mono">output.html</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {convertTextToHtml(htmlText).length} caracteres
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-all">
                      {htmlText ? convertTextToHtml(htmlText) : "Nenhum HTML gerado ainda..."}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="bg-card border-t border-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Editor HTML v2.0</span>
            <span>•</span>
            <span>{htmlText ? `${htmlText.length} caracteres` : "Nenhum conteúdo"}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair sem salvar
          </Button>
        </div>
      </footer>

      {htmlCopied && (
        <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg animate-in fade-in duration-200 z-50">
          <p className="text-card-foreground text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            HTML copiado para a área de transferência!
          </p>
        </div>
      )}
    </div>
  )
}
