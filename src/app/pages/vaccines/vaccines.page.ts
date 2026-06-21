import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { VaccinationDataService } from '../../core/vaccination-data.service';

@Component({
  selector: 'app-vaccines',
  standalone: true,
  imports: [RouterLink, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonSearchbar, IonTitle, IonToolbar],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Vacinas</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/dashboard" fill="clear">
            <ion-icon name="home-outline" slot="start" />
            Painel
          </ion-button>
          <ion-button routerLink="/campanhas" fill="clear">
            <ion-icon name="megaphone-outline" slot="start" />
            Campanhas
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell vaccines-page">
        <section class="page-heading">
          <div>
            <p class="eyebrow">Calendário infantil</p>
            <h1>Informações relacionadas às vacinas</h1>
          </div>
          <ion-searchbar
            placeholder="Buscar vacina"
            [value]="busca()"
            (ionInput)="atualizarBusca($any($event).detail.value)"
            show-clear-button="focus"
          />
        </section>

        <section class="catalog-grid" aria-label="Catálogo de vacinas">
          @for (vacina of vacinasFiltradas(); track vacina.id) {
            <article class="vaccine-info surface">
              <div class="card-top">
                <span>
                  <ion-icon name="medkit-outline" />
                </span>
                <div>
                  <p class="eyebrow">{{ vacina.faixaIndicada }}</p>
                  <h2>{{ vacina.nome }}</h2>
                </div>
              </div>
              <p>{{ vacina.descricao }}</p>
              <dl>
                <div>
                  <dt>Previne</dt>
                  <dd>{{ vacina.previne }}</dd>
                </div>
                <div>
                  <dt>Doses</dt>
                  <dd>{{ vacina.doses.join(' · ') }}</dd>
                </div>
              </dl>
            </article>
          } @empty {
            <p class="empty-state surface">Nenhuma vacina encontrada para a busca informada.</p>
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

    .vaccines-page {
      display: grid;
      gap: 1rem;
    }

    .page-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(16rem, 28rem);
      gap: 1rem;
      align-items: end;
      padding: 1.2rem 0 0.4rem;
    }

    h1,
    h2,
    p,
    dl {
      margin: 0;
    }

    h1 {
      margin-top: 0.25rem;
      font-size: clamp(1.8rem, 4vw, 3rem);
      line-height: 1.08;
    }

    ion-searchbar {
      --background: rgba(255, 255, 255, 0.82);
      --border-radius: 8px;
      --box-shadow: none;
      padding: 0;
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .vaccine-info {
      display: grid;
      gap: 0.9rem;
      padding: 1rem;
    }

    .card-top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.75rem;
      align-items: start;
    }

    .card-top span {
      display: grid;
      width: 2.5rem;
      height: 2.5rem;
      place-items: center;
      border-radius: 8px;
      background: #abc270;
      color: #473c33;
    }

    ion-icon {
      font-size: 1.25rem;
    }

    h2 {
      margin-top: 0.1rem;
      font-size: 1.1rem;
      line-height: 1.25;
    }

    .vaccine-info > p {
      color: rgba(71, 60, 51, 0.7);
      line-height: 1.45;
    }

    dl {
      display: grid;
      gap: 0.55rem;
    }

    dl div {
      display: grid;
      gap: 0.16rem;
      padding: 0.65rem;
      border-radius: 8px;
      background: rgba(254, 200, 104, 0.18);
    }

    dt {
      color: rgba(71, 60, 51, 0.62);
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      line-height: 1.4;
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: 1rem;
      color: rgba(71, 60, 51, 0.68);
    }

    @media (max-width: 980px) {
      .catalog-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 680px) {
      .page-heading,
      .catalog-grid {
        grid-template-columns: 1fr;
      }

      ion-button {
        --padding-start: 0.65rem;
        --padding-end: 0.65rem;
      }
    }
  `
})
export class VaccinesPage {
  private readonly vacinacao = inject(VaccinationDataService);

  readonly busca = signal('');
  readonly vacinas = this.vacinacao.vacinas;
  readonly vacinasFiltradas = computed(() => {
    const termo = this.busca().trim().toLocaleLowerCase('pt-BR');

    if (!termo) {
      return this.vacinas();
    }

    return this.vacinas().filter((vacina) =>
      [vacina.nome, vacina.previne, vacina.faixaIndicada].some((texto) =>
        texto.toLocaleLowerCase('pt-BR').includes(termo)
      )
    );
  });

  atualizarBusca(valor: string | null | undefined): void {
    this.busca.set(valor ?? '');
  }
}
