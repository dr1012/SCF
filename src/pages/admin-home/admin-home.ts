import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminPage } from '../admin/admin'
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data'; 
import { AdminAppSettingsPage } from '../admin-app-settings/admin-app-settings';
import { AdminVisitorHistoryPage } from '../admin-visitor-history/admin-visitor-history';



@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  goToAdmin(){
    this.navCtrl.push(AdminPage);
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }

  goToAdminAppSettings(){
    this.navCtrl.push(AdminAppSettingsPage);
  }

  goToAdminVisitorData(){
    this.navCtrl.push(AdminVisitorDataPage);
  }

  goToAdminVisitorHistory(){
    this.navCtrl.push(AdminVisitorHistoryPage);
  }
}
