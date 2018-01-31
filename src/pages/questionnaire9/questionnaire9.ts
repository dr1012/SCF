import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire10Page } from '../questionnaire10/questionnaire10';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-questionnaire9',
    templateUrl: 'questionnaire9.html'


})
export class Questionnaire9Page {

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    choices: string[] = [
        'I don\'t mind',
        'No thank you'
    ];

    responses: boolean[];
    response_text = '';

    question_id: number = 0;
    question_text: string = '';


    constructor(public navCtrl: NavController,
        private alertController: AlertController,
        private sqlitedatabase: sqlitedatabase,
        private storage: Storage) {

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

        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; })

    }

    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data. 
 */
    getQuestion() {
        this.sqlitedatabase.getQuestion(7)
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
 * This method registers the user answers and takes the user to the next page. 
 */
    goNext() {
        if (this.responses.indexOf(true) > -1) {
            let all_choices = this.choices;
            console.log("responses:" + this.responses);
            let selected = this.responses
                .map(function (x, i) {
                    if (x) { return all_choices[i]; }
                }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();

            //this.sqlitedatabase.insertCachedAnswers(0);

            this.navCtrl.push(Questionnaire10Page);
        }
        else {
            let addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    }

    /**
  * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file. 
  */
    goToHomepage() {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(HomepagePage);
    }

    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input. 
 */
    goBack() {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    }



}
