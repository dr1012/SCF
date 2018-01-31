////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file google-drive.ts is adapted from https://developers.google.com/apis-explorer/?hl=en_GB#p/sheets/v4/

*/
////////////////////////////////////////////////////////////////////////////////////////////////

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import 'rxjs/add/operator/map';

@Injectable()
export class GoogleDriveProvider {

  registrationArray = [];
  latestTimeStamp = '';
  latestTimeStamp2 = '';
  valueChangeStatus = false;
  valueChangeStatus2 = false;
  constructor(public http: Http, private sqlitedatabase: sqlitedatabase) {

  }

  /**
   * This method retrieves the data from the Registration Google sheet usin gthe Google sheets REST API. It stores the data in the 'inputArray' array. 
   * It will only do so if the time stamp ofthe particular row in the Google sheet is more recent than the last time stamp from the last import. 
   * The program keeps track of the time stamps of the data that was imported. 
   */
  getGoogleDocRegistrationData() {
    this.updateLastSync();


    this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1JL2UaQGqsaGv0dWnShQvFUnivfu-4Hi4P3XkqhwgzpA/values/Live!A2%3AZZZ?key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(res => res.json()).subscribe(data => {
      for (var i = 0; i < data.values.length; i++) {
        if (data.values[i][1]) {
          var lastGoogleTimestamp = data.values[i][0];



          var lastGoogleTimestampUTC = this.spliceDateToUTC(lastGoogleTimestamp);


          console.log("unmodified lastgoogletimestamp2: " + lastGoogleTimestampUTC)
          console.log("unmodified lastgoogletimestamp: " + lastGoogleTimestamp)
          console.log("parsed lastTimestamp: " + this.latestTimeStamp);
          console.log("parsed lastGoogleTimestamp: " + Date.parse(lastGoogleTimestampUTC));
          if (Date.parse(lastGoogleTimestampUTC) > +this.latestTimeStamp) {
            console.log("adding new data from google sheets because new data available");
            let inputArray = [];
            let outputRegistrationArray = [];


            for (var j = 0; j < data.values[i].length; j++) {

              inputArray.push(data.values[i][j]);

            }
            console.log("inputArray: " + inputArray);
            this.spliceDataForRegistration(inputArray, outputRegistrationArray);
            this.registerUserFromDB(outputRegistrationArray);
            this.valueChangeStatus = true;
          }


        }
      }

      if (this.valueChangeStatus) {
        this.sqlitedatabase.setLastSync(Date.parse(lastGoogleTimestampUTC));
        this.valueChangeStatus = false;
      }
    });


  }


  /**
   * This method retrieves the data from the Diversity Questionnaire Google sheet using the Google sheets REST API. It stores the data in the 'inputArray' array. 
   * It will only do so if the time stamp ofthe particular row in the Google sheet is more recent than the last time stamp from the last import. 
   * The program keeps track of the time stamps of the data that was imported. 
   */
  getGoogleDocDiversityQuestionnaireData() {
    this.updateLastSync2();


    this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1eOuV0vyHF7w_ei7t-_PtIxqPjben3oba249IgQ575kc/values/Online%20Applications!A2%3AZZZ?valueRenderOption=FORMATTED_VALUE&key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(res => res.json()).subscribe(data => {
      for (var i = 0; i < data.values.length; i++) {
        if (data.values[i][0]) {
          var lastGoogleTimestamp = data.values[i][0];

          var lastGoogleTimestampUTC = this.spliceDateToUTC(lastGoogleTimestamp);

          console.log("unmodified lastgoogletimestamp2: " + lastGoogleTimestampUTC)
          console.log("unmodified lastgoogletimestamp: " + lastGoogleTimestamp)
          console.log("unparsed lastTimestamp: " + this.latestTimeStamp2);
          console.log("parsed lastGoogleTimestamp: " + Date.parse(lastGoogleTimestampUTC));
          if (Date.parse(lastGoogleTimestampUTC) > +this.latestTimeStamp2) {
            console.log("adding new data from google sheets because new data available");
            let inputArray = [];
            let outputRegistrationArray = [];

            for (var j = 0; j < data.values[i].length; j++) {

              inputArray.push(data.values[i][j]);

            }

            console.log("inputArray: " + inputArray);
            this.spliceDataForDiversityQuestionnaire(inputArray, outputRegistrationArray);

            for (var l = 0; l < 9; l++) {
              this.addDiversityAnswer(l + 1, outputRegistrationArray[l], data.values[i][0]);
            }
            this.valueChangeStatus2 = true;

          }


        }
      }

      if (this.valueChangeStatus2) {
        this.sqlitedatabase.setLastSync2(Date.parse(lastGoogleTimestampUTC));
        this.valueChangeStatus2 = false;
      }
    });

  }


  /**
   * This method querries the last time stamp for the registration data from the local database and assigns it to the 'latestTimeStamp' variable. 
   */
  public updateLastSync() {

    this.sqlitedatabase.getLastSync().then((data2) => {

      if (data2 == null) {
        console.log("no timestamp yet");
        return;
      }
      if (data2.rows.length > 0) {
        this.latestTimeStamp = data2.rows.item(0).last_sync;

        console.log('maximumValue:' + data2.rows.item(0).last_sync);

      }

    });
  }

  /**
   * This method querries the last time stamp for the diveristy questionnaire data from the local database and assigns it to the 'latestTimeStamp' variable. 
   */
  public updateLastSync2() {

    this.sqlitedatabase.getLastSync2().then((data2) => {

      if (data2 == null) {
        console.log("no timestamp yet");
        return;
      }
      if (data2.rows.length > 0) {
        this.latestTimeStamp2 = data2.rows.item(0).last_sync;

        console.log('maximumValue:' + data2.rows.item(0).last_sync);

      }

    });
  }

  /**
   * This method takes an array of data from the Google sheet registration data and converts it to a format that is readable by the local database. 
   * @param inputArray 
   * @param outputArray 
   */
  spliceDataForRegistration(inputArray, outputArray) {
    var str = inputArray[1];

    var splitted = str.split(' ');
    //first name
    outputArray.push(splitted[0]);
    var str2 = ''
    for (var k = 1; k < splitted.length; k++) {
      str2 = str2 + splitted[k] + ' ';
    }
    //last name  
    outputArray.push(str2);

    //email
    outputArray.push(inputArray[5]);

    //phone number
    outputArray.push(inputArray[4]);

    //instead of address
    outputArray.push("");

    //instead of postcode
    outputArray.push(inputArray[2]);

    //emergency_name
    outputArray.push(inputArray[13]);

    //emergency_telephone
    outputArray.push(inputArray[14]);

    //emergency_relationship
    outputArray.push(inputArray[16]);


  }




  /**
   * This method takes an array of data from the Google sheet diversity questionnaire data and converts it to a format that is readable by the local database. 
   * @param inputArray 
   * @param outputArray 
   */
  spliceDataForDiversityQuestionnaire(inputArray, outputArray) {

    //Age Category
    outputArray.push(inputArray[19]);

    // Sex
    outputArray.push(inputArray[18]);

    //Sexual orientation
    outputArray.push(inputArray[23]);

    //Etnicity
    outputArray.push(inputArray[20]);

    //Disability
    outputArray.push(inputArray[21]);

    //Caring responsibilities
    outputArray.push(inputArray[22]);

    //Religion
    outputArray.push(inputArray[24]);

    //Curent employment status
    outputArray.push(inputArray[25]);

    //London Borough
    outputArray.push(inputArray[29]);


  }




  /**
   * Thie method takes the date stamp from the google sheet (in dd/mm/yyyy hh:mm:ss) and converts it to a UTC-string format.
   * @param inputDate 
   */
  spliceDateToUTC(inputDate): string {
    var outputUTCDate = '';
    var splitted = inputDate.split('/', 3);
    var splitted2 = splitted[2].split(' ');
    outputUTCDate = outputUTCDate + splitted2[0] + '-' + splitted[1] + '-' + splitted[0] + ' ' + splitted2[1];
    console.log(outputUTCDate);
    return outputUTCDate;
  }


  /**
   * This method adds data from an array to the question_response SQLite table that contains registration questionnaire data. 
   * @param data 
   */
  addRegistrationQuestionnaireToDB(data): Promise<any> {
    var sql = "insert into question_response(\
                  id, user_id, \
                  recorded_at, \
                  question_id, option_text\
              ) values (?,?,?,?,?)";
    var values = [
      data[0],
      data[1],
      data[2],
      data[3],
      data[4]
    ];

    return this.sqlitedatabase.db.executeSql(sql, values).catch(e => console.log(e));
  }


  /**
   * This method adds data from an array to the sutton_user SQLite table that contains registration  data. 
   * @param data 
   */
  registerUserFromDB(dataArray): Promise<any> {
    var sql = "insert into sutton_user(\
                 first_name, last_name, \
                  email_address, \
                  phone_number, \
                  address, postcode, \
                  emergency_name,\
                  emergency_telephone,\
                  emergency_relationship\
              ) values (?,?,?,?,?,?,?,?,?)";
    var values = [
      dataArray[0],
      dataArray[1],
      dataArray[2],
      dataArray[3],
      dataArray[4],
      dataArray[5],
      dataArray[6],
      dataArray[7],
      dataArray[8]
    ];

    return this.sqlitedatabase.db.executeSql(sql, values).catch(e => console.log(e));
  }


  /**
   * This method adds data from an array to the diversity_response SQLite table that contains diversity questionnaire data. 
   * @param data 
   */
  public addDiversityAnswer(question_id: number, answer: string, timestamp: string) {
    let insert_sql = "INSERT INTO diversity_response (\
                        question_id, option_text, recorded_at)\
                        VALUES (?, ?, ?)";
    let params = [question_id, answer, timestamp];
    this.sqlitedatabase.db.executeSql(insert_sql, params)


  }



}
