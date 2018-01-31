import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire2Page } from '../questionnaire2/questionnaire2';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Storage } from '@ionic/storage';
import { ShareProvider } from '../../providers/share/share';

@Component({
    selector: 'page-questionnaire1',
    templateUrl: 'questionnaire1.html'


})
export class Questionnaire1Page {

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    choices: string[] = [
        'Outdoors:  Growing and harvesting',
        'Indoors: Portioning and packing vegetables',
        'DIY annd improving infrastructure',
        'Supporting others (social/therapeutic horticulture)',
        'Supporting events and markets',
        'Other',
    ];

    responses: boolean[];
    response_text = '';

    question_id: number = 0;
    question_text: string = '';


    constructor(public navCtrl: NavController,
        private alertController: AlertController,
        private shareprovider: ShareProvider,
        private sqlitedatabase: sqlitedatabase,
        private storage: Storage) {
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; })

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

    }

    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data. 
 */
    getQuestion() {
        this.sqlitedatabase.getQuestion(1)
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
            let input_text = this.response_text;
            console.log("responses:" + this.responses);
            let selected = this.responses
                .map(function (x, i) {
                    if (x) {
                        if (i < all_choices.length - 1)
                            return all_choices[i];
                        else
                            return input_text;
                    }
                }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();

            //this.sqlitedatabase.insertCachedAnswers(0);

            this.navCtrl.push(Questionnaire2Page);
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
        this.shareprovider.deleteItemFromRegistration('emergency_name');
        this.shareprovider.deleteItemFromRegistration('emergency_telephone');
        this.shareprovider.deleteItemFromRegistration('emergency_relationship');
        this.navCtrl.pop();
    }






}
