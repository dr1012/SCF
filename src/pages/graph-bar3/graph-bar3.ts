import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import { Chart } from 'chart.js';
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { GraphPie3Page } from '../graph-pie3/graph-pie3';
import { GraphScatter3Page } from '../graph-scatter3/graph-scatter3';
import { Storage } from '@ionic/storage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */

@Component({
  selector: 'page-graph-bar3',
  templateUrl: 'graph-bar3.html',
})
export class GraphBar3Page {

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

    this.getUniqueVisitsPerMonth();
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
  goToGraphScatter3() {
    this.navCtrl.push(GraphScatter3Page);
  }

  goToGraphPie3() {
    this.navCtrl.push(GraphPie3Page);
  }


  /**
    * Chart methodology starts here
    */
  chart_colors: any[] = ['rgba(102, 204, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(204, 153, 255, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(255, 204, 204, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(153, 204, 255, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 102, 178, 0.5)',
    'rgba(0, 0, 204, 0.5)',
    'rgba(255, 51, 51, 0.5)'
  ];
  hover_colors: any[] = ['rgba(102, 204, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(204, 153, 255, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(255, 204, 204, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(153, 204, 255, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 102, 178, 0.5)',
    'rgba(0, 0, 204, 0.5)',
    'rgba(255, 51, 51, 0.5)'
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
    * Methods calculates the total number of unique visitors to the farm for each of the last 12 months.
    * Charts are all dynamic to new data.
    */
  getUniqueVisitsPerMonth() {
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
          //Need to do a logic check here to see if the current userId is contained
          var booleanCheck = 0;

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
        let uniqueVisitsMonthsArray = [] //This will always have a length of 12
        let monthMatchingArray = [] //This will also have a length of 12

        var currentMonthMaster = maxMonth + 1;
        var currentYearMaster = maxYear;

        for (var a = 0; a < 12; ++a) {

          var uniqueVisitsArrayPerMonth = []
          currentMonthMaster = currentMonthMaster - 1;
          if (currentMonthMaster === 0) {
            currentMonthMaster = 12;
            currentYearMaster = maxYear - 1;
          }

          monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster); //This gives the string of the correct date for the given number
          //Now the unique visit logic starts here
          for (var i = 0; i < stats.length; ++i) {
            booleanCheck = 0; //Resets to 0 after each iteration

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
              //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
              var currentUserID = stats[i].user_id;

              for (var b = 0; b < uniqueVisitsArrayPerMonth.length; b++) {
                if (uniqueVisitsArrayPerMonth[b] === currentUserID) {
                  booleanCheck = 1;
                  break;
                }
              }
              if (booleanCheck === 0) {
                uniqueVisitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
              }
            }

          }
          //This is where we push the chart data
          console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
          uniqueVisitsMonthsArray.push(uniqueVisitsArrayPerMonth.length);

        }
        for (var d = 0; d < uniqueVisitsMonthsArray.length; ++d) {
          if (d === 0) {
            this.maxValue = uniqueVisitsMonthsArray[d];
          } else if (this.maxValue < uniqueVisitsMonthsArray[d]) {
            this.maxValue = uniqueVisitsMonthsArray[d];
          }
        }

        for (d = uniqueVisitsMonthsArray.length - 1; d >= 0; --d) {
          this.chartLabels.push(monthMatchingArray[d]);
          this.chartValues.push(uniqueVisitsMonthsArray[d]);
          this.chartColours.push(this.chart_colors[d]);
          this.chartHoverColours.push(this.hover_colors[d]);
        }



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
            label: 'Number of Unique Visitors Per Month',
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
