import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component';
import { VaccinationDataService } from '../../core/vaccination-data.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [DatePipe, RouterLink, CampaignCardComponent, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Campanhas</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/dashboard" fill="clear">
            <ion-icon name="home-outline" slot="start" />
            Painel
          </ion-button>
          <ion-button routerLink="/vacinas" fill="clear">
            <ion-icon name="medkit-outline" slot="start" />
            Vacinas
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell campaigns-page">
        <section class="page-heading">
          <div>
            <p class="eyebrow">Ações públicas</p>
            <h1>Campanhas de vacinação</h1>
            <p>Hoje: {{ dataReferencia | date: 'dd/MM/yyyy' }} · {{ campanhasAtivas().length }} campanha ativa</p>
          </div>
          <div class="legend surface">
            <span><i class="active"></i> Ativa</span>
            <span><i></i> Programada</span>
          </div>
        </section>

        <section class="campaign-grid" aria-label="Lista de campanhas">
          @for (campanha of campanhasOrdenadas(); track campanha.id) {
            <app-campaign-card [campanha]="campanha" />
          }
        </section>
      </main>
    </ion-content>
  `,
  styles: `
    ion-title {
      color: #473c33;
      font-weight: 900;
    }

    .campaigns-page {
      display: grid;
      gap: 1rem;
    }

    .page-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: end;
      padding: 1.2rem 0 0.4rem;
    }

    h1,
    p {
      margin: 0;
    }

    h1 {
      margin-top: 0.25rem;
      font-size: clamp(1.9rem, 4vw, 3.1rem);
      line-height: 1.08;
    }

    .page-heading p:not(.eyebrow) {
      margin-top: 0.55rem;
      color: rgba(71, 60, 51, 0.7);
    }

    .legend {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      padding: 0.75rem;
      color: rgba(71, 60, 51, 0.72);
      font-weight: 700;
    }

    .legend span {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
      white-space: nowrap;
    }

    .legend i {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 999px;
      background: #fec868;
    }

    .legend i.active {
      background: #abc270;
    }

    .campaign-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    @media (max-width: 780px) {
      .page-heading,
      .campaign-grid {
        grid-template-columns: 1fr;
      }

      .legend {
        justify-content: start;
      }
    }

    @media (max-width: 560px) {
      ion-button {
        --padding-start: 0.65rem;
        --padding-end: 0.65rem;
      }
    }
  `
})
export class CampaignsPage {
  private readonly vacinacao = inject(VaccinationDataService);

  readonly dataReferencia = this.vacinacao.dataReferencia();
  readonly campanhasAtivas = this.vacinacao.campanhasAtivas;
  readonly campanhasOrdenadas = computed(() =>
    [...this.vacinacao.campanhas()].sort((a, b) => {
      const ativaA = this.vacinacao.campanhaEstaAtiva(a) ? 0 : 1;
      const ativaB = this.vacinacao.campanhaEstaAtiva(b) ? 0 : 1;
      return ativaA - ativaB || a.inicio.localeCompare(b.inicio);
    })
  );
}
