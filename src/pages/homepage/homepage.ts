import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';
import { AdminPage } from '../admin/admin'


@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

  constructor(public navCtrl: NavController) {
  }
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }goToRegister0(){
    this.navCtrl.push(Register0Page);
  }goToLogout(){
    this.navCtrl.push(LogoutPage);
  }goToAdmin(){
    this.navCtrl.push(AdminPage);
  }

}
