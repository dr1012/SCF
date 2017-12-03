import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire5Page } from '../questionnaire5/questionnaire5';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-questionnaire4',
  templateUrl: 'questionnaire4.html',
})
export class Questionnaire4Page {

  informationInput='';

  
   
  
    constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
    }
    
    goToHomepage(){
      this.navCtrl.push(HomepagePage);
    }
    goBack(){
      this.navCtrl.pop();
    }
    
    goQuestionnaire5(){
                   var id= this.questionnairedb.getID();
                  this.questionnairedb.db.executeSql('insert into Question4 (ID, Field1) values (?,?)',[id, this.informationInput]) 
                    .then(() => {
                      console.log("Further information added");})
                      .catch(e => console.log(e));  
    
    }
  
  
  }
  