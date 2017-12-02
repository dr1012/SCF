import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire2Page } from '../questionnaire2/questionnaire2';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase'


@Component({
  selector: 'page-questionnaire1',
  templateUrl: 'questionnaire1.html'


})
export class Questionnaire1Page {
  answer1 = 'false';
  answer2 = 'false';
  answer3 = 'false';
  answer4 = 'false';
  answer5 = 'false';
  answer6 = 'false';
  answers: any[];
  answerList: string ='';
  question1: string = 'Growing and harvesting';
  question2: string = 'Packing vegetables';
  question3: string = 'Supporting administration';
  question4: string = 'DIY improving infrastructure';
  question5: string = 'Supporting others';
  question6: string = 'Supporting events and markets';
  question7: string ='';
  modelList: string[];

  constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase  ) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  /*
  goQuestionnaire2(){
   this.modelList= [this.question1, this.question2, this.question3, this.question4, this.question5, this.question6, this.question7];
    this.answers=[this.answer1, this.answer2, this.answer3, this.answer4, this.answer5, this.answer6];
    if(this.answer1||this.answer2||this.answer3||this.answer4||this.answer5||this.answer6){
      for(var i =0; i<this.answers.length; i++){
        if(this.answers[i]){
          this.answerList = this.answerList + 
          this.sqlitedatabase.db.executeSql('insert into Questionnaire_Answers (Question1) VALUES(\''+this.answers[i]+'\')  ', {})
          .then(() => console.log('Questionnaire data added'))
          .catch(e => console.log(e));
        }
      }

    this.navCtrl.push(Questionnaire2Page);
    }
    else{
      let addTodoAlert=this.alertController.create({ 
        message: "Please select at least one option"
      });
      addTodoAlert.present();
    }
  }*/


}
