import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdminPage } from '../admin/admin'
import { HomepagePage } from '../homepage/homepage';

@IonicPage()
@Component({
  selector: 'page-forgot-admin-password',
  templateUrl: 'forgot-admin-password.html',
})
export class ForgotAdminPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotAdminPasswordPage');
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  
  goToAdmin(){
    this.navCtrl.push(AdminPage);
  }

}
