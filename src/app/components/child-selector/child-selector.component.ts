import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import { Crianca } from '../../core/vaccination.models';
import { VaccinationDataService } from '../../core/vaccination-data.service';

@Component({
  selector: 'app-child-selector',
  standalone: true,
  imports: [IonIcon],
  template: `
    <section class="child-panel surface" aria-label="Crianças acompanhadas">
      <div class="panel-heading">
        <p class="eyebrow">Família</p>
        <h2>Crianças</h2>
      </div>

      <div class="child-list">
        @for (crianca of criancas; track crianca.id) {
          <button
            type="button"
            class="child-card"
            [class.selected]="crianca.id === selectedId"
            (click)="selected.emit(crianca.id)"
          >
            <span class="avatar" [style.background]="crianca.cor">{{ crianca.avatar }}</span>
            <span class="child-copy">
              <strong>{{ crianca.nome }}</strong>
              <small>{{ idade(crianca) }} · {{ crianca.unidadePreferida }}</small>
            </span>
            <span class="status-dot" [class.needs-care]="temPendencia(crianca)">
              <ion-icon [name]="temPendencia(crianca) ? 'alert-circle-outline' : 'checkmark-circle-outline'" />
            </span>
          </button>
        }
      </div>
    </section>
  `,
  styles: `
    .child-panel {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }

    .panel-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
    }

    h2 {
      margin: 0.1rem 0 0;
      font-size: 1.15rem;
    }

    .child-list {
      display: grid;
      gap: 0.6rem;
    }

    .child-card {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: center;
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(71, 60, 51, 0.1);
      border-radius: 8px;
      color: #473c33;
      background: rgba(255, 255, 255, 0.78);
      text-align: left;
      cursor: pointer;
      transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }

    .child-card:hover,
    .child-card:focus-visible {
      border-color: rgba(71, 60, 51, 0.28);
      box-shadow: 0 10px 24px rgba(71, 60, 51, 0.08);
      transform: translateY(-1px);
      outline: none;
    }

    .child-card.selected {
      border-color: #473c33;
      background: #fff7e3;
    }

    .avatar {
      display: grid;
      width: 2.6rem;
      height: 2.6rem;
      place-items: center;
      border-radius: 8px;
      color: #473c33;
      font-weight: 900;
    }

    .child-copy {
      display: grid;
      min-width: 0;
      gap: 0.15rem;
    }

    strong,
    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: rgba(71, 60, 51, 0.64);
    }

    .status-dot {
      display: grid;
      width: 2rem;
      height: 2rem;
      place-items: center;
      border-radius: 999px;
      color: #32401f;
      background: rgba(171, 194, 112, 0.28);
    }

    .status-dot.needs-care {
      color: #473c33;
      background: rgba(253, 167, 105, 0.34);
    }

    ion-icon {
      font-size: 1.15rem;
    }

    @media (max-width: 920px) {
      .child-list {
        grid-template-columns: repeat(3, minmax(13rem, 1fr));
        overflow-x: auto;
        padding-bottom: 0.1rem;
        scroll-snap-type: x proximity;
      }

      .child-card {
        scroll-snap-align: start;
      }
    }

    @media (max-width: 620px) {
      .child-list {
        grid-template-columns: 1fr;
        overflow: visible;
      }
    }
  `
})
export class ChildSelectorComponent {
  private readonly vacinacao = inject(VaccinationDataService);

  @Input({ required: true }) criancas: Crianca[] = [];
  @Input({ required: true }) selectedId = '';
  @Output() readonly selected = new EventEmitter<string>();

  idade(crianca: Crianca): string {
    return this.vacinacao.idadeDaCrianca(crianca);
  }

  temPendencia(crianca: Crianca): boolean {
    return this.vacinacao.resumoDaCrianca(crianca.id).atrasadas > 0;
  }
}
