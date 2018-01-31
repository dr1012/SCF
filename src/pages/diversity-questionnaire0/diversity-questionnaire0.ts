import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { DiversityQuestionnaire1Page } from '../diversity-questionnaire1/diversity-questionnaire1';
import { LoginPage } from '../login/login';
import { HomepagePage } from '../homepage/homepage';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-diversity-questionnaire0',
  templateUrl: 'diversity-questionnaire0.html',
})
export class DiversityQuestionnaire0Page {

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, private storage: Storage, private sqlitedatabase: sqlitedatabase) {

    /**
      * This is the logic that assigns the desired background, chosen in
      * admin-app-settings.ts, to the background of the current page.
      */
    var promise1 = this.storage.get('wallpaperToggle'); //
    promise1.then(wallpaperID => {
      console.log(wallpaperID);

      if (wallpaperID == "autumn") {
        this.winter = false;
        this.summer = false;
        this.autumn = true;
        this.spring = false;
      } else if (wallpaperID == "summer") {
        this.winter = false;
        this.summer = true;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "winter") {
        this.winter = true;
        this.summer = false;
        this.autumn = false;
        this.spring = false;
      } else if (wallpaperID == "spring") {
        this.winter = false;
        this.summer = false;
        this.autumn = false;
        this.spring = true;
      }

    });
  }


  /**
   * This method takes the user to the DiversityQuestionnaire1Page page.
   */
  goToDiversityQuestionnaire1() {
    this.navCtrl.push(DiversityQuestionnaire1Page);
  }

  /**
   * This method takes the user to the HomepagePage page.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
 * This method takes the user to the LoginPage page.
 */
  goBack() {
    this.sqlitedatabase.clearAnswerCache(9);
    this.navCtrl.push(LoginPage);
  }

}
