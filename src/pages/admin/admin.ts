import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  passwordInput = '';
  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, private alertController: AlertController, private storage: Storage) {

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

  /**
   * Method takes administrator to the admin homepage, provided the
   * correct password is entered.
   */
  goToAdminHome() {
    if (this.passwordInput === "Squash88") {
      this.navCtrl.push(AdminHomePage);
    }
    else {
      let addTodoAlert = this.alertController.create({
        title: "Warning!",
        message: "Incorrect Password",
      });
      addTodoAlert.present();
    }
  }

  /**
   * Method returns user to the homepage.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }


}
