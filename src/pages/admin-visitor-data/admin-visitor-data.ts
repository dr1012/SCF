import { Component } from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { AdminHomePage } from '../admin-home/admin-home';
import { Graph1Page } from '../graph1/graph1';
import { Graph2Page } from '../graph2/graph2';
import { Graph3Page } from '../graph3/graph3';
import { Graph4Page } from '../graph4/graph4';
import { GraphScatter1Page } from '../graph-scatter1/graph-scatter1';
import { GraphScatter2Page } from '../graph-scatter2/graph-scatter2';
import { GraphScatter3Page } from '../graph-scatter3/graph-scatter3';
import { GraphScatter4Page } from '../graph-scatter4/graph-scatter4';
import { GraphScatter5Page } from '../graph-scatter5/graph-scatter5';
import { GraphPie2Page } from '../graph-pie2/graph-pie2';
import { GraphPie3Page } from '../graph-pie3/graph-pie3';
import { GraphPie4Page } from '../graph-pie4/graph-pie4';
import { GraphPie5Page } from '../graph-pie5/graph-pie5';
import { GraphBar1Page } from '../graph-bar1/graph-bar1';
import { GraphBar2Page } from '../graph-bar2/graph-bar2';
import { GraphBar3Page } from '../graph-bar3/graph-bar3';
import { GraphBar4Page } from '../graph-bar4/graph-bar4';
import { GraphBar5Page } from '../graph-bar5/graph-bar5';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-admin-visitor-data',
  templateUrl: 'admin-visitor-data.html',
})

export class AdminVisitorDataPage {

  toggled: boolean = false;

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {

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
   * Method returns the administrator to the homepage, effectively 'logging' them out.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
   * Method returns admin to the admin homepage
   */
  goToAdminHome() {
    this.navCtrl.push(AdminHomePage);
  }


  /**
   * Methods for Graph 1
   */
  goToGraph1() {
    this.navCtrl.push(Graph1Page);
  }

  goToGraph2() {
    this.navCtrl.push(Graph2Page);
  }

  goToGraph4() {
    this.navCtrl.push(Graph4Page);
  }


  /**
   * Methods for Graph 2
   */
  goToGraphScatter1() {
    this.navCtrl.push(GraphScatter1Page);
  }
  goToGraph3() {
    this.navCtrl.push(Graph3Page);
  }
  goToGraphBar1() {
    this.navCtrl.push(GraphBar1Page);
  }

  /**
   * Methods for Graph 3
   */
  goToGraphScatter2() {
    this.navCtrl.push(GraphScatter2Page);
  }
  goToGraphPie2() {
    this.navCtrl.push(GraphPie2Page);
  }
  goToGraphBar2() {
    this.navCtrl.push(GraphBar2Page);
  }

  /**
   * Methods for Graph 4
   */
  goToGraphScatter3() {
    this.navCtrl.push(GraphScatter3Page);
  }
  goToGraphPie3() {
    this.navCtrl.push(GraphPie3Page);
  }
  goToGraphBar3() {
    this.navCtrl.push(GraphBar3Page);
  }

  /**
   * Methods for Graph 5
   */
  goToGraphScatter4() {
    this.navCtrl.push(GraphScatter4Page);
  }
  goToGraphPie4() {
    this.navCtrl.push(GraphPie4Page);
  }
  goToGraphBar4() {
    this.navCtrl.push(GraphBar4Page);
  }

  /**
   * Methods for Graph 6
   */
  goToGraphScatter5() {
    this.navCtrl.push(GraphScatter5Page);
  }
  goToGraphPie5() {
    this.navCtrl.push(GraphPie5Page);
  }
  goToGraphBar5() {
    this.navCtrl.push(GraphBar5Page);
  }

}
