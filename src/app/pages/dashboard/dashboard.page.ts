import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component';
import { ChildSelectorComponent } from '../../components/child-selector/child-selector.component';
import { StatusSummaryComponent } from '../../components/status-summary/status-summary.component';
import { VaccineStatusCardComponent } from '../../components/vaccine-status-card/vaccine-status-card.component';
import { RegistroComVacina, StatusVacinal } from '../../core/vaccination.models';
import { VaccinationDataService } from '../../core/vaccination-data.service';

type FiltroHistorico = 'todas' | 'pendentes' | 'aplicadas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    CampaignCardComponent,
    ChildSelectorComponent,
    StatusSummaryComponent,
    VaccineStatusCardComponent,
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Crescer em Dia</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/dashboard" fill="clear" aria-label="Painel">
            <ion-icon name="home-outline" slot="start" />
            <span class="nav-label">Painel</span>
          </ion-button>
          <ion-button routerLink="/vacinas" fill="clear" aria-label="Vacinas">
            <ion-icon name="medkit-outline" slot="start" />
            <span class="nav-label">Vacinas</span>
          </ion-button>
          <ion-button routerLink="/campanhas" fill="solid" aria-label="Campanhas">
            <ion-icon name="megaphone-outline" slot="start" />
            <span class="nav-label">Campanhas</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell">
        <section class="family-overview">
          <div>
            <p class="eyebrow">Painel familiar</p>
            <h1>Jornada vacinal infantil</h1>
            <p class="overview-copy">
              {{ criancas().length }} crianças acompanhadas · atualizado em
              {{ dataReferencia | date: 'dd/MM/yyyy' }}
            </p>
          </div>

          <div class="family-metrics" aria-label="Resumo familiar">
            <div>
              <strong>{{ totalAplicadas() }}</strong>
              <span>aplicadas</span>
            </div>
            <div class="attention">
              <strong>{{ totalAtrasadas() }}</strong>
              <span>atrasadas</span>
            </div>
            <div>
              <strong>{{ campanhasAtivas().length }}</strong>
              <span>campanhas</span>
            </div>
          </div>
        </section>

        <section class="dashboard-grid">
          <app-child-selector
            [criancas]="criancas()"
            [selectedId]="criancaSelecionada().id"
            (selected)="selecionarCrianca($event)"
          />

          <section class="detail-column">
            <div class="child-header surface">
              <span class="avatar-large" [style.background]="criancaSelecionada().cor">
                {{ criancaSelecionada().avatar }}
              </span>
              <div>
                <p class="eyebrow">{{ idadeSelecionada() }}</p>
                <h2>{{ criancaSelecionada().nome }}</h2>
                <p>{{ criancaSelecionada().escola }} · {{ criancaSelecionada().unidadePreferida }}</p>
              </div>
            </div>

            <app-status-summary [crianca]="criancaSelecionada()" [resumo]="resumoSelecionado()" />

            @if (registrosAtrasados().length > 0) {
              <aside class="urgent-strip">
                <ion-icon name="alert-circle-outline" />
                <div>
                  <strong>Prioridade de cuidado</strong>
                  <span>
                    {{ criancaSelecionada().apelido }} tem {{ registrosAtrasados().length }}
                    {{ registrosAtrasados().length === 1 ? 'dose atrasada' : 'doses atrasadas' }}.
                  </span>
                </div>
              </aside>
            }

            <section class="history surface">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Histórico vacinal</p>
                  <h2>Doses acompanhadas</h2>
                </div>

                <ion-segment [value]="filtro()" (ionChange)="alterarFiltro($any($event).detail.value)">
                  <ion-segment-button value="todas">
                    <ion-label>Todas</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="pendentes">
                    <ion-label>Pendentes</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="aplicadas">
                    <ion-label>Aplicadas</ion-label>
                  </ion-segment-button>
                </ion-segment>
              </div>

              <div class="vaccine-list">
                @for (registro of registrosFiltrados(); track registro.id) {
                  <app-vaccine-status-card [registro]="registro" />
                }
              </div>
            </section>
          </section>

          <aside class="side-column">
            <section class="surface child-notes">
              <p class="eyebrow">Dados rápidos</p>
              <dl>
                <div>
                  <dt>Responsável</dt>
                  <dd>{{ criancaSelecionada().responsavel }}</dd>
                </div>
                <div>
                  <dt>Observação</dt>
                  <dd>{{ criancaSelecionada().observacoes }}</dd>
                </div>
              </dl>
            </section>

            <section class="surface next-actions">
              <div class="section-heading compact">
                <div>
                  <p class="eyebrow">Próximos passos</p>
                  <h2>Atenção agora</h2>
                </div>
              </div>

              @for (registro of proximasPendencias(); track registro.id) {
                <ion-chip [class.overdue]="registro.status === 'atrasada'">
                  <ion-icon [name]="registro.status === 'atrasada' ? 'alert-circle-outline' : 'time-outline'" />
                  <ion-label>{{ registro.vacina.nome }} · {{ registro.dose }}</ion-label>
                </ion-chip>
              } @empty {
                <p class="empty-state">Nenhuma pendência no momento.</p>
              }
            </section>

            <section class="campaign-stack">
              <div class="section-heading compact">
                <div>
                  <p class="eyebrow">Campanhas</p>
                  <h2>Para {{ criancaSelecionada().apelido }}</h2>
                </div>
                <ion-button routerLink="/campanhas" fill="clear" size="small">
                  Ver todas
                  <ion-icon name="chevron-forward-outline" slot="end" />
                </ion-button>
              </div>

              @for (campanha of campanhasDaCrianca(); track campanha.id) {
                <app-campaign-card [campanha]="campanha" />
              } @empty {
                <p class="empty-state surface">Nenhuma campanha ativa para a faixa etária selecionada.</p>
              }
            </section>
          </aside>
        </section>
      </main>
    </ion-content>
  `,
  styles: `
    ion-title {
      color: #473c33;
      font-weight: 900;
    }

    .family-overview {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: end;
      padding: 1.2rem 0 1.4rem;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      margin-top: 0.25rem;
      font-size: clamp(2rem, 5vw, 3.4rem);
      line-height: 1.02;
      color: #473c33;
    }

    .overview-copy {
      margin-top: 0.55rem;
      color: rgba(71, 60, 51, 0.7);
      line-height: 1.45;
    }

    .family-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(6rem, 1fr));
      gap: 0.55rem;
      min-width: 22rem;
    }

    .family-metrics div {
      display: grid;
      gap: 0.15rem;
      padding: 0.8rem;
      border: 1px solid rgba(71, 60, 51, 0.1);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.74);
    }

    .family-metrics .attention {
      background: rgba(253, 167, 105, 0.24);
    }

    .family-metrics strong {
      font-size: 1.5rem;
      line-height: 1;
    }

    .family-metrics span {
      color: rgba(71, 60, 51, 0.66);
      font-size: 0.85rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 20rem minmax(0, 1fr) 21rem;
      gap: 1rem;
      align-items: start;
    }

    .detail-column,
    .side-column,
    .campaign-stack {
      display: grid;
      gap: 1rem;
    }

    .child-header {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.9rem;
      align-items: center;
      padding: 1rem;
    }

    .avatar-large {
      display: grid;
      width: 4rem;
      height: 4rem;
      place-items: center;
      border-radius: 8px;
      color: #473c33;
      font-size: 1.25rem;
      font-weight: 900;
    }

    .child-header h2,
    .section-heading h2 {
      margin-top: 0.12rem;
      font-size: 1.3rem;
    }

    .child-header p:last-child {
      margin-top: 0.25rem;
      color: rgba(71, 60, 51, 0.66);
      line-height: 1.4;
    }

    .urgent-strip {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.75rem;
      align-items: center;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      color: #473c33;
      background: #fda769;
      box-shadow: 0 14px 28px rgba(253, 167, 105, 0.22);
    }

    .urgent-strip ion-icon {
      font-size: 1.45rem;
    }

    .urgent-strip div {
      display: grid;
      gap: 0.15rem;
    }

    .history,
    .child-notes,
    .next-actions {
      padding: 1rem;
    }

    .section-heading {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .section-heading.compact {
      margin-bottom: 0.75rem;
    }

    ion-segment {
      width: min(100%, 24rem);
    }

    .vaccine-list {
      display: grid;
      gap: 0.75rem;
    }

    .child-notes dl {
      display: grid;
      gap: 0.7rem;
      margin: 0.7rem 0 0;
    }

    .child-notes div {
      display: grid;
      gap: 0.15rem;
    }

    .child-notes dt {
      color: rgba(71, 60, 51, 0.62);
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    .child-notes dd {
      margin: 0;
      line-height: 1.4;
    }

    .next-actions {
      display: grid;
      gap: 0.55rem;
    }

    ion-chip {
      width: 100%;
      min-height: 2.45rem;
      justify-content: flex-start;
      border-radius: 8px;
      --background: rgba(254, 200, 104, 0.24);
      --color: #473c33;
    }

    ion-chip.overdue {
      --background: rgba(253, 167, 105, 0.34);
    }

    .empty-state {
      margin: 0;
      color: rgba(71, 60, 51, 0.66);
      line-height: 1.45;
    }

    .campaign-stack .empty-state {
      padding: 1rem;
    }

    @media (max-width: 1120px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .side-column {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .campaign-stack {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 780px) {
      .nav-label {
        display: none;
      }

      .family-overview {
        grid-template-columns: 1fr;
      }

      .family-metrics,
      .side-column {
        grid-template-columns: 1fr;
        min-width: 0;
      }

      .section-heading {
        display: grid;
      }

      ion-segment {
        width: 100%;
      }
    }

    @media (max-width: 520px) {
      ion-button {
        --padding-start: 0.65rem;
        --padding-end: 0.65rem;
      }

      .family-metrics {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .family-metrics div {
        padding: 0.65rem;
      }

      .child-header {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class DashboardPage {
  private readonly vacinacao = inject(VaccinationDataService);

  readonly filtro = signal<FiltroHistorico>('todas');
  readonly criancas = this.vacinacao.criancas;
  readonly campanhasAtivas = this.vacinacao.campanhasAtivas;
  readonly criancaSelecionada = this.vacinacao.criancaSelecionada;
  readonly dataReferencia = this.vacinacao.dataReferencia();

  readonly resumoSelecionado = computed(() => this.vacinacao.resumoDaCrianca(this.criancaSelecionada().id));
  readonly idadeSelecionada = computed(() => this.vacinacao.idadeDaCrianca(this.criancaSelecionada()));
  readonly campanhasDaCrianca = computed(() => this.vacinacao.campanhasParaCrianca(this.criancaSelecionada()));
  readonly registros = computed(() => this.vacinacao.registrosDaCrianca(this.criancaSelecionada().id));
  readonly registrosAtrasados = computed(() => this.registros().filter((registro) => registro.status === 'atrasada'));
  readonly proximasPendencias = computed(() =>
    this.registros()
      .filter((registro) => registro.status === 'atrasada' || registro.status === 'atencao')
      .slice(0, 4)
  );
  readonly registrosFiltrados = computed(() => this.filtrarRegistros(this.registros(), this.filtro()));
  readonly totalAtrasadas = computed(() =>
    this.criancas().reduce((total, crianca) => total + this.vacinacao.resumoDaCrianca(crianca.id).atrasadas, 0)
  );
  readonly totalAplicadas = computed(() =>
    this.criancas().reduce((total, crianca) => total + this.vacinacao.resumoDaCrianca(crianca.id).aplicadas, 0)
  );

  selecionarCrianca(id: string): void {
    this.vacinacao.selecionarCrianca(id);
    this.filtro.set('todas');
  }

  alterarFiltro(valor: string | undefined): void {
    if (valor === 'todas' || valor === 'pendentes' || valor === 'aplicadas') {
      this.filtro.set(valor);
    }
  }

  private filtrarRegistros(registros: RegistroComVacina[], filtro: FiltroHistorico): RegistroComVacina[] {
    if (filtro === 'aplicadas') {
      return registros.filter((registro) => registro.status === 'aplicada');
    }

    if (filtro === 'pendentes') {
      const pendentes: StatusVacinal[] = ['atrasada', 'atencao', 'programada'];
      return registros.filter((registro) => pendentes.includes(registro.status));
    }

    return registros;
  }
}
