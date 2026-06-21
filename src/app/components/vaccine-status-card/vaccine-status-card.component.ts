import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonBadge, IonIcon } from '@ionic/angular/standalone';

import { RegistroComVacina, STATUS_LABEL, StatusVacinal } from '../../core/vaccination.models';

@Component({
  selector: 'app-vaccine-status-card',
  standalone: true,
  imports: [DatePipe, IonBadge, IonIcon],
  template: `
    <article class="vaccine-card" [class]="registro.status">
      <div class="status-icon">
        <ion-icon [name]="iconeStatus(registro.status)" />
      </div>

      <div class="vaccine-content">
        <div class="vaccine-heading">
          <div>
            <h3>{{ registro.vacina.nome }}</h3>
            <p>{{ registro.dose }} · {{ registro.idadeAlvo }}</p>
          </div>
          <ion-badge>{{ labelStatus(registro.status) }}</ion-badge>
        </div>

        <p class="description">{{ registro.vacina.previne }}</p>

        <div class="dates">
          <span>
            <strong>Prevista</strong>
            {{ registro.dataPrevista | date: 'dd/MM/yyyy' }}
          </span>

          @if (registro.dataAplicacao) {
            <span>
              <strong>Aplicada</strong>
              {{ registro.dataAplicacao | date: 'dd/MM/yyyy' }}
            </span>
          } @else {
            <span>
              <strong>Prazo</strong>
              {{ prazoTexto }}
            </span>
          }
        </div>

        @if (registro.observacao) {
          <p class="note">{{ registro.observacao }}</p>
        }
      </div>
    </article>
  `,
  styles: `
    .vaccine-card {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.85rem;
      padding: 0.95rem;
      border: 1px solid rgba(71, 60, 51, 0.1);
      border-left-width: 0.35rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.82);
    }

    .vaccine-card.aplicada {
      border-left-color: #abc270;
    }

    .vaccine-card.atrasada {
      border-left-color: #fda769;
      background: #fff2e7;
    }

    .vaccine-card.atencao {
      border-left-color: #fec868;
    }

    .vaccine-card.programada {
      border-left-color: rgba(71, 60, 51, 0.22);
    }

    .status-icon {
      display: grid;
      width: 2.4rem;
      height: 2.4rem;
      place-items: center;
      border-radius: 8px;
      color: #473c33;
      background: rgba(171, 194, 112, 0.22);
    }

    .atrasada .status-icon {
      background: rgba(253, 167, 105, 0.35);
    }

    .atencao .status-icon {
      background: rgba(254, 200, 104, 0.38);
    }

    .programada .status-icon {
      background: rgba(71, 60, 51, 0.09);
    }

    ion-icon {
      font-size: 1.25rem;
    }

    .vaccine-content {
      display: grid;
      min-width: 0;
      gap: 0.7rem;
    }

    .vaccine-heading {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    h3,
    p {
      margin: 0;
    }

    h3 {
      font-size: 1rem;
      line-height: 1.25;
    }

    .vaccine-heading p,
    .description,
    .note {
      color: rgba(71, 60, 51, 0.68);
      line-height: 1.42;
    }

    ion-badge {
      --background: rgba(71, 60, 51, 0.1);
      --color: #473c33;
      flex: 0 0 auto;
      border-radius: 999px;
      padding: 0.42rem 0.55rem;
    }

    .aplicada ion-badge {
      --background: #abc270;
    }

    .atrasada ion-badge {
      --background: #fda769;
    }

    .atencao ion-badge {
      --background: #fec868;
    }

    .dates {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.55rem;
    }

    .dates span {
      display: grid;
      gap: 0.15rem;
      padding: 0.6rem;
      border-radius: 8px;
      background: rgba(71, 60, 51, 0.05);
      color: #473c33;
      line-height: 1.3;
    }

    .dates strong {
      color: rgba(71, 60, 51, 0.62);
      font-size: 0.72rem;
      text-transform: uppercase;
    }

    .note {
      padding: 0.6rem 0.7rem;
      border-radius: 8px;
      background: rgba(254, 200, 104, 0.24);
    }

    @media (max-width: 560px) {
      .vaccine-card,
      .vaccine-heading {
        grid-template-columns: 1fr;
      }

      .vaccine-heading {
        display: grid;
      }

      .dates {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class VaccineStatusCardComponent {
  @Input({ required: true }) registro!: RegistroComVacina;

  get prazoTexto(): string {
    if (this.registro.diasParaVencer < 0) {
      const dias = Math.abs(this.registro.diasParaVencer);
      return `${dias} ${dias === 1 ? 'dia' : 'dias'} em atraso`;
    }

    if (this.registro.diasParaVencer === 0) {
      return 'vence hoje';
    }

    return `em ${this.registro.diasParaVencer} ${this.registro.diasParaVencer === 1 ? 'dia' : 'dias'}`;
  }

  labelStatus(status: StatusVacinal): string {
    return STATUS_LABEL[status];
  }

  iconeStatus(status: StatusVacinal): string {
    const icones: Record<StatusVacinal, string> = {
      aplicada: 'checkmark-circle-outline',
      atrasada: 'alert-circle-outline',
      atencao: 'time-outline',
      programada: 'calendar-clear-outline'
    };

    return icones[status];
  }
}
