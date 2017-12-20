import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DiversityQuestionnaire11Page } from '../diversity-questionnaire11/diversity-questionnaire11';
import { HomepagePage } from '../homepage/homepage';
import { DiversityQuestionnaire9Page } from '../diversity-questionnaire9/diversity-questionnaire9';

@IonicPage()
@Component({
  selector: 'page-diversity-questionnaire10',
  templateUrl: 'diversity-questionnaire10.html',
})
export class DiversityQuestionnaire10Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiversityQuestionnaire10Page');
  }

  goToDiversityQuestionnaire11() {
    this.navCtrl.push(DiversityQuestionnaire11Page);
}

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }

  goBack(){
    this.navCtrl.push(DiversityQuestionnaire9Page);
  }

}
