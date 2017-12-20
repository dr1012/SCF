import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire10Page } from '../questionnaire10/questionnaire10';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';

@Component({
  selector: 'page-questionnaire9',
  templateUrl: 'questionnaire9.html'


})
export class Questionnaire9Page {


    choices: string[] = [
        'I don\'t mind',
        'No thank you'
    ];

    responses:boolean[];
    response_text = '';

    question_id:number = 0;
    question_text:string = '';


    constructor(public navCtrl: NavController,  
        private alertController: AlertController, 
        private sqlitedatabase :sqlitedatabase, 
        private questionnairedb: QuestionnaireDatabaseProvider ) {
        this.getQuestion();
        this.responses = this.choices.map(function(x,i){ return false; })

    }

    getQuestion(){
        this.sqlitedatabase.getQuestion(7)
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
        if(this.responses.indexOf(true) > -1){
            let all_choices = this.choices;
            let input_text = this.response_text;
            console.log("responses:"+this.responses);
            let selected = this.responses
                            .map(function(x, i){
                                if(x){ return all_choices[i]; }
                            }).filter(function(x, i) { return x!= null;});
            console.log("selected:"+selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();

            //this.sqlitedatabase.insertCachedAnswers(0);

            this.navCtrl.push(Questionnaire10Page);
        }
        else{
            let addTodoAlert=this.alertController.create({ 
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    }

    selectOnly(i:number){
        console.log("selected number index:"+i);
        this.responses = this.responses.map(function(x, index) { return i==index; });
    }

    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }

  /* Not used anymore */
  answer1  : boolean;
  answer2  : boolean;
  answers: any[];
  
  goQuestionnaire10(){
  
    if(this.answer1||this.answer2){
      this.addData();
    this.navCtrl.push(Questionnaire10Page);
    }
    else{
      let addTodoAlert=this.alertController.create({ 
        message: "Please select at least one option"
      });
      addTodoAlert.present();
    }
  }

  addData(): void{
           var id= this.questionnairedb.getID();
          let binaryAnswers;
          this.answers = [this.answer1, this.answer2];
            if(this.answers[0]){
              binaryAnswers = 1;
            }
            else{
              binaryAnswers = 0;
            }
          
          this.questionnairedb.db.executeSql('insert into Question9 (ID,Field1) values (?,?)', [id, binaryAnswers]) 
          .then(() => {
            console.log("Binary values added");})
            .catch(e => console.log(e));

          
  }


}
