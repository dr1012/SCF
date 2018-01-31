import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AdminPage } from '../admin/admin'
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { AdminAppSettingsPage } from '../admin-app-settings/admin-app-settings';
import { AdminVisitorHistoryPage } from '../admin-visitor-history/admin-visitor-history';
import { GoogleDriveProvider } from './../../providers/google-drive/google-drive';
import { Storage } from '@ionic/storage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { BackandProvider } from '../../providers/backand/backand';
import { ConnectionCheckProvider } from '../../providers/connection-check/connection-check';
import * as papa from 'papaparse';

import { File } from '@ionic-native/file';


import { Http } from '@angular/http';


@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
  providers: [GoogleDriveProvider]
})
export class AdminHomePage {

  registrations = [];
  loginData = [];
  diversityQuestionnaireData = [];
  registrationQuestionnaireData = [];

  csvData: any[] = [];
  headerRow: any[] = [];
  persons: Array<any>;
  dataId: string;

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public gDrive: GoogleDriveProvider, private storage: Storage, private sqlitedatabase: sqlitedatabase, private backandService: BackandProvider, private connectioncheck: ConnectionCheckProvider, private alertController: AlertController, private http: Http, private File: File) {
    this.autoLogoutUser();


    /**
      * This is the logic that assigns the desired background, chosen in
      * admin-app-settings.ts, to the background of the current page.
      */
    var promise1 = this.storage.get('wallpaperToggle'); //
    promise1.then(wallpaperID => {
      console.log(wallpaperID);

      if (wallpaperID == "autumn") {
        this.winter = false;
        this.summer = false;
        this.autumn = true;
        this.spring = false;
      } else if (wallpaperID == "summer") {
        this.winter = false;
        this.summer = true;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "winter") {
        this.winter = true;
        this.summer = false;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "spring") {
        this.winter = false;
        this.summer = false;
        this.autumn = false;
        this.spring = true;
      }

    });

    this.connectioncheck.connectionStatus();
    this.clearArrays();
    this.csvFromDatabase();



  }


  /**
   * This method opens the AdminPage page.
   */
  goToAdmin() {
    this.navCtrl.push(AdminPage);
  }

  /**
   * This method opens the HomepagePage page.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
   * This method opens the AdminAppSettingsPage page.
   */
  goToAdminAppSettings() {
    this.navCtrl.push(AdminAppSettingsPage);
  }
  /**
   * This method opens the AdminVistorDataPage page.
   */
  goToAdminVisitorData() {
    this.navCtrl.push(AdminVisitorDataPage);
  }
  /**
   * This method opens the AdminVistoryHistoryPage page.  
   */
  goToAdminVisitorHistory() {
    this.navCtrl.push(AdminVisitorHistoryPage);
  }

  /**
   * This method is called when the "Sync" button is pressed. It retrieves data from the google sheets and stores it in the local SQLite database. 
   * After a 1 second timeout to make sure that the data retrieval is complete, it sends all the data stored on the local database to the online Backand database
   * then clears the local database and redownloads all the data from the online database. 
   * This method is only called when there is an internet conenction, if there isn't one and error message will appear. 
   */
  sync() {

    this.connectioncheck.connectionStatus();
    if (this.connectioncheck.connected) {
      this.gDrive.getGoogleDocDiversityQuestionnaireData();
      this.gDrive.getGoogleDocRegistrationData();
      setTimeout(() => {
        this.syncRegistration();
        this.syncLoginHistory();
        this.syncRegistrationQuestionnaire();
        this.syncDiversityQuestionnaire();

        let addTodoAlert = this.alertController.create({
          title: "Sync complete",
          message: "The data from the Google forms and the online database has been synced",
        });
        addTodoAlert.present();

      }, 7000);


    }
    else {
      let addTodoAlert = this.alertController.create({
        title: "Warning!",
        message: "No internet connection. Please try again later",
      });
      addTodoAlert.present();
    }
  }

  /**
   * This method sends all the registration data from the local database to the onine database. Clears the local table containing the registration data and reloads all the online data to the local database.
   * This clearing and reloading process ensures there are no data duplicates and that no data is corruct. 
   */
  syncRegistration() {

    this.sendRegistrationDataLoop().then(() => {

      this.sqlitedatabase.clearRegistrationDb().then(() => {
        this.loadRegistrations();
        setTimeout(() => {
          this.populateRegistrationTable();
        }, 5000);




      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  /**
 * This method sends all the login data from the local database to the onine database. Clears the local table containing the login data and reloads all the online data to the local database.
 * This clearing and reloading process ensures there are no data duplicates and that no data is corruct. 
 */
  syncLoginHistory() {

    this.sendLoginData().then(() => {

      this.sqlitedatabase.clearLoginHistoryDB().then(() => {

        this.loadLoginData();
        setTimeout(() => {
          this.populatLoginHistoryTable();
        }, 5000);




      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  /**
   * This method sends all the registration questionnaire data from the local database to the onine database. Clears the local table containing the registration questionnaire data and reloads all the online data to the local database.
   * This clearing and reloading process ensures there are no data duplicates and that no data is corruct. 
   */
  syncRegistrationQuestionnaire() {

    this.sendRegistrationQuestionnaireData().then(() => {

      this.sqlitedatabase.clearRegistrationQuestionnaireDB().then(() => {


        this.loadRegistrationQuestionnaireData();
        setTimeout(() => {
          this.populateRegistrationQuestionnaireTable();
        }, 5000);



      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  /**
 * This method sends all the diversity questionnaire data from the local database to the onine database. Clears the local table containing the diversity questionnaire data and reloads all the online data to the local database.
 * This clearing and reloading process ensures there are no data duplicates and that no data is corruct. 
 */

  syncDiversityQuestionnaire() {

    this.sendDiversityQuestionnaireData().then(() => {

      this.sqlitedatabase.clearDiversityQuestionnaireDB().then(() => {

        this.loadDiversityQuestionnaireData();
        setTimeout(() => {
          this.populateDiversityQuestionnaireTable();
        }, 5000);




      }).catch(e => console.log(e));


    }).catch(e => console.log(e));


  }

  /**
   * This method sends registration data from the local database to the online Backand database using the Backand REST API. 
   */
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



  /**
   * This method loads all the registration data from the online Backand database to the 'registrations' array using the Backand REST API. 
   */
  public loadRegistrations() {
    console.log("load registrations called");
    this.backandService.getRegistrations()
      .subscribe(
      data => {
        this.registrations = data.data;

      },
      err => {
        console.log(err);

      }
      );

  }

  /**
 * This method loads all the login data from the online Backand database to the 'loginData' array using the Backand REST API. 
 */
  public loadLoginData() {
    console.log("load login data called");
    this.backandService.getLoginData()
      .subscribe(
      data => {
        this.loginData = data.data;

      },
      err => {
        console.log(err);
      }
      );

  }

  /**
 * This method loads all the registration questionnaire data from the online Backand database to the 'registrationQuestionnaireData' array using the Backand REST API. 
 */
  public loadRegistrationQuestionnaireData() {
    console.log("load registration questionnaire data called");
    this.backandService.getRegistrationQuestionnaireData()
      .subscribe(
      data => {
        this.registrationQuestionnaireData = data.data;

      },
      err => {
        console.log(err);

      }
      );

  }

  /**
 * This method loads all the diversity questionnaire data from the online Backand database to the 'diversityQuestionnaireData' array using the Backand REST API. 
 */
  public loadDiversityQuestionnaireData() {
    console.log("load diversity questionnaire data called");
    this.backandService.getDiversityQuestionnaireData()
      .subscribe(
      data => {
        this.diversityQuestionnaireData = data.data;

      },
      err => {
        console.log(err);
      }
      );

  }


  public logError(err: TemplateStringsArray) {
    console.error('Error: ' + err);
  }


  /**
   * This method populates the local SQLite database with data from the 'registrations' array.
   */
  populateRegistrationTable() {
    console.log("populate registration table called");



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

  /**
   * This method sends login data from the local database to the online Backand database using the Backand REST API. 
   */
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

  /**
 * This method sends registration qeustionnaire data from the local database to the online Backand database using the Backand REST API. 
 */
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



  /**
   * This method sends diversity questionnaire data from the local database to the online Backand database using the Backand REST API. 
   */
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

  /**
   * This method populates the local SQLite database with data from the 'loginData' array.
   */
  populatLoginHistoryTable() {
    console.log("populate login history table called");



    for (var i = 0; i < this.loginData.length; i++) {
      let inputarray = [];
      inputarray.push(this.loginData[i].id);
      inputarray.push(this.loginData[i].user_id);
      inputarray.push(this.loginData[i].login_time);
      inputarray.push(this.loginData[i].logout_time);
      this.sqlitedatabase.addLoginDataToDB(inputarray);
    }





  }


  /**
    * This method populates the local SQLite database with data from the 'registrationQuestionnaireData' array.
    */
  populateRegistrationQuestionnaireTable() {
    console.log("populate registration questionnaire table called");




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


  /**
    * This method populates the local SQLite database with data from the 'diverisytQuestionnaireData' array.
    */
  populateDiversityQuestionnaireTable() {
    console.log("populate diversity questionnaire table called");




    for (var i = 0; i < this.diversityQuestionnaireData.length; i++) {
      let inputarray = [];
      inputarray.push(this.diversityQuestionnaireData[i].id);
      inputarray.push(this.diversityQuestionnaireData[i].recorded_at);
      inputarray.push(this.diversityQuestionnaireData[i].question_id);
      inputarray.push(this.diversityQuestionnaireData[i].response);
      this.sqlitedatabase.addDiversityQuestionnaireToDB(inputarray);
    }



  }


  /**
   * This method clears the 'registrations', 'loginData', 'registrationQeustionnaireData' and 'diversityQuestionnaireData' arrays. 
   */
  clearArrays() {
    this.registrations.length = 0;
    this.loginData.length = 0;
    this.registrationQuestionnaireData.length = 0;
    this.diversityQuestionnaireData.length = 0;


  }



  /**
   * The below methods used are taken from the admin-visitor-history.ts file. They are used
   * to pre-populate the table before it is viewed by the user. This is done because there
   * is an update bug where new logins aren't displayed unless the visitor history page is
   * viewed twice.
   */


  /**
   * This method retrieves the login history from the SQLite database.
   */
  csvFromDatabase() {
    this.sqlitedatabase.listLoginDetailsForTable()
      .then((stats) => {
        let arrayConverted = [];

        for (var q = 0; q < stats.length; q++) {
          var logoutTimeString = (stats[q].logout_time).toString();
          var loginTimeString = (stats[q].login_time).toString();
          var currentDateInfoArray = logoutTimeString.split(" ");
          var currentYear = currentDateInfoArray[3];
          var year = 1970;

          if (currentYear.toString() == year.toString()) {
            var stillActiveString = 'Volunteer still active';

            arrayConverted.push({
              first_name: stats[q].first_name,
              last_name: stats[q].last_name,
              email_address: stats[q].email_address,
              login_time: loginTimeString,
              logout_time: stillActiveString
            });
          } else {

            arrayConverted.push({
              first_name: stats[q].first_name,
              last_name: stats[q].last_name,
              email_address: stats[q].email_address,
              login_time: loginTimeString,
              logout_time: logoutTimeString
            });

          }


        }

        this.ConvertToCSV(arrayConverted);

      }
      , err => {
        console.log("something went wrong on retrieving login history");
      });
  }

  /**
   * This method converts the login history data to csv format.
   */
  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);

    //append Label row with line break
    str += row + '\r\n';

    for (let i = array.length - 1; i >= 0; i--) {
      let line = '';

      for (let index in array[i]) {
        if (line != '') line += ',';
        line += array[i][index];
      }

      str += line + '\r\n';
    }

    this.saveFile(str);
  }

  /**
   * This method saves the csv data to a file in a local directory.
   */
  saveFile(body) {
    let fileName = "dummyData.csv"
    this.File.writeFile(this.File.dataDirectory, fileName, body)
      .then(
      _ => {
        console.log('Success ;-)' + this.File.dataDirectory)
      }
      )
      .catch(
      err => {
        this.File.writeExistingFile(this.File.dataDirectory, fileName, body)
          .then(
          _ => {
            console.log('Success ;-)2' + this.File.dataDirectory)
          }
          )
          .catch(
          err => {
            console.log(err + 'Failure' + this.File.dataDirectory)
          }
          )
      }
      )
    this.readCsvData();
  }

  /**
   * This method extracts the csv data from the written file so that it can be parsed to a table.
   */
  private readCsvData() {
    this.http.get(this.File.dataDirectory + 'dummyData.csv')
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }
  private handleError(err) {
    console.log('something went wrong: ', err);
  }

  /**
   * This method sets up a dynamic table in the HTML file and parses the login data to it.
   */
  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.headerRow = ["First Name", "Last Name", "Email Address", "Login Time"];
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }


  /**
   * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
   * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
   * that the farm shuts.
   * 2) The auto-logout is executed after the day on which the volunteer logged in.
   */
  autoLogoutUser() {
    this.sqlitedatabase.listDetailsForAutoLogout()
      .then((stats) => {
        var d = new Date(); //Gives the current time and date
        var currentTimeMS = d.getTime();

        for (var j = 0; j < stats.length; j++) {
          //Below gives us the date to compare
          var handledTotalDate = new Date(stats[j].login_time);
          var handledYear = handledTotalDate.getFullYear();
          var handledMonth = handledTotalDate.getMonth(); //Month in date format is 0-11
          var handledDate = handledTotalDate.getDate();

          var logoutTime = new Date(stats[j].logout_time); //Finds if the logout time exists

          if (logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)" || logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (BST)") {
            var logoutBoolean = 0; //If logout time is null, given date Thu Jan 01 1970...
          } else {
            logoutBoolean = 1;
          }

          //Creates a logout date on the same day as the login data for 17:00
          var dateToSet = new Date();
          dateToSet.setDate(handledDate);
          dateToSet.setFullYear(handledYear);
          dateToSet.setMonth(handledMonth);
          dateToSet.setHours(16);
          dateToSet.setMinutes(30, 0, 0);

          console.log("Date to set: " + dateToSet);
          var dateToSetMS = dateToSet.getTime();

          console.log("Time to set: " + dateToSetMS);
          var reverseDateTest = new Date(dateToSetMS);
          console.log("Reverse test: " + reverseDateTest);

          //Logs the user out if it finds the value of logoutBoolean = 0
          if (currentTimeMS > dateToSetMS && logoutBoolean === 0) {
            //Logout user at 17:00 of current date, if it is passed that time on the same day
            this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
              .then(() => {

              }, err => {
                console.log('Error1: ', err);
              });
          } else {
            console.log("Already logged out");
          }


        }
      }
      , err => {
        console.log("something went wrong on auto-logging out users");
      });
  }




}
