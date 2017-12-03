import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire6Page } from '../questionnaire6/questionnaire6';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-questionnaire5',
  templateUrl: 'questionnaire5.html',
})
export class Questionnaire5Page {

  informationInput='';

  
   
  
    constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
    }
    
    goToHomepage(){
      this.navCtrl.push(HomepagePage);
    }
    goBack(){
      this.navCtrl.pop();
    }
    
    goQuestionnaire6(){
      var id= this.questionnairedb.getID();
                  this.questionnairedb.db.executeSql('insert into Question5 (ID,Field1) values (?,?)',[id,this.informationInput]) 
                    .then(() => {
                      console.log("Further information added");})
                      .catch(e => console.log(e));  
    
    }
  
  
  }
  