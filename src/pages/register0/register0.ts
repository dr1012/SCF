import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register1Page } from '../register1/register1';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-register0',
  templateUrl: 'register0.html'
})
export class Register0Page {

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
   * This method takes the user back to the HomePage page.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }
  /**
   * This method takes the user to the previous page. 
   */
  goBack() {
    this.navCtrl.pop();
  }
  /**
   * This method takes the user to the Register1Page page. 
   */
  goRegister1() {
    this.navCtrl.push(Register1Page);


  }
  /**
   * This method displays an alert message. 
   */
  Not16() {
    let addTodoAlert = this.alertController.create({
      title: "Warning",
      message: "You have to be at least 16 years old to register. Please contact a member of staff",
    });
    addTodoAlert.present();
  }


}
