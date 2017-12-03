import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire7Page } from '../questionnaire7/questionnaire7';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-questionnaire6',
  templateUrl: 'questionnaire6.html',
})
export class Questionnaire6Page {

  informationInput='';

  
   
  
    constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
    }
    
    goToHomepage(){
      this.navCtrl.push(HomepagePage);
    }
    goBack(){
      this.navCtrl.pop();
    }
    
    goQuestionnaire7(){
      var id= this.questionnairedb.getID();
                  this.questionnairedb.db.executeSql('insert into Question6 (ID, Field1) values (?,?)',[id,this.informationInput]) 
                    .then(() => {
                      console.log("Further information added");})
                      .catch(e => console.log(e));  
    
    }
  
  
  }
  