import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';
import { AdminPage } from '../admin/admin';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, private sqlitedatabase: sqlitedatabase,
    private storage: Storage) {

    /**
      * This is the logic that assigns the desired background, chosen in
      * admin-app-settings.ts, to the background of the current page.
      */
    var promise1 = this.storage.get('wallpaperToggle');
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
   * This method takes the user to the LoginPage page. 
   */
  goToLogin() {
    this.logStats();
    this.navCtrl.push(LoginPage);

  }

  /**
     * This method takes the user to the Regist0Page page. 
     */
  goToRegister0() {
    this.navCtrl.push(Register0Page);
  }
  /**
   * This method takes the user to the LogoutPage page. 
   */
  goToLogout() {
    this.navCtrl.push(LogoutPage);
  }

  /**
   * This method takes the user to the AdminPage page. 
   */
  goToAdmin() {
    this.navCtrl.push(AdminPage);
  }


  /**
   * This method is used in debugging and prints out all the data contained within the local database to the console. 
   */
  logStats() {




    // listAnswerStats(question_id) returns a promise  of array of stats 
    // for all questions. To use the result wrap it inside then()
    this.sqlitedatabase.listAllStatsNoCount().then((stats) => {
      console.log("listAllStatsNoCount");
      console.log(JSON.stringify(stats));
    });


    this.sqlitedatabase.listAllRegistration().then((stats) => {
      console.log("list all registrations");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllDiversityNoCount().then((stats) => {
      console.log("list all diversity");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listAllLog().then((stats) => {
      console.log("list all login logout");
      console.log(JSON.stringify(stats));
    });

    this.sqlitedatabase.listLastSync().then((stats) => {
      console.log("list last sync");
      console.log(JSON.stringify(stats));
    });

  }



}
