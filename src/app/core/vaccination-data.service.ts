import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { Injectable, computed, signal } from '@angular/core';

import {
  CampanhaVacinacao,
  Crianca,
  RegistroComVacina,
  RegistroVacinal,
  ResumoVacinal,
  StatusVacinal,
  Vacina
} from './vaccination.models';

const DIA_EM_MS = 24 * 60 * 60 * 1000;

const CRIANCAS: Crianca[] = [
  {
    id: 'sofia',
    nome: 'Sofia Almeida',
    apelido: 'Sofia',
    dataNascimento: '2024-08-12',
    escola: 'Creche Jardim das Letras',
    avatar: 'SA',
    cor: '#ABC270',
    responsavel: 'Marina Almeida',
    unidadePreferida: 'UBS Central',
    observacoes: 'Sem alergias registradas'
  },
  {
    id: 'theo',
    nome: 'Theo Almeida',
    apelido: 'Theo',
    dataNascimento: '2022-02-04',
    escola: 'EMEI Pequenos Passos',
    avatar: 'TA',
    cor: '#FEC868',
    responsavel: 'Marina Almeida',
    unidadePreferida: 'UBS Santa Luzia',
    observacoes: 'Levar carteira física na próxima visita'
  },
  {
    id: 'luna',
    nome: 'Luna Almeida',
    apelido: 'Luna',
    dataNascimento: '2026-02-25',
    escola: 'Em casa',
    avatar: 'LA',
    cor: '#FDA769',
    responsavel: 'Marina Almeida',
    unidadePreferida: 'UBS Central',
    observacoes: 'Prematura de 36 semanas'
  }
];

const VACINAS: Vacina[] = [
  {
    id: 'bcg',
    nome: 'BCG',
    previne: 'Formas graves de tuberculose',
    descricao: 'Dose única aplicada preferencialmente ao nascer.',
    doses: ['Dose única'],
    faixaIndicada: 'Ao nascer'
  },
  {
    id: 'hepatite-b',
    nome: 'Hepatite B',
    previne: 'Infecção pelo vírus da hepatite B',
    descricao: 'Primeira dose ao nascer, com reforços combinados em outras vacinas.',
    doses: ['Nascimento', 'Reforços no calendário'],
    faixaIndicada: 'Ao nascer'
  },
  {
    id: 'pentavalente',
    nome: 'Pentavalente',
    previne: 'Difteria, tétano, coqueluche, hepatite B e Hib',
    descricao: 'Esquema em três doses no primeiro ano de vida.',
    doses: ['2 meses', '4 meses', '6 meses'],
    faixaIndicada: '2 a 6 meses'
  },
  {
    id: 'rotavirus',
    nome: 'Rotavírus',
    previne: 'Gastroenterite grave por rotavírus',
    descricao: 'Vacina oral com janela de aplicação restrita nos primeiros meses.',
    doses: ['2 meses', '4 meses'],
    faixaIndicada: '2 a 4 meses'
  },
  {
    id: 'pneumococica',
    nome: 'Pneumocócica 10V',
    previne: 'Pneumonia, otite e meningite pneumocócica',
    descricao: 'Proteção importante para bebês e crianças pequenas.',
    doses: ['2 meses', '4 meses', '12 meses'],
    faixaIndicada: '2 a 12 meses'
  },
  {
    id: 'meningococica-c',
    nome: 'Meningocócica C',
    previne: 'Meningite meningocócica do sorogrupo C',
    descricao: 'Inclui doses no primeiro ano e reforço no segundo ano de vida.',
    doses: ['3 meses', '5 meses', '12 meses'],
    faixaIndicada: '3 a 12 meses'
  },
  {
    id: 'triplice-viral',
    nome: 'Tríplice viral',
    previne: 'Sarampo, caxumba e rubéola',
    descricao: 'Vacina essencial para controle de surtos e proteção coletiva.',
    doses: ['12 meses', '15 meses'],
    faixaIndicada: '12 a 15 meses'
  },
  {
    id: 'dtp',
    nome: 'DTP',
    previne: 'Difteria, tétano e coqueluche',
    descricao: 'Reforços após o esquema inicial da pentavalente.',
    doses: ['15 meses', '4 anos'],
    faixaIndicada: '15 meses a 4 anos'
  },
  {
    id: 'influenza',
    nome: 'Influenza',
    previne: 'Gripe e complicações respiratórias',
    descricao: 'Campanha anual para crianças dentro do público-alvo.',
    doses: ['Anual'],
    faixaIndicada: 'A partir de 6 meses'
  },
  {
    id: 'febre-amarela',
    nome: 'Febre amarela',
    previne: 'Febre amarela',
    descricao: 'Aplicação conforme calendário e orientação territorial.',
    doses: ['9 meses', '4 anos'],
    faixaIndicada: '9 meses a 4 anos'
  },
  {
    id: 'hepatite-a',
    nome: 'Hepatite A',
    previne: 'Infecção pelo vírus da hepatite A',
    descricao: 'Dose única indicada no segundo ano de vida.',
    doses: ['15 meses'],
    faixaIndicada: '15 meses'
  }
];

const REGISTROS: RegistroVacinal[] = [
  {
    id: 'sofia-bcg',
    criancaId: 'sofia',
    vacinaId: 'bcg',
    dose: 'Dose única',
    idadeAlvo: 'Ao nascer',
    dataPrevista: '2024-08-12',
    dataAplicacao: '2024-08-13',
    local: 'Maternidade São Lucas',
    lote: 'BCG-2408'
  },
  {
    id: 'sofia-hepb',
    criancaId: 'sofia',
    vacinaId: 'hepatite-b',
    dose: 'Nascimento',
    idadeAlvo: 'Ao nascer',
    dataPrevista: '2024-08-12',
    dataAplicacao: '2024-08-13',
    local: 'Maternidade São Lucas',
    lote: 'HB-2408'
  },
  {
    id: 'sofia-penta-1',
    criancaId: 'sofia',
    vacinaId: 'pentavalente',
    dose: '1ª dose',
    idadeAlvo: '2 meses',
    dataPrevista: '2024-10-12',
    dataAplicacao: '2024-10-15',
    local: 'UBS Central',
    lote: 'PEN-2410'
  },
  {
    id: 'sofia-penta-2',
    criancaId: 'sofia',
    vacinaId: 'pentavalente',
    dose: '2ª dose',
    idadeAlvo: '4 meses',
    dataPrevista: '2024-12-12',
    dataAplicacao: '2024-12-14',
    local: 'UBS Central',
    lote: 'PEN-2412'
  },
  {
    id: 'sofia-penta-3',
    criancaId: 'sofia',
    vacinaId: 'pentavalente',
    dose: '3ª dose',
    idadeAlvo: '6 meses',
    dataPrevista: '2025-02-12',
    dataAplicacao: '2025-02-12',
    local: 'UBS Central',
    lote: 'PEN-2502'
  },
  {
    id: 'sofia-triplice',
    criancaId: 'sofia',
    vacinaId: 'triplice-viral',
    dose: '1ª dose',
    idadeAlvo: '12 meses',
    dataPrevista: '2025-08-12',
    dataAplicacao: '2025-08-18',
    local: 'UBS Central',
    lote: 'TV-2508'
  },
  {
    id: 'sofia-dtp',
    criancaId: 'sofia',
    vacinaId: 'dtp',
    dose: '1º reforço',
    idadeAlvo: '15 meses',
    dataPrevista: '2025-11-12',
    dataAplicacao: '2025-11-20',
    local: 'UBS Central',
    lote: 'DTP-2511'
  },
  {
    id: 'sofia-meningo-reforco',
    criancaId: 'sofia',
    vacinaId: 'meningococica-c',
    dose: 'Reforço',
    idadeAlvo: '12 meses',
    dataPrevista: '2026-06-10',
    observacao: 'Pendente após mudança de unidade'
  },
  {
    id: 'sofia-hepa',
    criancaId: 'sofia',
    vacinaId: 'hepatite-a',
    dose: 'Dose única',
    idadeAlvo: '15 meses',
    dataPrevista: '2026-07-08'
  },
  {
    id: 'theo-bcg',
    criancaId: 'theo',
    vacinaId: 'bcg',
    dose: 'Dose única',
    idadeAlvo: 'Ao nascer',
    dataPrevista: '2022-02-04',
    dataAplicacao: '2022-02-05',
    local: 'Maternidade São Lucas',
    lote: 'BCG-2202'
  },
  {
    id: 'theo-penta',
    criancaId: 'theo',
    vacinaId: 'pentavalente',
    dose: '3ª dose',
    idadeAlvo: '6 meses',
    dataPrevista: '2022-08-04',
    dataAplicacao: '2022-08-05',
    local: 'UBS Santa Luzia',
    lote: 'PEN-2208'
  },
  {
    id: 'theo-triplice',
    criancaId: 'theo',
    vacinaId: 'triplice-viral',
    dose: '2ª dose',
    idadeAlvo: '15 meses',
    dataPrevista: '2023-05-04',
    dataAplicacao: '2023-05-05',
    local: 'UBS Santa Luzia',
    lote: 'TV-2305'
  },
  {
    id: 'theo-dtp-4',
    criancaId: 'theo',
    vacinaId: 'dtp',
    dose: 'Reforço de 4 anos',
    idadeAlvo: '4 anos',
    dataPrevista: '2026-02-04',
    dataAplicacao: '2026-02-06',
    local: 'UBS Santa Luzia',
    lote: 'DTP-2602'
  },
  {
    id: 'theo-influenza',
    criancaId: 'theo',
    vacinaId: 'influenza',
    dose: 'Campanha anual',
    idadeAlvo: '4 anos',
    dataPrevista: '2026-05-20',
    observacao: 'Campanha ativa até 31/07'
  },
  {
    id: 'theo-febre',
    criancaId: 'theo',
    vacinaId: 'febre-amarela',
    dose: 'Reforço',
    idadeAlvo: '4 anos',
    dataPrevista: '2026-07-15'
  },
  {
    id: 'luna-bcg',
    criancaId: 'luna',
    vacinaId: 'bcg',
    dose: 'Dose única',
    idadeAlvo: 'Ao nascer',
    dataPrevista: '2026-02-25',
    dataAplicacao: '2026-02-27',
    local: 'Maternidade São Lucas',
    lote: 'BCG-2602'
  },
  {
    id: 'luna-hepb',
    criancaId: 'luna',
    vacinaId: 'hepatite-b',
    dose: 'Nascimento',
    idadeAlvo: 'Ao nascer',
    dataPrevista: '2026-02-25',
    dataAplicacao: '2026-02-27',
    local: 'Maternidade São Lucas',
    lote: 'HB-2602'
  },
  {
    id: 'luna-rota-1',
    criancaId: 'luna',
    vacinaId: 'rotavirus',
    dose: '1ª dose',
    idadeAlvo: '2 meses',
    dataPrevista: '2026-04-25',
    dataAplicacao: '2026-04-26',
    local: 'UBS Central',
    lote: 'ROT-2604'
  },
  {
    id: 'luna-penta-1',
    criancaId: 'luna',
    vacinaId: 'pentavalente',
    dose: '1ª dose',
    idadeAlvo: '2 meses',
    dataPrevista: '2026-04-25',
    dataAplicacao: '2026-04-26',
    local: 'UBS Central',
    lote: 'PEN-2604'
  },
  {
    id: 'luna-pneumo-1',
    criancaId: 'luna',
    vacinaId: 'pneumococica',
    dose: '1ª dose',
    idadeAlvo: '2 meses',
    dataPrevista: '2026-04-25',
    dataAplicacao: '2026-04-26',
    local: 'UBS Central',
    lote: 'PNE-2604'
  },
  {
    id: 'luna-penta-2',
    criancaId: 'luna',
    vacinaId: 'pentavalente',
    dose: '2ª dose',
    idadeAlvo: '4 meses',
    dataPrevista: '2026-06-26'
  },
  {
    id: 'luna-rota-2',
    criancaId: 'luna',
    vacinaId: 'rotavirus',
    dose: '2ª dose',
    idadeAlvo: '4 meses',
    dataPrevista: '2026-06-26'
  },
  {
    id: 'luna-meningo-1',
    criancaId: 'luna',
    vacinaId: 'meningococica-c',
    dose: '1ª dose',
    idadeAlvo: '3 meses',
    dataPrevista: '2026-07-28'
  }
];

const CAMPANHAS: CampanhaVacinacao[] = [
  {
    id: 'influenza-2026',
    titulo: 'Campanha Nacional contra Influenza',
    descricao: 'Vacinação anual para reduzir complicações respiratórias em crianças do público-alvo.',
    publico: 'Crianças de 6 meses a menores de 6 anos',
    inicio: '2026-05-01',
    fim: '2026-07-31',
    local: 'Todas as UBS do município',
    vacinaIds: ['influenza'],
    idadeMinimaMeses: 6,
    idadeMaximaMeses: 71,
    destaque: 'Levar documento da criança e carteira de vacinação.'
  },
  {
    id: 'multivacinacao-junho',
    titulo: 'Dia D de Multivacinação',
    descricao: 'Mutirão para atualizar doses atrasadas e orientar famílias com mais de uma criança.',
    publico: 'Crianças até 5 anos',
    inicio: '2026-06-15',
    fim: '2026-06-30',
    local: 'UBS Central e UBS Santa Luzia',
    vacinaIds: ['pentavalente', 'meningococica-c', 'triplice-viral', 'dtp'],
    idadeMinimaMeses: 0,
    idadeMaximaMeses: 60,
    destaque: 'Atendimento estendido no sábado, das 8h às 16h.'
  },
  {
    id: 'sarampo-julho',
    titulo: 'Busca ativa contra Sarampo',
    descricao: 'Ação preventiva para crianças com esquema de tríplice viral incompleto.',
    publico: 'Crianças de 12 meses a 5 anos',
    inicio: '2026-07-01',
    fim: '2026-08-15',
    local: 'Rede municipal de saúde',
    vacinaIds: ['triplice-viral'],
    idadeMinimaMeses: 12,
    idadeMaximaMeses: 60,
    destaque: 'Verificação rápida do histórico antes da aplicação.'
  }
];

@Injectable({
  providedIn: 'root'
})
export class VaccinationDataService {
  private firestore = inject(Firestore);
  private campanhasCollection = collection(this.firestore, 'campanhas');
  
  private readonly hoje = this.semHorario(new Date());
  private readonly vacinasPorId = new Map(VACINAS.map((vacina) => [vacina.id, vacina]));

  readonly campanhas = toSignal(
  collectionData(
    collection(this.firestore, 'campanhas'), 
    { idField: 'id' }
  ) as Observable<CampanhaVacinacao[]>,
  { initialValue: [] }
);

  readonly criancas = signal<Crianca[]>(CRIANCAS);
  readonly vacinas = signal<Vacina[]>(VACINAS);
  readonly registros = signal<RegistroVacinal[]>(REGISTROS);
  readonly criancaSelecionadaId = signal<string>(CRIANCAS[0].id);

  readonly criancaSelecionada = computed(() => {
    const selecionada = this.criancas().find((crianca) => crianca.id === this.criancaSelecionadaId());
    return selecionada ?? this.criancas()[0];
  });

  readonly campanhasAtivas = computed(() => this.campanhas().filter((campanha) => this.campanhaEstaAtiva(campanha)));

  selecionarCrianca(id: string): void {
    this.criancaSelecionadaId.set(id);
  }

  idadeDaCrianca(crianca: Crianca): string {
    const meses = this.idadeEmMeses(crianca.dataNascimento);

    if (meses < 1) {
      return 'recém-nascida';
    }

    if (meses < 12) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }

    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;

    if (mesesRestantes === 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }

    return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
  }

  idadeEmMeses(dataNascimento: string): number {
    const nascimento = this.parseDataLocal(dataNascimento);
    let meses = (this.hoje.getFullYear() - nascimento.getFullYear()) * 12;
    meses += this.hoje.getMonth() - nascimento.getMonth();

    if (this.hoje.getDate() < nascimento.getDate()) {
      meses -= 1;
    }

    return Math.max(meses, 0);
  }

  registrosDaCrianca(criancaId: string): RegistroComVacina[] {
    return this.registros()
      .filter((registro) => registro.criancaId === criancaId)
      .map((registro) => this.comVacinaEStatus(registro))
      .sort((a, b) => {
        if (a.status === 'atrasada' && b.status !== 'atrasada') {
          return -1;
        }

        if (a.status !== 'atrasada' && b.status === 'atrasada') {
          return 1;
        }

        return this.parseDataLocal(a.dataPrevista).getTime() - this.parseDataLocal(b.dataPrevista).getTime();
      });
  }

  resumoDaCrianca(criancaId: string): ResumoVacinal {
    const registros = this.registrosDaCrianca(criancaId);
    const aplicadas = registros.filter((registro) => registro.status === 'aplicada').length;
    const atrasadas = registros.filter((registro) => registro.status === 'atrasada').length;
    const atencao = registros.filter((registro) => registro.status === 'atencao').length;
    const programadas = registros.filter((registro) => registro.status === 'programada').length;
    const percentual = registros.length === 0 ? 0 : Math.round((aplicadas / registros.length) * 100);

    return {
      total: registros.length,
      aplicadas,
      atrasadas,
      atencao,
      programadas,
      percentual
    };
  }

  campanhasParaCrianca(crianca: Crianca): CampanhaVacinacao[] {
    const idadeMeses = this.idadeEmMeses(crianca.dataNascimento);

    return this.campanhasAtivas().filter(
      (campanha) => idadeMeses >= campanha.idadeMinimaMeses && idadeMeses <= campanha.idadeMaximaMeses
    );
  }

  nomesCriancasElegiveis(campanha: CampanhaVacinacao): string[] {
    return this.criancas()
      .filter((crianca) => {
        const idadeMeses = this.idadeEmMeses(crianca.dataNascimento);
        return idadeMeses >= campanha.idadeMinimaMeses && idadeMeses <= campanha.idadeMaximaMeses;
      })
      .map((crianca) => crianca.apelido);
  }

  campanhaEstaAtiva(campanha: CampanhaVacinacao): boolean {
    const inicio = this.parseDataLocal(campanha.inicio);
    const fim = this.parseDataLocal(campanha.fim);
    return inicio.getTime() <= this.hoje.getTime() && fim.getTime() >= this.hoje.getTime();
  }

  diasAte(dataIso: string): number {
    const data = this.parseDataLocal(dataIso);
    return Math.ceil((data.getTime() - this.hoje.getTime()) / DIA_EM_MS);
  }

  dataReferencia(): Date {
    return new Date(this.hoje);
  }

  private comVacinaEStatus(registro: RegistroVacinal): RegistroComVacina {
    const vacina = this.vacinasPorId.get(registro.vacinaId);

    if (!vacina) {
      throw new Error(`Vacina não encontrada: ${registro.vacinaId}`);
    }

    const diasParaVencer = this.diasAte(registro.dataPrevista);

    return {
      ...registro,
      vacina,
      diasParaVencer,
      status: this.statusDoRegistro(registro, diasParaVencer)
    };
  }

  private statusDoRegistro(registro: RegistroVacinal, diasParaVencer: number): StatusVacinal {
    if (registro.dataAplicacao) {
      return 'aplicada';
    }

    if (diasParaVencer < 0) {
      return 'atrasada';
    }

    if (diasParaVencer <= 30) {
      return 'atencao';
    }

    return 'programada';
  }

  private parseDataLocal(dataIso: string): Date {
    const [ano = '0', mes = '1', dia = '1'] = dataIso.split('-');
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  private semHorario(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
}
