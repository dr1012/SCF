import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminHomePage } from '../admin-home/admin-home'; 
import { HomepagePage } from '../homepage/homepage';

/**
 * Generated class for the AdminAppSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-app-settings',
  templateUrl: 'admin-app-settings.html',
})
export class AdminAppSettingsPage {

  winter: boolean = true;
  summer: boolean = false;
  autumn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminAppSettingsPage');
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }

  goToAdminHome(){
    this.navCtrl.push(AdminHomePage);
  }

  summerToggle(){
    this.winter = false;
    this.summer = true;
    this.autumn = false;
  }

  winterToggle(){
    this.winter = true;
    this.summer = false;
    this.autumn = false;
  }

  autumnToggle(){
    this.winter = false;
    this.summer = false;
    this.autumn = true;
  }

}
