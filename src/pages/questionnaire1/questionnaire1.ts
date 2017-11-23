import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire2Page } from '../questionnaire2/questionnaire2';



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


  constructor(public navCtrl: NavController,  private alertController: AlertController ) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  goQuestionnaire2(){
    if(this.answer1||this.answer2||this.answer3||this.answer4||this.answer5||this.answer6){
    this.navCtrl.push(Questionnaire2Page);
    }
    else{
      let addTodoAlert=this.alertController.create({ 
        message: "Please select at least one option"
      });
      addTodoAlert.present();
    }
  }


}
