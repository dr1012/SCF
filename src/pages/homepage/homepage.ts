import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';
import { AdminPage } from '../admin/admin';
import { BackgroundTestPage } from '../background-test/background-test';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import {DiversityQuestionnaire0Page} from '../diversity-questionnaire0/diversity-questionnaire0'
import { ErrorHandler } from '@angular/core';
import { Questionnaire1Page } from '../questionnaire1/questionnaire1';
import { BackandProvider } from '../../providers/backand/backand';
import { Http, Headers, HttpModule  } from '@angular/http';
import { GoogleformsProvider } from '../../providers/googleforms/googleforms'

@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {


  constructor(public navCtrl: NavController,private sqlitedatabase :sqlitedatabase, private backandService :BackandProvider, public http: Http, public googleprovider: GoogleformsProvider) {

  }
  goToLogin(){
   
   // this.navCtrl.push(LoginPage);


   this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1L2xWuxWk-y1V7jqJCUogYc2R5eRj0xjfKAOhBLeSHfI/values/A2%3AZZZ?key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(res => res.json()).subscribe(data => {
    console.log(data);
 

  });




  }
  goToRegister0(){
this.googleprovider.getGoogleDocRegistrationData();
  //this.navCtrl.push(Register0Page);
  }
  goToLogout(){
  
//this.navCtrl.push(LogoutPage);
 this.googleprovider.getGoogleDocDiversityQuestionnaireData();
  }
  goToAdmin(){
    this.navCtrl.push(AdminPage);
   
  }
  goToBackgroundTest(){
    this.navCtrl.push(BackgroundTestPage);
  }

  goToQuestions(){
   this.navCtrl.push(DiversityQuestionnaire0Page);
  

     
    
    
      
    
    
  }

  logStats(){


    // listAnswerStats(question_id) returns a promise of array of stats
    // for a single question. To use the result wrap it inside then() as shown below:
    this.sqlitedatabase.listAnswerStats(2).then((stats) => {
      console.log("listAnswerStats(2)");
      console.log(JSON.stringify(stats));
    });

    // listAnswerStats(question_id) returns a promise  of array of stats 
    // for all questions. To use the result wrap it inside then()
    this.sqlitedatabase.listAllStatsNoCount().then((stats) => {
      console.log("listAllStatsNoCount");
      console.log(JSON.stringify(stats));
    });


    this.sqlitedatabase.listAllRegistration().then((stats) => {
      console.log("list all registrations");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllDiversityNoCount().then((stats) => {
      console.log("list all diversity");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllLog().then((stats) => {
      console.log("list all login logout");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listLastSync().then((stats) => {
      console.log("list last sync");
      console.log(JSON.stringify(stats));
    });

  }








    
    




}
