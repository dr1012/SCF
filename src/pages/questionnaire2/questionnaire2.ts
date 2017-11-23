import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire3Page } from '../questionnaire3/questionnaire3';



@Component({
  selector: 'page-questionnaire2',
  templateUrl: 'questionnaire2.html'


})
export class Questionnaire2Page {



  constructor(public navCtrl: NavController,  private alertController: AlertController ) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  goQuestionnaire3(){
    this.navCtrl.push(Questionnaire3Page);
  }


}
