import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';

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
  template: `
    <ion-list>
      <ion-list-header> CSV Downloads </ion-list-header>
      <button ion-item (click)="downloadCSV()"> Login History
      <ion-icon name="download"></ion-icon> 
      </button>
      <button ion-item (click)="getQuestionnaireResponses()"> Questionnaire Responses 
      <ion-icon name="download"></ion-icon>
      </button>
      <button ion-item (click)="getDiversityResponses()"> Diversity Responses 
      <ion-icon name="download"></ion-icon>
      </button>

    </ion-list>
  `
})
export class CsvDownloadsPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private sqlitedatabase: sqlitedatabase, private File: File, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CsvDownloadsPage');
  }

  /**
   * This method allows the user to download a csv file of diversity questionnaire responses to the device's 'Downloads' folder.
   */
  getDiversityResponses() {
    this.sqlitedatabase.listAllDiversity2()
      .then((allStats) => {
        var questionNumber;
        var questionTextArray = [];
        var questionText;
        let questionnaireResults = [];

        for (var z = 0; z < allStats.length; z++) {
          questionNumber = (allStats[z].question_id);

          this.sqlitedatabase.getDiversityQuestion(questionNumber)
            .then((data) => {
              if (data == null) {
                console.log("no data in table");
                return;
              }
              var question_text;
              if (data.rows.length > 0) {
                questionNumber = data.rows.item(0).id;
                question_text = data.rows.item(0).question_text;
                questionText = question_text.toString();
                questionTextArray.push(questionText);

                if (questionTextArray.length === allStats.length) {

                  for (var i = 0; i < allStats.length; i++) {
                    questionnaireResults.push({
                      question: questionTextArray[i],
                      response: allStats[i].response,
                      count: allStats[i].count
                    });
                  }
                  console.log("Diversity questionnaire responses: ")
                  console.log(questionnaireResults)

                  let array = typeof questionnaireResults != 'object' ? JSON.parse(questionnaireResults) : questionnaireResults;
                  let str = '';
                  let row = "";
                  for (let index in questionnaireResults[0]) {
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

                  //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
                  var d = new Date();
                  var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
                  let fileName = "DiversityResponses" + date.toString() + ".csv";
                  console.log(fileName);

                  this.File.writeFile(this.File.externalRootDirectory + '/Download/', fileName, str)
                    .then(
                    _ => {
                      let alert = this.alertCtrl.create({
                        title: 'Download Success',
                        subTitle: 'A .csv of the diversity form responses has been successfully exported to your Downloads folder',
                        buttons: ['Continue']
                      });
                      alert.present();
                    }
                    )
                    .catch(
                    err => {

                      this.File.writeExistingFile(this.File.dataDirectory, fileName, str)
                        .then(
                        _ => {
                          let alert = this.alertCtrl.create({
                            title: 'Download Success',
                            subTitle: 'A .csv of the diversity form responses has been successfully exported to your Downloads folder',
                            buttons: ['Continue']
                          });
                          alert.present();
                        }
                        )
                        .catch(
                        err => {
                          console.log(err + 'Failure' + this.File.dataDirectory)
                        }
                        )
                    }
                    )

                }
              }

            }, err => {
              console.log('Error: ', err);
            });

        }


      }
      , err => {
        console.log("something went wrong on retrieving the diversity form responses");
      });

  }

  /**
   * This method allows the user to download a csv file of questionnaire responses to the device's 'Downloads' folder.
   */
  getQuestionnaireResponses() {
    this.sqlitedatabase.listAllStats2()
      .then((allStats) => {
        var questionNumber;
        var questionTextArray = [];
        var questionText;
        let questionnaireResults = [];

        for (var z = 0; z < allStats.length; z++) {
          questionNumber = (allStats[z].question_id);

          this.sqlitedatabase.getQuestion(questionNumber)
            .then((data) => {
              if (data == null) {
                console.log("no data in table");
                return;
              }
              var question_text;
              if (data.rows.length > 0) {
                questionNumber = data.rows.item(0).id;
                question_text = data.rows.item(0).question_text;
                questionText = question_text.toString();
                questionTextArray.push(questionText);

                if (questionTextArray.length === allStats.length) {

                  for (var i = 0; i < allStats.length; i++) {
                    questionnaireResults.push({
                      question: questionTextArray[i],
                      response: allStats[i].response,
                      count: allStats[i].count
                    });
                  }
                  console.log("Questionnaire responses: ")
                  console.log(questionnaireResults)

                  let array = typeof questionnaireResults != 'object' ? JSON.parse(questionnaireResults) : questionnaireResults;
                  let str = '';
                  let row = "";
                  for (let index in questionnaireResults[0]) {
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

                  //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
                  var d = new Date();
                  var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
                  let fileName = "QuestionnaireResponses" + date.toString() + ".csv";
                  console.log(fileName);

                  this.File.writeFile(this.File.externalRootDirectory + '/Download/', fileName, str)
                    .then(
                    _ => {
                      let alert = this.alertCtrl.create({
                        title: 'Download Success',
                        subTitle: 'A .csv of the questionnaire form responses has been successfully exported to your Downloads folder',
                        buttons: ['Continue']
                      });
                      alert.present();
                    }
                    )
                    .catch(
                    err => {

                      this.File.writeExistingFile(this.File.dataDirectory, fileName, str)
                        .then(
                        _ => {
                          let alert = this.alertCtrl.create({
                            title: 'Download Success',
                            subTitle: 'A .csv of the questionnaire form responses has been successfully exported to your Downloads folder',
                            buttons: ['Continue']
                          });
                          alert.present();
                        }
                        )
                        .catch(
                        err => {
                          console.log(err + 'Failure' + this.File.dataDirectory)
                        }
                        )
                    }
                    )
                }
              }

            }, err => {
              console.log('Error: ', err);
            });

        }


      }
      , err => {
        console.log("something went wrong on retrieving questionnaire responses");
      });
  }


  /**
   * This method allows the user to download a csv file of the visitor history to the device's 'Downloads' folder.
   */
  downloadCSV() {
    this.sqlitedatabase.listLoginDetailsForTable()
      .then((stats) => {
        let arrayConverted2 = [];

        for (var q = 0; q < stats.length; q++) {
          var logoutTimeString = (stats[q].logout_time).toString();
          var loginTimeString = (stats[q].login_time).toString();
          var currentDateInfoArray = logoutTimeString.split(" ");
          var currentYear = currentDateInfoArray[3];
          var year = 1970;

          if (currentYear.toString() == year.toString()) {
            var stillActiveString = 'Volunteer still active';

            arrayConverted2.push({
              first_name: stats[q].first_name,
              last_name: stats[q].last_name,
              email_address: stats[q].email_address,
              login_time: loginTimeString,
              logout_time: stillActiveString
            });
          } else {

            arrayConverted2.push({
              first_name: stats[q].first_name,
              last_name: stats[q].last_name,
              email_address: stats[q].email_address,
              login_time: loginTimeString,
              logout_time: logoutTimeString
            });

          }


        }

        let array = typeof arrayConverted2 != 'object' ? JSON.parse(arrayConverted2) : arrayConverted2;
        let str = '';
        let row = "";
        for (let index in arrayConverted2[0]) {
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

        //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
        var d = new Date();
        var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
        let fileName = "LoginHistory" + date.toString() + ".csv";
        console.log(fileName);

        this.File.writeFile(this.File.externalRootDirectory + '/Download/', fileName, str)
          .then(
          _ => {
            let alert = this.alertCtrl.create({
              title: 'Download Success',
              subTitle: 'A .csv of the login history has been successfully exported to your Downloads folder',
              buttons: ['Continue']
            });
            alert.present();
          }
          )
          .catch(
          err => {

            this.File.writeExistingFile(this.File.dataDirectory, fileName, str)
              .then(
              _ => {
                let alert = this.alertCtrl.create({
                  title: 'Download Success',
                  subTitle: 'A .csv of the login history has been successfully exported to your Downloads folder',
                  buttons: ['Continue']
                });
                alert.present();
              }
              )
              .catch(
              err => {
                console.log(err + 'Failure' + this.File.dataDirectory)
              }
              )
          }
          )
      }
      , err => {
        let alert = this.alertCtrl.create({
          title: 'Download Failure',
          subTitle: 'A .csv of the login history has failed to export',
          buttons: ['Continue']
        });
        alert.present();
      });


  }

}
