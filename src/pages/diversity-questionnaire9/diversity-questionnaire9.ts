import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';


import { HomepagePage } from '../homepage/homepage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@IonicPage()
@Component({
  selector: 'page-diversity-questionnaire9',
  templateUrl: 'diversity-questionnaire9.html',
})
export class DiversityQuestionnaire9Page {

  
      response_text = '';
  
      question_id:number = 0;
      question_text:string = '';
  
  
      constructor(public navCtrl: NavController,  
        private alertController: AlertController, 
        private sqlitedatabase :sqlitedatabase, 
        private questionnairedb: QuestionnaireDatabaseProvider ) {
        this.getDiversityQuestion();
    
    }
  
      getDiversityQuestion(){
          this.sqlitedatabase.getDiversityQuestion(9)
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
          this.sqlitedatabase.addToDiversityCache(this.question_id, [this.response_text])
          this.sqlitedatabase.logDiversityCache();
          this.sqlitedatabase.insertDiversityCache();

          
          let successAlert=this.alertController.create({ 
            message: "Thank you for filling up the questionnaires.\
             Your responses are carefully saved."
        });
        successAlert.present();
        this.navCtrl.push(HomepagePage);
    
      }
  
      goToHomepage(){
          this.navCtrl.push(HomepagePage);
      }
  
      goBack(){
          this.navCtrl.pop();
      }
  
  
    
    
    }
    