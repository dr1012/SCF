import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { PopoverController } from 'ionic-angular';
import { CsvDownloadsPage } from '../csv-downloads/csv-downloads';

/**
  * Creating a dynamic table from csv data is based on a tutorial from https://devdactic.com/csv-data-ionic/
  */

/**
  * Downloading a csv file methodology is based on code from https://forum.ionicframework.com/t/downloading-files-in-ionic-using-cordova-plugin-file-transfer/42315
  */

/**
  * Converting from JS Object arrays to a csv file methodology is based on code from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
  */



/**
  * Writing a text file of csv data and saving it methodology is based on code from https://forum.ionicframework.com/t/generate-download-a-csv-file-with-ionic/63104
  */


@Component({
  selector: 'page-admin-visitor-history',
  templateUrl: 'admin-visitor-history.html',

})
export class AdminVisitorHistoryPage {

  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, private http: Http, private sqlitedatabase: sqlitedatabase, private File: File) {
    this.autoLogoutUser();
    this.csvFromDatabase();

  }

  /**
   * Creates a window with options for downloading csv files containing: login data,
   * questionnaire data and diversity questionnaire data.
   * @param myEvent 
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(CsvDownloadsPage);
    popover.present({
      ev: myEvent
    });
  }

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
        // console.log(arrayConverted)
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
      row += index + ',';
    }
    row = row.slice(0, -1);
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


  /**
   * This method sets up a dynamic table in the HTML file and parses the login data to it.
   */
  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    // this.headerRow = parsedData[0];
    this.headerRow = ["First Name", "Last Name", "Email Address", "Login Time", "Logout Time"];

    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }


  private handleError(err) {
    console.log('something went wrong: ', err);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminVisitorHistoryPage');
  }

  /**
   * This method opens the HomepagePage page.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
   * This method opens the AdminPage page.
   */
  goToAdminHome() {
    this.navCtrl.push(AdminHomePage);
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

          if (logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)") {
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


