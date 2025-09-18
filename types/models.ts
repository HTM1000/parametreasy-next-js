export enum ParameterType {
  Int = 'int',
  String = 'string',
  Decimal = 'decimal',
  Date = 'date',
  Image = 'image',
  Bit = 'bit',
  MultipleItems = 'multiple_items'
}

export enum SimNaoEnum {
  Sim = 'S',
  Nao = 'N'
}

export interface Parametro {
  id?: string;
  desenvolvedor: string;
  grupo: string;
  subgrupo: string;
  descricao: string;
  tipo: ParameterType;
  descricaoAjuda: string;
  pagina?: string;
  itens?: string;
  homologando?: SimNaoEnum;
  valorInt?: number;
  valorBit?: boolean;
  valorString?: string;
  valorDecimal?: number;
  valorDate?: Date;
  valorImagem?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorViewModel {
  requestId?: string;
  showRequestId: boolean;
}

export interface VersionInfo {
  version: string;
  buildDate?: string;
  environment?: string;
}