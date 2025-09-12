import { Parametro, ParameterType, SimNaoEnum } from '@/types/models';

export interface ScriptResult {
  script: string;
  parametrosCount: number;
  generatedAt: string;
}

function RetornarValorCampoBoolean(valor: boolean): string {
  return valor ? "1" : "0";
}

export function generateSQLScript(parametros: Parametro[]): ScriptResult {
  const scripts: string[] = [];

  parametros.forEach((parameter) => {
    let sql = "EXEC INCLUI_PARAMETROS ";
    sql += `'${parameter.desenvolvedor?.toUpperCase()}', `;
    sql += `'${parameter.grupo?.toUpperCase()}', `;
    sql += `'${parameter.subgrupo?.toUpperCase()}', `;
    sql += `'${parameter.descricao?.toUpperCase()}', `;
    sql += `'${parameter.tipo?.toString().toUpperCase()}', `;
    
    // ValorInt
    sql += `${parameter.valorInt !== undefined && parameter.valorInt !== null ? parameter.valorInt.toString() : "NULL"}, `;
    
    // ValorString
    sql += `${parameter.valorString && parameter.valorString.trim() !== "" ? `'${parameter.valorString.toUpperCase()}'` : "NULL"}, `;
    
    // ValorDecimal
    sql += `${parameter.valorDecimal !== undefined && parameter.valorDecimal !== null ? parameter.valorDecimal.toFixed(3).replace(",", ".") : "NULL"}, `;
    
    // v_VALORIMAGEM
    sql += `NULL, `;
    
    // palavraschave
    sql += `NULL, `;
    
    // loja
    sql += `NULL, `;
    
    // codigo
    sql += `NULL, `;
    
    // ValorBit
    sql += `${parameter.valorBit !== undefined && parameter.valorBit !== null ? RetornarValorCampoBoolean(parameter.valorBit) : "NULL"}, `;
    
    // itens
    sql += `NULL, `;
    
    // DescricaoAjuda
    sql += `'${parameter.descricaoAjuda?.toUpperCase()}', `;
    
    // valorDate
    sql += `NULL, `;
    
    // Homologando
    const homologandoValue = parameter.homologando === SimNaoEnum.Sim ? 1 : 0;
    sql += `${homologandoValue}, `;
    
    // pagina
    sql += `${parameter.pagina && parameter.pagina.trim() !== "" ? `'${parameter.pagina.toUpperCase()}'` : "NULL"};`;
    
    scripts.push(sql);
  });

  return {
    script: scripts.join('\n'),
    parametrosCount: parametros.length,
    generatedAt: new Date().toISOString()
  };
}