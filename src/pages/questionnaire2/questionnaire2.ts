  import { Component } from '@angular/core';
  import { NavController, AlertController } from 'ionic-angular';
  import { HomepagePage } from '../homepage/homepage';
  import { Questionnaire3Page } from '../questionnaire3/questionnaire3';
  import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
  import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';
  
 
@Component({
  selector: 'page-questionnaire2',
  templateUrl: 'questionnaire2.html'


})
export class Questionnaire2Page {
    answer1 : boolean;
    answer2  : boolean;
    answer3  : boolean;
    answer4  : boolean;
    answer5  : boolean;
    answer6  : boolean;
    answer7 : boolean;
    answer7Text='';
    answers: any[];
  
   
  
    constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
    }
    
    goToHomepage(){
      this.navCtrl.push(HomepagePage);
    }
    goBack(){
      this.navCtrl.pop();
    }
    
    goQuestionnaire3(){
    
      if(this.answer1||this.answer2||this.answer3||this.answer4||this.answer5||this.answer6||this.answer7){
        this.addData();
      this.navCtrl.push(Questionnaire3Page);
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
            this.questionnairedb.db.executeSql('insert into Question2 (ID, Field1,Field2,Field3,Field4,Field5,Field6) values (?,?,?,?,?,?,?)', [id,binaryAnswers[0], binaryAnswers[1], binaryAnswers[2], binaryAnswers[3], binaryAnswers[4], binaryAnswers[5]]) 
            .then(() => {
              console.log("Binary values added");})
              .catch(e => console.log(e));
            
                if(this.answer7){
                  this.questionnairedb.db.executeSql('insert into Question1 (Other) values (?)',this.answer7Text ) 
                    .then(() => {
                      console.log("Registration data added");})
                      .catch(e => console.log(e));  
                    } 
  
            
    }
  
  
  }
  