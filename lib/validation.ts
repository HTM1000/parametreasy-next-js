import { z } from 'zod';
import { ParameterType, SimNaoEnum } from '@/types/models';

export const parametroSchema = z.object({
  desenvolvedor: z.string()
    .min(1, 'Desenvolvedor é obrigatório')
    .max(100, 'Máximo 100 caracteres'),
    
  grupo: z.string()
    .min(1, 'Grupo é obrigatório')
    .max(50, 'Máximo 50 caracteres'),
    
  subgrupo: z.string()
    .min(1, 'Subgrupo é obrigatório')
    .max(50, 'Máximo 50 caracteres'),
    
  descricao: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(200, 'Máximo 200 caracteres'),
    
  tipo: z.nativeEnum(ParameterType),
  
  descricaoAjuda: z.string()
    .min(1, 'Descrição de ajuda é obrigatória')
    .max(500, 'Máximo 500 caracteres'),
    
  pagina: z.string()
    .max(200, 'Máximo 200 caracteres')
    .optional(),
    
  itens: z.string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional(),
    
  homologando: z.nativeEnum(SimNaoEnum).optional(),
  
  valorInt: z.number().int().optional(),
  valorBit: z.boolean().optional(),
  valorString: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  valorDecimal: z.number().optional(),
  valorDate: z.date().optional(),
  valorImagem: z.string().url('URL inválida').optional().or(z.literal(''))
});

export type ParametroFormData = z.infer<typeof parametroSchema>;