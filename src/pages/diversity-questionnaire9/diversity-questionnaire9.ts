import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'page-diversity-questionnaire9',
    templateUrl: 'diversity-questionnaire9.html',
})
export class DiversityQuestionnaire9Page {

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;


    response_text = '';

    question_id: number = 0;
    question_text: string = '';


    constructor(public navCtrl: NavController,
        private alertController: AlertController,
        private sqlitedatabase: sqlitedatabase,
        private storage: Storage) {
        this.getDiversityQuestion();

        /**
          * This method retrieves the login history from the SQLite database.
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

    }

    /**
 * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data. 
 */
    getDiversityQuestion() {
        this.sqlitedatabase.getDiversityQuestion(9)
            .then((data) => {
                if (data == null) {
                    console.log("no data in table");
                    return;
                }
                if (data.rows.length > 0) {
                    this.question_id = data.rows.item(0).id;
                    this.question_text = data.rows.item(0).question_text;
                    console.log('question:' + this.question_text);
                }
            }, err => {
                console.log('Error: ', err);
            });
    }

    /**
* This method registers the user answers, inserts all the user answers into the local database, displays the registered data in the console and takes the user to the HomePage page. 
*/
    goNext() {
        this.sqlitedatabase.addToDiversityCache(this.question_id, [this.response_text])
        this.sqlitedatabase.logDiversityCache();
        this.sqlitedatabase.insertDiversityCache();


        let successAlert = this.alertController.create({
            message: "Thank you for filling up the questionnaires.\
             Your responses are carefully saved."
        });
        successAlert.present();
        this.navCtrl.push(HomepagePage);

    }


    /**
* This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file. 
*/
    goToHomepage() {
        this.navCtrl.push(HomepagePage);
    }

    /**
* This method takes the user to the previous page and deletes the his/hers last answer input. 
*/
    goBack() {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    }




}
