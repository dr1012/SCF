import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire6Page } from '../questionnaire6/questionnaire6';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
    selector: 'page-questionnaire4',
    templateUrl: 'questionnaire4.html',
})
export class Questionnaire4Page {

    response_text = '';

    question_id:number = 0;
    question_text:string = '';


    constructor(public navCtrl: NavController,  
        private alertController: AlertController, 
        private sqlitedatabase :sqlitedatabase, 
        private questionnairedb: QuestionnaireDatabaseProvider ) {
        this.getQuestion();
    }

    getQuestion(){
        this.sqlitedatabase.getQuestion(4)
        .then((data) => {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                this.question_id = data.rows.item(0).id;
                this.question_text = data.rows.item(0).question_text;
                console.log('question:'+this.question_text);
            }
        }, err => {
            console.log('Error: ', err);
        }); 
    }

    goNext(){
        this.sqlitedatabase.addToAnswerCache(this.question_id, [ this.response_text ]);
        this.sqlitedatabase.logAnswerCache();
        //this.sqlitedatabase.insertCachedAnswers(0);
        this.navCtrl.push(Questionnaire6Page);
    }

    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }


   


}
