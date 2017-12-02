import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home'; 

/**
 * Generated class for the AdminVisitorHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-visitor-history',
  templateUrl: 'admin-visitor-history.html',
})
export class AdminVisitorHistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminVisitorHistoryPage');
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  
  goToAdminHome(){
    this.navCtrl.push(AdminHomePage);
  }

}
