import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire8Page } from '../questionnaire8/questionnaire8';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';

@Component({
  selector: 'page-questionnaire7',
  templateUrl: 'questionnaire7.html'


})
export class Questionnaire7Page {
  answer1  : boolean;
  answer2  : boolean;
  answer3  : boolean;
  answer4 : boolean;
  answer4Text='';
  answers: any[];
  

 

  constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
  }


  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  
  goQuestionnaire8(){
  
    if(this.answer1||this.answer2||this.answer3||this.answer4){
      this.addData();
    this.navCtrl.push(Questionnaire8Page);
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
          this.answers = [this.answer1, this.answer2, this.answer3];
          for(var i=0; i<this.answers.length; i++){
            if(this.answers[i]){
              binaryAnswers[i] = 1;
            }
            else{
              binaryAnswers[i] = 0;
            }
          }
          this.questionnairedb.db.executeSql('insert into Question7 (ID,Field1,Field2, Field3) values (?,?,?,?)', [id, binaryAnswers[0], binaryAnswers[1], binaryAnswers[2], binaryAnswers[3]]) 
          .then(() => {
            console.log("Binary values added");})
            .catch(e => console.log(e));
          if(this.answer4){
          this.questionnairedb.db.executeSql('insert into Question7 (Other) values (?)',this.answer4Text ) 
            .then(() => {
              console.log("Registration data added");})
              .catch(e => console.log(e));  
            }

          
  }


}
