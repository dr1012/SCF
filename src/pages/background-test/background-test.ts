import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';


@IonicPage()
@Component({
  selector: 'page-background-test',
  templateUrl: 'background-test.html',
})
export class BackgroundTestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BackgroundTestPage');
  }

 

}
