export type StatusVacinal = 'aplicada' | 'atrasada' | 'atencao' | 'programada';

export interface Crianca {
  id: string;
  nome: string;
  apelido: string;
  dataNascimento: string;
  escola: string;
  avatar: string;
  cor: string;
  responsavel: string;
  unidadePreferida: string;
  observacoes: string;
}

export interface Vacina {
  id: string;
  nome: string;
  previne: string;
  descricao: string;
  doses: string[];
  faixaIndicada: string;
}

export interface RegistroVacinal {
  id: string;
  criancaId: string;
  vacinaId: string;
  dose: string;
  idadeAlvo: string;
  dataPrevista: string;
  dataAplicacao?: string;
  local?: string;
  lote?: string;
  observacao?: string;
}

export interface RegistroComVacina extends RegistroVacinal {
  vacina: Vacina;
  status: StatusVacinal;
  diasParaVencer: number;
}

export interface CampanhaVacinacao {
  id: string;
  titulo: string;
  descricao: string;
  publico: string;
  inicio: string;
  fim: string;
  local: string;
  vacinaIds: string[];
  idadeMinimaMeses: number;
  idadeMaximaMeses: number;
  destaque: string;
}

export interface ResumoVacinal {
  total: number;
  aplicadas: number;
  atrasadas: number;
  atencao: number;
  programadas: number;
  percentual: number;
}

export const STATUS_LABEL: Record<StatusVacinal, string> = {
  aplicada: 'Aplicada',
  atrasada: 'Atrasada',
  atencao: 'Atenção',
  programada: 'Programada'
};
