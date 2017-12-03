import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire11Page } from '../questionnaire11/questionnaire11';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { QuestionnaireDatabaseProvider } from '../../providers/questionnaire-database/questionnaire-database';


@Component({
  selector: 'page-questionnaire10',
  templateUrl: 'questionnaire10.html',
})
export class Questionnaire10Page {

  informationInput='';

  
   
  
    constructor(public navCtrl: NavController,  private alertController: AlertController, private sqlitedatabase :sqlitedatabase, private questionnairedb: QuestionnaireDatabaseProvider ) {
    }
    
    goToHomepage(){
      this.navCtrl.push(HomepagePage);
    }
    goBack(){
      this.navCtrl.pop();
    }
    
    goQuestionnaire11(){
      var id= this.questionnairedb.getID();
                  this.questionnairedb.db.executeSql('insert into Question10 (ID, Field1) values (?,?)',[id,this.informationInput]) 
                    .then(() => {
                      console.log("Further information added");})
                      .catch(e => console.log(e));  
    
    }
  
  
  }
  