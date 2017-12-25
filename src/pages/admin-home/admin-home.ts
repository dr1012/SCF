import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { AdminPage } from '../admin/admin'
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { AdminAppSettingsPage } from '../admin-app-settings/admin-app-settings';
import { AdminVisitorHistoryPage } from '../admin-visitor-history/admin-visitor-history';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { BackandProvider } from '../../providers/backand/backand';
import {ConnectionCheckProvider} from '../../providers/connection-check/connection-check';

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {


  registrations = [];
  loginData = [];
  diversityQuestionnaireData = [];
  registrationQuestionnaireData = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlitedatabase: sqlitedatabase, private backandService: BackandProvider, private connectioncheck: ConnectionCheckProvider, private alertController: AlertController) {
   this.connectioncheck.connectionStatus();
    this.clearArrays();
    this.loadRegistrations();
    this.loadDiversityQuestionnaireData();
    this.loadLoginData();
    this.loadRegistrationQuestionnaireData();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  goToAdmin() {
    this.navCtrl.push(AdminPage);
  }

  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  goToAdminAppSettings() {

    this.navCtrl.push(AdminAppSettingsPage);
  }

  goToAdminVisitorData() {
    this.navCtrl.push(AdminVisitorDataPage);
  }

  goToAdminVisitorHistory() {
    this.navCtrl.push(AdminVisitorHistoryPage);

  }

  sync() {
    this.connectioncheck.connectionStatus();
    if(this.connectioncheck.connected){
    this.syncRegistration();
    this.syncLoginHistory();
    this.syncRegistrationQuestionnaire();
    this.syncDiversityQuestionnaire();
    }
    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!", 
        message: "No internet connection. Please try again later",
    });
    addTodoAlert.present();
    }
  }

  syncRegistration() {

    this.sendRegistrationDataLoop().then(() => {
      this.sqlitedatabase.clearRegistrationDb().then(() => {
        this.populateRegistrationTable();

      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  syncLoginHistory() {

    this.sendLoginData().then(() => {
      this.sqlitedatabase.clearLoginHistoryDB().then(() => {
        this.populatLoginHistoryTable();

      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  syncRegistrationQuestionnaire() {

    this.sendRegistrationQuestionnaireData().then(() => {
      this.sqlitedatabase.clearRegistrationQuestionnaireDB().then(() => {
        this.populateRegistrationQuestionnaireTable();

      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  syncDiversityQuestionnaire() {

    this.sendDiversityQuestionnaireData().then(() => {
      this.sqlitedatabase.clearDiversityQuestionnaireDB().then(() => {
        this.populateDviersityQuestionnaireTable();

      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }


  //works even if some items are duplicates. will only copy non duplicates
  public sendRegistrationDataLoop(): Promise<any> {
    console.log("sendRegistrationDataLoop called   ")
    return this.sqlitedatabase.listAllRegistration().then((stats) => {
      for (var i = 0; i < stats.length; i++) {
        this.backandService.addRegistrationData(JSON.stringify(stats[i])).subscribe(

          err => this.logError(err)
        );
      }


    })
  }




  public loadRegistrations() {

    this.backandService.getRegistrations()
      .subscribe(
      data => {
        this.registrations = data.data;

      },
      err => {
        this.logError(err)

      }
      );
    
  }

  public loadLoginData() {

    this.backandService.getLoginData()
      .subscribe(
      data => {
        this.loginData = data.data;

      },
      err => {
        this.logError(err)

      }
      );
    
  }

  public loadRegistrationQuestionnaireData() {

    this.backandService.getRegistrationQuestionnaireData()
      .subscribe(
      data => {
        this.registrationQuestionnaireData = data.data;

      },
      err => {
        this.logError(err)

      }
      );
    
  }

  public loadDiversityQuestionnaireData() {

    this.backandService.getDiversityQuestionnaireData()
      .subscribe(
      data => {
        this.diversityQuestionnaireData = data.data;

      },
      err => {
        this.logError(err)

      }
      );
    
  }


  public logError(err: TemplateStringsArray) {
    console.error('Error: ' + err);
  }

  populateRegistrationTable() {
    console.log("populate registration table called");


    // for each registration row from Backand, populate the local database.
    for (var i = 0; i < this.registrations.length; i++) {
      let inputarray = [];
      inputarray.push(this.registrations[i].user_id);
      inputarray.push(this.registrations[i].first_name);
      inputarray.push(this.registrations[i].last_name);
      inputarray.push(this.registrations[i].email_address);
      inputarray.push(this.registrations[i].phone_number);
      inputarray.push(this.registrations[i].address);
      inputarray.push(this.registrations[i].postcode);
      inputarray.push(this.registrations[i].emergency_name);
      inputarray.push(this.registrations[i].emergency_telephone);
      inputarray.push(this.registrations[i].emergency_relationship);
      this.sqlitedatabase.registerUserFromDB(inputarray);
    }



  }


  public sendLoginData(): Promise<any> {
    console.log("sendLoginData called   ")
    return this.sqlitedatabase.listAllLog().then((stats) => {
      for (var i = 0; i < stats.length; i++) {
        this.backandService.addLoginData(JSON.stringify(stats[i])).subscribe(

          err => this.logError(err)
        );
      }


    });
  }

  public sendRegistrationQuestionnaireData(): Promise<any> {
    console.log("sendRegistrationQuestionnaireData called   ")
    return this.sqlitedatabase.listAllStatsNoCount().then((stats) => {
      for (var i = 0; i < stats.length; i++) {
        this.backandService.addRegistrationQuestionnaireData(JSON.stringify(stats[i])).subscribe(

          err => this.logError(err)
        );
      }


    });
  }




  public sendDiversityQuestionnaireData(): Promise<any> {
    console.log("sendDiversityQuestionnaireData called   ")
    return this.sqlitedatabase.listAllDiversityNoCount().then((stats) => {
      for (var i = 0; i < stats.length; i++) {
        this.backandService.addDiversityQuestionnaireData(JSON.stringify(stats[i])).subscribe(

          err => this.logError(err)
        );
      }


    });
  }

  populatLoginHistoryTable() {
    console.log("populate login history table called");



    // for each registration row from Backand, populate the local database.
    for (var i = 0; i < this.loginData.length; i++) {
      let inputarray = [];
      inputarray.push(this.loginData[i].id);
      inputarray.push(this.loginData[i].user_id);
      inputarray.push(this.loginData[i].login_time);
      inputarray.push(this.loginData[i].logout_time);
      this.sqlitedatabase.addLoginDataToDB(inputarray);
    }

  }

  populateRegistrationQuestionnaireTable() {
    console.log("populate registration questionnaire table called");



    // for each registration row from Backand, populate the local database.
    for (var i = 0; i < this.registrationQuestionnaireData.length; i++) {
      let inputarray = [];
      inputarray.push(this.registrationQuestionnaireData[i].id);
      inputarray.push(this.registrationQuestionnaireData[i].user_id);
      inputarray.push(this.registrationQuestionnaireData[i].recorded_at);
      inputarray.push(this.registrationQuestionnaireData[i].question_id);
      inputarray.push(this.registrationQuestionnaireData[i].response);
      this.sqlitedatabase.addRegistrationQuestionnaireToDB(inputarray);
    }



  }

  populateDviersityQuestionnaireTable() {
    console.log("populate diversity questionnaire table called");



    // for each registration row from Backand, populate the local database.
    for (var i = 0; i < this.diversityQuestionnaireData.length; i++) {
      let inputarray = [];
      inputarray.push(this.diversityQuestionnaireData[i].id);
      inputarray.push(this.diversityQuestionnaireData[i].recorded_at);
      inputarray.push(this.diversityQuestionnaireData[i].question_id);
      inputarray.push(this.diversityQuestionnaireData[i].response);
      this.sqlitedatabase.addDiversityQuestionnaireToDB(inputarray);
    }



  }

  clearArrays(){
     this.registrations.length = 0;
      this.loginData.length = 0;
      this.registrationQuestionnaireData.length = 0;
      this.diversityQuestionnaireData.length  = 0;

  }





}
