import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home'; 
import { FormControl } from '@angular/forms';
import { ForgotAdminPasswordPage } from '../forgot-admin-password/forgot-admin-password';





@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public navCtrl: NavController) {
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  
  goToAdminHome(){
    this.navCtrl.push(AdminHomePage);
  }

  goToForgottenAdminPassword(){
    this.navCtrl.push(ForgotAdminPasswordPage);
  }

}
