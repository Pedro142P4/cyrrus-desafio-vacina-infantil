import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IonBadge, IonIcon } from '@ionic/angular/standalone';

import { CampanhaVacinacao } from '../../core/vaccination.models';
import { VaccinationDataService } from '../../core/vaccination-data.service';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [DatePipe, IonBadge, IonIcon],
  template: `
    <article class="campaign-card" [class.active]="ativa">
      <div class="campaign-top">
        <span class="campaign-icon">
          <ion-icon name="megaphone-outline" />
        </span>
        <div>
          <p class="eyebrow">{{ ativa ? 'Campanha ativa' : 'Campanha programada' }}</p>
          <h3>{{ campanha.titulo }}</h3>
        </div>
        <ion-badge>{{ campanha.publico }}</ion-badge>
      </div>

      <p>{{ campanha.descricao }}</p>

      <dl>
        <div>
          <dt>Período</dt>
          <dd>{{ campanha.inicio | date: 'dd/MM' }} a {{ campanha.fim | date: 'dd/MM/yyyy' }}</dd>
        </div>
        <div>
          <dt>Local</dt>
          <dd>{{ campanha.local }}</dd>
        </div>
      </dl>

      <div class="campaign-footer">
        <span>{{ campanha.destaque }}</span>
        @if (elegiveis.length > 0) {
          <strong>{{ elegiveis.join(', ') }}</strong>
        }
      </div>
    </article>
  `,
  styles: `
    .campaign-card {
      display: grid;
      gap: 0.85rem;
      padding: 1rem;
      border: 1px solid rgba(71, 60, 51, 0.12);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
    }

    .campaign-card.active {
      background: linear-gradient(135deg, rgba(254, 200, 104, 0.34), rgba(171, 194, 112, 0.18)), #ffffff;
    }

    .campaign-top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: start;
    }

    .campaign-icon {
      display: grid;
      width: 2.4rem;
      height: 2.4rem;
      place-items: center;
      border-radius: 8px;
      background: #fec868;
      color: #473c33;
    }

    ion-icon {
      font-size: 1.25rem;
    }

    h3,
    p,
    dl {
      margin: 0;
    }

    h3 {
      font-size: 1rem;
      line-height: 1.25;
    }

    p {
      color: rgba(71, 60, 51, 0.7);
      line-height: 1.45;
    }

    ion-badge {
      --background: rgba(71, 60, 51, 0.1);
      --color: #473c33;
      max-width: 12rem;
      white-space: normal;
      text-align: left;
      line-height: 1.25;
      border-radius: 8px;
      padding: 0.45rem 0.55rem;
    }

    dl {
      display: grid;
      gap: 0.45rem;
    }

    dl div {
      display: grid;
      grid-template-columns: 4.3rem minmax(0, 1fr);
      gap: 0.45rem;
      align-items: baseline;
      padding: 0.55rem;
      border-radius: 8px;
      background: rgba(71, 60, 51, 0.05);
    }

    dt {
      color: rgba(71, 60, 51, 0.62);
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      line-height: 1.35;
    }

    .campaign-footer {
      display: grid;
      gap: 0.45rem;
      padding-top: 0.2rem;
      color: rgba(71, 60, 51, 0.72);
      line-height: 1.4;
    }

    .campaign-footer strong {
      color: #473c33;
    }

    @media (max-width: 560px) {
      .campaign-top {
        grid-template-columns: auto minmax(0, 1fr);
      }

      ion-badge {
        grid-column: 1 / -1;
        max-width: none;
      }
    }
  `
})
export class CampaignCardComponent {
  private readonly vacinacao = inject(VaccinationDataService);

  @Input({ required: true }) campanha!: CampanhaVacinacao;

  get ativa(): boolean {
    return this.vacinacao.campanhaEstaAtiva(this.campanha);
  }

  get elegiveis(): string[] {
    return this.vacinacao.nomesCriancasElegiveis(this.campanha);
  }
}
