import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home'; 
import { FormControl } from '@angular/forms';
import { ForgotAdminPasswordPage } from '../forgot-admin-password/forgot-admin-password';





@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  passwordInput='';

  constructor(public navCtrl: NavController, private alertController: AlertController) {
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  
  goToAdminHome(){
    if(this.passwordInput==="password"){
    this.navCtrl.push(AdminHomePage);
    }
    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!", 
        message: "Incorrect Password",
      });
      addTodoAlert.present();
    }
  }

  goToForgottenAdminPassword(){
    this.navCtrl.push(ForgotAdminPasswordPage);
  }

}
