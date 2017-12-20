import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire11Page } from '../questionnaire11/questionnaire11';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-questionnaire10',
  templateUrl: 'questionnaire10.html',
})
export class Questionnaire10Page {

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
        this.sqlitedatabase.getQuestion(8)
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
        this.navCtrl.push(Questionnaire11Page);
    }

    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }


    /* Not used anymore */

    informationInput='';

    goQuestionnaire11(){
      var id= this.questionnairedb.getID();
                  this.questionnairedb.db.executeSql('insert into Question10 (ID, Field1) values (?,?)',[id,this.informationInput]) 
                    .then(() => {
                      console.log("Further information added");})
                      .catch(e => console.log(e));
                      this.navCtrl.push(Questionnaire11Page);  
    
    }
  
  
  }
  