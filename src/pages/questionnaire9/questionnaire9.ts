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
  answer1  : boolean;
  answer2  : boolean;
  answers: any[];
  

 

  constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
  }


  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  
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
