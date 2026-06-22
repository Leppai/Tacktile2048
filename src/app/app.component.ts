import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {

  private backButtonSubscription?: Subscription;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, async () => {

        if (this.router.url === '/home') {

          const alert = await this.alertController.create({
            cssClass: 'custom-exit-alert',
            header: 'Keluar Aplikasi',
            message: 'Apakah Anda yakin ingin keluar?',
            buttons: [
              {
                text: 'Tidak',
                role: 'cancel',
                cssClass: 'btn-tidak'
              },
              {
                text: 'Ya',
                cssClass: 'btn-ya',
                handler: () => {
                  App.exitApp();
                }
              }
            ]
          });

          await alert.present();

        } else {
          window.history.back();
        }
      });
  }

  ngOnDestroy() {
    this.backButtonSubscription?.unsubscribe();
  }
}
