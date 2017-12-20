import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DiversityQuestionnaire1Page } from '../diversity-questionnaire1/diversity-questionnaire1';
import { LoginPage } from '../login/login';
import { HomepagePage } from '../homepage/homepage';


@IonicPage()
@Component({
  selector: 'page-diversity-questionnaire0',
  templateUrl: 'diversity-questionnaire0.html',
})
export class DiversityQuestionnaire0Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiversityQuestionnaire0Page');
  }

  goToDiversityQuestionnaire1() {
    this.navCtrl.push(DiversityQuestionnaire1Page);
}

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }

  goBack(){
    this.navCtrl.push(LoginPage);
  }

}
