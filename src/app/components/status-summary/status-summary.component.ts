import { Component, Input } from '@angular/core';
import { IonIcon, IonProgressBar } from '@ionic/angular/standalone';

import { Crianca, ResumoVacinal } from '../../core/vaccination.models';

@Component({
  selector: 'app-status-summary',
  standalone: true,
  imports: [IonIcon, IonProgressBar],
  template: `
    <article class="summary-card">
      <div class="summary-main">
        <span class="summary-icon" [class.warning]="resumo.atrasadas > 0">
          <ion-icon [name]="resumo.atrasadas > 0 ? 'alert-circle-outline' : 'shield-checkmark-outline'" />
        </span>
        <div>
          <p class="eyebrow">Situação de {{ crianca.apelido }}</p>
          <h2>{{ tituloSituacao }}</h2>
          <p>{{ mensagemSituacao }}</p>
        </div>
      </div>

      <div class="progress-area">
        <div>
          <strong>{{ resumo.percentual }}%</strong>
          <span>do calendário acompanhado está registrado</span>
        </div>
        <ion-progress-bar [value]="resumo.percentual / 100" />
      </div>

      <dl class="metrics">
        <div>
          <dt>Aplicadas</dt>
          <dd>{{ resumo.aplicadas }}</dd>
        </div>
        <div>
          <dt>Atrasadas</dt>
          <dd>{{ resumo.atrasadas }}</dd>
        </div>
        <div>
          <dt>Atenção</dt>
          <dd>{{ resumo.atencao }}</dd>
        </div>
      </dl>
    </article>
  `,
  styles: `
    .summary-card {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid rgba(71, 60, 51, 0.12);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(171, 194, 112, 0.26), rgba(254, 200, 104, 0.2)), #ffffff;
    }

    .summary-main {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.85rem;
      align-items: start;
    }

    .summary-icon {
      display: grid;
      width: 2.65rem;
      height: 2.65rem;
      place-items: center;
      border-radius: 8px;
      color: #32401f;
      background: #abc270;
    }

    .summary-icon.warning {
      color: #473c33;
      background: #fda769;
    }

    ion-icon {
      font-size: 1.45rem;
    }

    h2 {
      margin: 0.15rem 0 0.35rem;
      font-size: clamp(1.35rem, 2vw, 1.9rem);
      line-height: 1.1;
    }

    p {
      margin: 0;
      color: rgba(71, 60, 51, 0.72);
      line-height: 1.45;
    }

    .progress-area {
      display: grid;
      gap: 0.55rem;
      padding: 0.8rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.72);
    }

    .progress-area div {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
    }

    strong {
      font-size: 1.45rem;
      color: #473c33;
    }

    .progress-area span {
      color: rgba(71, 60, 51, 0.68);
      font-size: 0.9rem;
      text-align: right;
    }

    ion-progress-bar {
      height: 0.55rem;
      border-radius: 999px;
      overflow: hidden;
      --progress-background: #abc270;
      --background: rgba(71, 60, 51, 0.1);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.55rem;
      margin: 0;
    }

    .metrics div {
      padding: 0.7rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.72);
    }

    dt {
      color: rgba(71, 60, 51, 0.66);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    dd {
      margin: 0.2rem 0 0;
      font-size: 1.35rem;
      font-weight: 900;
    }

    @media (max-width: 560px) {
      .summary-main {
        grid-template-columns: 1fr;
      }

      .progress-area div {
        display: grid;
      }

      .progress-area span {
        text-align: left;
      }
    }
  `
})
export class StatusSummaryComponent {
  @Input({ required: true }) crianca!: Crianca;
  @Input({ required: true }) resumo!: ResumoVacinal;

  get tituloSituacao(): string {
    if (this.resumo.atrasadas > 0) {
      return `${this.resumo.atrasadas} pendência${this.resumo.atrasadas > 1 ? 's' : ''} para resolver`;
    }

    if (this.resumo.atencao > 0) {
      return `${this.resumo.atencao} vacina${this.resumo.atencao > 1 ? 's' : ''} chegando`;
    }

    return 'Calendário em dia';
  }

  get mensagemSituacao(): string {
    if (this.resumo.atrasadas > 0) {
      return 'Há dose com data prevista ultrapassada. Priorize o agendamento na unidade de referência.';
    }

    if (this.resumo.atencao > 0) {
      return 'Existem doses previstas para os próximos dias. Vale se organizar antes do vencimento.';
    }

    return 'Não há atrasos no recorte acompanhado para esta criança.';
  }
}
