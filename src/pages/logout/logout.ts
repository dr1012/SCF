import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage {

  constructor(public navCtrl: NavController) {
  }

  goToHomepage(params){
    if (!params) params = {};
    this.navCtrl.push(HomepagePage);
  }goBack(){
    this.navCtrl.pop();
  }
  
}
