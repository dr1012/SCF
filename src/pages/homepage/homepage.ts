import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';
import { AdminPage } from '../admin/admin';
import { BackgroundTestPage } from '../background-test/background-test';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import {DiversityQuestionnaire0Page} from '../diversity-questionnaire0/diversity-questionnaire0'

import { Questionnaire1Page } from '../questionnaire1/questionnaire1';

@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

 

  constructor(public navCtrl: NavController,private sqlitedatabase :sqlitedatabase) {
  }
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }goToRegister0(){
   this.navCtrl.push(Register0Page);
  }goToLogout(){
  this.navCtrl.push(LogoutPage);
  }goToAdmin(){
    this.navCtrl.push(AdminPage);
  }goToBackgroundTest(){
    this.navCtrl.push(BackgroundTestPage);
  }

  goToQuestions(){
    this.navCtrl.push(DiversityQuestionnaire0Page);
  }

  logStats(){
    // listAnswerStats(question_id) returns a promise of array of stats
    // for a single question. To use the result wrap it inside then() as shown below:
    this.sqlitedatabase.listAnswerStats(2).then((stats) => {
      console.log(JSON.stringify(stats));
    });

    // listAnswerStats(question_id) returns a promise  of array of stats 
    // for all questions. To use the result wrap it inside then()
    this.sqlitedatabase.listAllStats().then((stats) => {
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listRegistration("David", "Rudolf").then((stats) => {
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllDiversity().then((stats) => {
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllLog().then((stats) => {
      console.log(JSON.stringify(stats));
    });



  }



}
