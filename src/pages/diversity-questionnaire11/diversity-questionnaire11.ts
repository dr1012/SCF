import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { HomepagePage } from '../homepage/homepage';
import { DiversityQuestionnaire10Page } from '../diversity-questionnaire10/diversity-questionnaire10';

@IonicPage()
@Component({
  selector: 'page-diversity-questionnaire11',
  templateUrl: 'diversity-questionnaire11.html',
})
export class DiversityQuestionnaire11Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiversityQuestionnaire11Page');
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }

  goBack(){
    this.navCtrl.push(DiversityQuestionnaire10Page);
  }

}
