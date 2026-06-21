import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  alertCircleOutline,
  calendarClearOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  homeOutline,
  hourglassOutline,
  listOutline,
  medkitOutline,
  megaphoneOutline,
  peopleOutline,
  personCircleOutline,
  searchOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet />
    </ion-app>
  `
})
export class AppComponent {
  constructor() {
    addIcons({
      addCircleOutline,
      alertCircleOutline,
      calendarClearOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
      homeOutline,
      hourglassOutline,
      listOutline,
      medkitOutline,
      megaphoneOutline,
      peopleOutline,
      personCircleOutline,
      searchOutline,
      shieldCheckmarkOutline,
      sparklesOutline,
      timeOutline
    });
  }
}
