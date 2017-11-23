import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Questionnaire1Page } from '../questionnaire1/questionnaire1';


@Component({
  selector: 'page-questionnaire0',
  templateUrl: 'questionnaire0.html'

})
export class Questionnaire0Page {



  constructor(public navCtrl: NavController,  private alertController: AlertController ) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  goquestion1(){
    this.navCtrl.push(Questionnaire1Page);
  }
  backhomepage(){
    this.navCtrl.push(HomepagePage);
  }


}
