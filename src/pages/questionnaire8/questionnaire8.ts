import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire9Page } from '../questionnaire9/questionnaire9';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';

@Component({
  selector: 'page-questionnaire8',
  templateUrl: 'questionnaire8.html'


})
export class Questionnaire8Page {
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
  
  goQuestionnaire9(){
  
    if(this.answer1||this.answer2){
      this.addData();
    this.navCtrl.push(Questionnaire9Page);
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
          
          this.questionnairedb.db.executeSql('insert into Question8 (ID,Field1) values (?,?)', [id, binaryAnswers]) 
          .then(() => {
            console.log("Binary values added");})
            .catch(e => console.log(e));

          
  }


}
