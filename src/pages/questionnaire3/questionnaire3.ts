import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire4Page } from '../questionnaire4/questionnaire4';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';



@Component({
  selector: 'page-questionnaire3',
  templateUrl: 'questionnaire3.html',
})
export class Questionnaire3Page {

    choices: string[] = [
        'I often take the initiative and enjoy having responsibility',
        'Some tasks may not be appropriate for me (e.g. delicate jobs, very hard labour)',
        'I am comfortable working independently with minimal instruction',
        'Once I build my confidence and knowledge, I am able to work independently with minimal instruction',
        'I would always like to work with someone who can support me',
        'I need one-to-one support at all times'
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
        this.sqlitedatabase.getQuestion(3)
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

            this.navCtrl.push(Questionnaire4Page);
        }
        else{
            let addTodoAlert=this.alertController.create({ 
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    }


    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }



    /* Not used anymore */

    answer1 : boolean;
    answer2 : boolean;
    answer3 : boolean;
    answer4 : boolean;
    answer5 : boolean;
    answer6 : boolean;
    answers: any[];
    
    goQuestionnaire4(){
    
      if(this.answer1||this.answer2||this.answer3||this.answer4||this.answer5||this.answer6){
        this.addData();
      this.navCtrl.push(Questionnaire4Page);
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
            let binaryAnswers=[];
            this.answers = [this.answer1, this.answer2, this.answer3, this.answer4, this.answer5, this.answer6];
            for(var i=0; i<this.answers.length; i++){
              if(this.answers[i]){
                binaryAnswers[i] = 1;
              }
              else{
                binaryAnswers[i] = 0;
              }
            }
            this.questionnairedb.db.executeSql('insert into Question3 (ID, Field1,Field2,Field3,Field4,Field5,Field6) values (?,?,?,?,?,?,?)', [id,binaryAnswers[0], binaryAnswers[1], binaryAnswers[2], binaryAnswers[3], binaryAnswers[4], binaryAnswers[5]]) 
            .then(() => {
              console.log("Binary values added");})
              .catch(e => console.log(e));
            
        
  
            
    }
  
  
  }
  