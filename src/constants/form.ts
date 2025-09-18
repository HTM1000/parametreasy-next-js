export const REQUIRED_FIELDS = [
  'desenvolvedor',
  'grupo',
  'subgrupo',
  'descricao',
  'descricaoAjuda'
] as const

export const FORM_MESSAGES = {
  REQUIRED_FIELDS_HELP: "Campos obrigatórios: Desenvolvedor, Grupo, Subgrupo, Descrição, Ajuda",
  FORM_READY: "Parâmetro pronto!",
  ALL_REQUIRED_FILLED: "Todos os campos obrigatórios preenchidos",
  FILL_FORM: "Preencha o formulário",
  PAGE_FIELD_EMPTY: "Campo Página Vazio",
  PAGE_RECOMMENDATION: "Recomendamos informar a página onde o parâmetro será usado.",
  CONFIRMATION_REQUIRED: "Se vazio, será solicitada confirmação"
} as const