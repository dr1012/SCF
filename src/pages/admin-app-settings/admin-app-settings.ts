import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AdminHomePage } from '../admin-home/admin-home';
import { HomepagePage } from '../homepage/homepage';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-admin-app-settings',
  templateUrl: 'admin-app-settings.html',
})
export class AdminAppSettingsPage {

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;
  custom: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private storage: Storage) {

    /**
      * This is the logic that assigns the desired background, chosen in
      * admin-app-settings.ts, to the background of the current page.
      */
    var promise1 = this.storage.get('wallpaperToggle'); //
    promise1.then(wallpaperID => {
      console.log(wallpaperID);

      if (wallpaperID == "autumn") {
        this.winter = false;
        this.summer = false;
        this.autumn = true;
        this.spring = false;
      } else if (wallpaperID == "summer") {
        this.winter = false;
        this.summer = true;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "winter") {
        this.winter = true;
        this.summer = false;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "spring") {
        this.winter = false;
        this.summer = false;
        this.autumn = false;
        this.spring = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminAppSettingsPage');
  }

  /**
   * Method returns user to homepage
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
   * Method returns user to admin homepage
   */
  goToAdminHome() {
    this.navCtrl.push(AdminHomePage);
  }

  /**
   * Each of these functions is used to set the wallpaper for the entire app.
   * This is achieved by setting the boolean variable, associated with the 
   * the desired wallpaper, to 'true'. All of the other boolean variables, which
   * are associated with the other wallpapers are set to 'false'.
   * */
  springToggle() {
    this.storage.remove('wallpaperToggle');
    this.storage.set('wallpaperToggle', 'spring');

    this.winter = false;
    this.summer = false;
    this.autumn = false;
    this.spring = true;
  }

  summerToggle() {
    this.storage.remove('wallpaperToggle');
    this.storage.set('wallpaperToggle', 'summer');

    this.winter = false;
    this.summer = true;
    this.autumn = false;
    this.spring = false;
  }

  winterToggle() {
    this.storage.remove('wallpaperToggle');
    this.storage.set('wallpaperToggle', 'winter');

    this.winter = true;
    this.summer = false;
    this.autumn = false;
    this.spring = false;
  }

  autumnToggle() {
    this.storage.remove('wallpaperToggle');
    this.storage.set('wallpaperToggle', 'autumn');

    this.winter = false;
    this.summer = false;
    this.autumn = true;
    this.spring = false;
  }

}
