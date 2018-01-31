import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import { Chart } from 'chart.js';
import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data';
import { GraphPie2Page } from '../graph-pie2/graph-pie2';
import { GraphBar2Page } from '../graph-bar2/graph-bar2';
import { Storage } from '@ionic/storage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */


@Component({
  selector: 'page-graph-scatter2',
  templateUrl: 'graph-scatter2.html',
})
export class GraphScatter2Page {

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

    this.getTotalUniqueVisits();
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
  goToGraphPie2() {
    this.navCtrl.push(GraphPie2Page);
  }
  goToGraphBar2() {
    this.navCtrl.push(GraphBar2Page);
  }

  /**
   * Chart methodology starts here
   */
  @ViewChild('lineChart') lineChart;

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
    'rgba(102, 51, 0, 0.5)'
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
    * Methods calculates the total number of unique visitors to the farm,
    * contained within the login data. Charts are all dynamic to new data.
    */
  getTotalUniqueVisits() {
    console.log("Getting total number of unique visits")

    this.sqlitedatabase.listLoginDetailsForGraphs()
      .then((stats) => {

        let uniqueVisits = [] //this is the array to contain the unique user ID's

        console.log("Number of visits (total): " + stats.length);

        for (var j = 0; j < stats.length; j++) {
          //Need to do a logic check here to see if the current userId is contained
          var booleanCheck = 0;

          for (var b = 0; b < uniqueVisits.length; b++) {
            if (uniqueVisits[b] === stats[j].user_id) {
              booleanCheck = 1;
              break;
            }
          }
          if (booleanCheck === 0) {
            uniqueVisits.push(stats[j].user_id);
          }

        }

        console.log(uniqueVisits.length);

        this.maxValue = uniqueVisits.length;
        this.chartLabels.push('Total Number of Unique Visits');
        this.chartValues.push(uniqueVisits.length);
        this.chartColours.push(this.chart_colors[0]);
        this.chartHoverColours.push(this.hover_colors[0]);

        this.createLineChart();

      }
      , err => {
        console.log("something went wrong on retrieving login history");
      });
  }


  /**
 * Methods takes the data defined and creates a chart
 */
  createLineChart(): void {
    this.lineChartEl = new Chart(this.lineChart.nativeElement,
      {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Total Unique Visits',
            data: this.chartValues,
            duration: 2000,
            easing: 'easeInQuart',
            backgroundColor: this.chartColours,
            hoverBackgroundColor: this.chartHoverColours,
            fill: false
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

