import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import { Chart } from 'chart.js';
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { GraphPie5Page } from '../graph-pie5/graph-pie5';
import { GraphScatter5Page } from '../graph-scatter5/graph-scatter5';
import { Storage } from '@ionic/storage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */


@Component({
  selector: 'page-graph-bar5',
  templateUrl: 'graph-bar5.html',
})
export class GraphBar5Page {

  wallpaperID: string;
  winter: boolean = true; //default
  summer: boolean = false;
  autumn: boolean = false;
  spring: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private sqlitedatabase: sqlitedatabase) {

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

    this.getDiffNumberOfVisitsPerYear();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphBar5Page');
  }

  /**
   * This method opens the homepage.
   */
  goToHomepage() {
    this.navCtrl.push(HomepagePage);
  }

  /**
   * This method takes user back to list of all graphs
   */
  goToAdminVisitorData() {
    this.navCtrl.push(AdminVisitorDataPage);
  }

  /**
  * Methods below take user to different forms of the same graph 
  */
  goToGraphScatter5() {
    this.navCtrl.push(GraphScatter5Page);
  }

  goToGraphPie5() {
    this.navCtrl.push(GraphPie5Page);
  }

  /**
  * Chart methodology starts here
  */
  chart_colors: any[] = [
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 102, 178, 0.5)',
    'rgba(0, 0, 204, 0.5)',
    'rgba(204, 153, 255, 0.5)',
    'rgba(153, 204, 255, 0.5)',
    'rgba(255, 204, 204, 0.5)',
    'rgba(255, 51, 51, 0.5)',
    'rgba(102, 204, 0, 0.5)'
  ];
  hover_colors: any[] = ['rgba(255, 255, 0, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 102, 178, 0.5)',
    'rgba(0, 0, 204, 0.5)',
    'rgba(204, 153, 255, 0.5)',
    'rgba(153, 204, 255, 0.5)',
    'rgba(255, 204, 204, 0.5)',
    'rgba(255, 51, 51, 0.5)',
    'rgba(102, 204, 0, 0.5)'
  ];


  @ViewChild('barChart') barChart;


  public maxValue;
  public answers: any = [];
  public pieChartEl: any;
  public barChartEl: any;
  public lineChartEl: any;
  public chartLabels: any = [];
  public chartValues: any = [];
  public chartColours: any = [];
  public chartHoverColours: any = [];
  public chartLoadingEl: any;

  /**
    * Methods calculates the total number of visitors to the farm for each of the last 12 months
    * and gives a breakdown of the frequency of returning visitors. There are 7 categories: 
    * "1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits" , "21-24 visits", "25+ visits"
    * Charts are all dynamic to new data.
    */
  getDiffNumberOfVisitsPerYear() {
    console.log("Getting total number of unique visits per month")

    this.sqlitedatabase.listLoginDetailsForGraphs()
      .then((stats) => {

        console.log("Number of visits (total): " + stats.length);

        var maxYear = 0;
        var maxMonth = 0;
        for (var j = 0; j < stats.length; j++) {
          var currentDateHandled = new Date(stats[j].login_time);
          var currentDateInfoArray = currentDateHandled.toString().split(" ");
          var currentYear = currentDateInfoArray[3];

          if (maxYear < parseInt(currentYear)) {
            maxYear = parseInt(currentYear); //Finds the most recent year	
          }
        }
        for (j = 0; j < stats.length; j++) {
          currentDateHandled = new Date(stats[j].login_time);

          //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
          currentDateInfoArray = currentDateHandled.toString().split(" ");
          currentYear = currentDateInfoArray[3];
          var currentMonth = currentDateInfoArray[1];
          var currentMonthInt = 0;

          if (currentMonth == 'Jan') {
            currentMonthInt = 1;
          } else if (currentMonth == 'Feb') {
            currentMonthInt = 2;
          } else if (currentMonth == 'Mar') {
            currentMonthInt = 3;
          } else if (currentMonth == 'Apr') {
            currentMonthInt = 4;
          } else if (currentMonth == 'May') {
            currentMonthInt = 5;
          } else if (currentMonth == 'Jun') {
            currentMonthInt = 6;
          } else if (currentMonth == 'Jul') {
            currentMonthInt = 7;
          } else if (currentMonth == 'Aug') {
            currentMonthInt = 8;
          } else if (currentMonth == 'Sep') {
            currentMonthInt = 9;
          } else if (currentMonth == 'Oct') {
            currentMonthInt = 10;
          } else if (currentMonth == 'Nov') {
            currentMonthInt = 11;
          } else if (currentMonth == 'Dec') {
            currentMonthInt = 12;
          }

          if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
            maxMonth = currentMonthInt;
          }

        } //Here ends the first for loop

        let monthMatchingArray = [] //This will also have a length of 12
        let visitsArrayPerMonth = [] //holds every user ID for the last 12 months

        var currentMonthMaster = maxMonth + 1;
        var currentYearMaster = maxYear;

        for (var a = 0; a < 12; ++a) {


          currentMonthMaster = currentMonthMaster - 1;
          if (currentMonthMaster === 0) {
            currentMonthMaster = 12;
            currentYearMaster = maxYear - 1;
          }

          monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);


          //Now the unique visit logic starts here
          for (var i = 0; i < stats.length; ++i) {

            currentDateHandled = new Date(stats[i].login_time);
            //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
            currentDateInfoArray = currentDateHandled.toString().split(" ");
            currentYear = currentDateInfoArray[3];
            currentMonth = currentDateInfoArray[1];
            currentMonthInt = 0;

            if (currentMonth == 'Jan') {
              currentMonthInt = 1;
            } else if (currentMonth == 'Feb') {
              currentMonthInt = 2;
            } else if (currentMonth == 'Mar') {
              currentMonthInt = 3;
            } else if (currentMonth == 'Apr') {
              currentMonthInt = 4;
            } else if (currentMonth == 'May') {
              currentMonthInt = 5;
            } else if (currentMonth == 'Jun') {
              currentMonthInt = 6;
            } else if (currentMonth == 'Jul') {
              currentMonthInt = 7;
            } else if (currentMonth == 'Aug') {
              currentMonthInt = 8;
            } else if (currentMonth == 'Sep') {
              currentMonthInt = 9;
            } else if (currentMonth == 'Oct') {
              currentMonthInt = 10;
            } else if (currentMonth == 'Nov') {
              currentMonthInt = 11;
            } else if (currentMonth == 'Dec') {
              currentMonthInt = 12;
            }

            if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
              //Gives a list of all the userIDs that have logged in for the given month
              var currentUserID = stats[i].user_id;
              visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
            }

          }

        }


        let numberOfVisitsArray = ["1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits", "21-24 visits", "25+ visits"]
        let previouslyCountedIDs = []
        var counter14 = 0;
        var counter58 = 0;
        var counter912 = 0;
        var counter1316 = 0;
        var counter1720 = 0;
        var counter2124 = 0;
        var counter25 = 0;

        // Here is where we determine the tallys for each strata
        for (i = 0; i < visitsArrayPerMonth.length; i++) {
          var counter = 0;
          var currentIDForCounting = visitsArrayPerMonth[i];
          var booleanCheck = 0; //Resets to 0 after each iteration
          console.log("Flag");

          for (var b = 0; b < previouslyCountedIDs.length; b++) {
            if (previouslyCountedIDs[b] === currentIDForCounting) {
              booleanCheck = 1;
              break;
            }
          }

          if (booleanCheck === 0) {  //Boolean cheack for if the currentIDForCounting has already been counted, if it has, it is bypassed
            for (j = 0; j < visitsArrayPerMonth.length; j++) {
              console.log("currentIDForCounting: " + currentIDForCounting + ", visitsArrayPerMonth[j]: " + visitsArrayPerMonth[j])
              if (currentIDForCounting === visitsArrayPerMonth[j]) { //Boolean Check here to ensure same number not used twice
                counter++;
              }
            }

            console.log("currentIDForCounting: " + currentIDForCounting + " Visited: " + counter + "times")
            //Then works out which category the userID belongs to
            if (counter < 5) {
              counter14++;
            } else if (counter < 9 && counter > 4) {
              counter58++;
            } else if (counter < 13 && counter > 8) {
              counter912++;
            } else if (counter < 17 && counter > 12) {
              counter1316++;
            } else if (counter < 21 && counter > 16) {
              counter1720++;
            } else if (counter < 25 && counter > 20) {
              counter2124++;
            } else if (counter > 24) {
              counter25++;
            }

            previouslyCountedIDs.push(currentIDForCounting);// adds the id to an array so that it isn't counted more than once

          }
        }

        let tallyArray = [counter14, counter58, counter912, counter1316, counter1720, counter2124, counter25] //This will have a length of 7

        //Determining the max y-axis limits for the graph
        for (var d = 0; d < tallyArray.length; ++d) {
          if (d === 0) {
            this.maxValue = tallyArray[d];
          } else if (this.maxValue < tallyArray[d]) {
            this.maxValue = tallyArray[d];

          }
        }

        //Pushing the values and labels required to the graph
        for (d = 0; d < tallyArray.length; d++) {
          console.log("Tally array: " + tallyArray[d]);
          this.chartLabels.push(numberOfVisitsArray[d]);
          this.chartValues.push(tallyArray[d]);
          this.chartColours.push(this.chart_colors[d]);
          this.chartHoverColours.push(this.hover_colors[d]);
        }
        console.log(this.chartValues)
        this.createBarChart();

      }
      , err => {
        console.log("something went wrong on retrieving login history");
      });
  }

  /**
   * Methods takes the data defined and creates a chart
   */
  createBarChart(): void {
    this.barChartEl = new Chart(this.barChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Number of Individuals That Visited',
            data: this.chartValues,
            duration: 2000,
            easing: 'easeInQuart',
            backgroundColor: this.chartColours,
            hoverBackgroundColor: this.chartHoverColours
          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: true,
            boxWidth: 80,
            fontSize: 15,
            padding: 0
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: Math.floor(this.maxValue / 10),
                max: this.maxValue + 2
              }
            }],
            xAxes: [{
              ticks: {
                autoSkip: false
              }
            }]
          }
        }
      });
  }
}
