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

}
