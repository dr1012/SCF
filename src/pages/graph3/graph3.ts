import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import { Chart } from 'chart.js';
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { GraphScatter1Page } from '../graph-scatter1/graph-scatter1';
import { GraphBar1Page } from '../graph-bar1/graph-bar1';
import { Storage } from '@ionic/storage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */


@Component({
  selector: 'page-graph3',
  templateUrl: 'graph3.html',
})
export class Graph3Page {

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
    this.getTotalVisitsPerYear();
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
  goToGraphScatter1() {
    this.navCtrl.push(GraphScatter1Page);
  }

  goToGraphBar1() {
    this.navCtrl.push(GraphBar1Page);
  }

  @ViewChild('pieChart') pieChart;

  /**
  * Chart methodology starts here
  */
  chart_colors: any[] = ['rgba(102, 204, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)'
  ];
  hover_colors: any[] = ['rgba(102, 204, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 153, 0, 0.5)',
    'rgba(153, 255, 51, 0.5)',
    'rgba(204, 102, 0, 0.5)',
    'rgba(102, 51, 0, 0.5)',
    'rgba(255, 102, 178, 0.5)'
  ];

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
    * Methods calculates the total number of visitors to the farm for every year,
    * contained within the login data. Charts are all dynamic to new data.
    */
  getTotalVisitsPerYear() {
    console.log("Getting total number of visits per year")

    this.sqlitedatabase.listLoginDetailsForGraphs()
      .then((stats) => {

        let numberOfYears = [] //this is the array to contain the unique user ID's
        let visitsPerYearArray = []
        console.log("Number of visits (total): " + stats.length);

        for (var j = 0; j < stats.length; j++) {
          //Need to do a logic check here to see if the current userId is contained
          var booleanCheck = 0;

          var currentDateHandled = new Date(stats[j].login_time);

          //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
          var currentDateInfoArray = currentDateHandled.toString().split(" ");
          var currentYear = currentDateInfoArray[3];

          for (var b = 0; b < numberOfYears.length; b++) {
            if (numberOfYears[b] === currentYear) {
              booleanCheck = 1;
              break;
            }
          }
          if (booleanCheck === 0) {
            numberOfYears.push(currentYear); //Adds the year if it isn't already contained
          }
        }

        //Step 2
        for (var a = 0; a < numberOfYears.length; ++a) {
          var currentYearFromArray = numberOfYears[a];
          var visitsArray = []

          for (var c = 0; c < stats.length; ++c) {
            currentDateHandled = new Date(stats[c].login_time);
            currentDateInfoArray = currentDateHandled.toString().split(" ");
            currentYear = currentDateInfoArray[3];
            booleanCheck = 0;

            if (currentYear === currentYearFromArray) {
              var currentUserID = stats[c].user_id;
              visitsArray.push(currentUserID);

            }
          }
          visitsPerYearArray.push(visitsArray.length);
        }

        for (var d = 0; d < visitsPerYearArray.length; ++d) {
          if (d === 0) {
            this.maxValue = visitsPerYearArray[d];
          } else if (this.maxValue < visitsPerYearArray[d]) {
            this.maxValue = visitsPerYearArray[d];
          }
        }

        for (d = 0; d < visitsPerYearArray.length; ++d) {
          console.log("The total number of visits for " + numberOfYears[d] + " is: " + + visitsPerYearArray[d]);
          const answers = {
            answer: numberOfYears[d],
            value: visitsPerYearArray[d],
            color: this.chart_colors[d],
            hover: this.hover_colors[d]
          };
          this.chartLabels.push(numberOfYears[d]);
          this.chartValues.push(visitsPerYearArray[d]);
          this.chartColours.push(this.chart_colors[d]);
          this.chartHoverColours.push(this.hover_colors[d]);

          this.answers.push(answers);
          console.log(this.answers);


        }
        this.createPieChart();
      }
      , err => {
        console.log("something went wrong on retrieving login history");
      });
  }


  /**
    * Methods takes the data defined and creates a chart
    */
  createPieChart(): void {

    this.pieChartEl = new Chart(this.pieChart.nativeElement,
      {
        type: 'pie',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Total Visits Per Year',
            data: this.chartValues,
            duration: 2000,
            easing: 'easeInQuart',
            backgroundColor: this.chartColours,
            hoverBackgroundColor: this.chartHoverColours
          }]
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 50,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          animation: {
            duration: 5000
          }
        }
      });



    this.chartLoadingEl = this.pieChartEl.generateLegend();
  }




}
