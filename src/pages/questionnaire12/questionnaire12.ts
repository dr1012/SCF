import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
selector: 'page-questionnaire12',
templateUrl: 'questionnaire12.html'


})
export class Questionnaire12Page {
  answer1  : boolean;
  answer2  : boolean;
  answer3  : boolean;
  answer4  : boolean;
  answers: any[];

 

  constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  
  Finish(){
  
    
      this.addData();
    this.goToHomepage();
    
  }

  addData(): void{
    var id= this.questionnairedb.getID();
          let binaryAnswers=[];
          this.answers = [this.answer1, this.answer2, this.answer3, this.answer4];
          for(var i=0; i<this.answers.length; i++){
            if(this.answers[i]){
              binaryAnswers[i] = 1;
            }
            else{
              binaryAnswers[i] = 0;
            }
          }
          this.questionnairedb.db.executeSql('insert into Question12 (ID, Field1,Field2,Field3,Field4) values (?,?,?,?,?)', [id,binaryAnswers[0], binaryAnswers[1], binaryAnswers[2], binaryAnswers[3]]) 
          .then(() => {
            console.log("Binary values added");})
            .catch(e => console.log(e));
          

          
  }


}
