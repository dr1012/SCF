import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';
import { TestPage } from '../test/test';
import { AdminPage } from '../admin/admin'
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

  constructor(public navCtrl: NavController,  private questionnairedb: QuestionnaireDatabaseProvider ) {
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

  Test(){
    this.navCtrl.push(TestPage);
  }

}
