import { Component, ViewChild } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { HomepagePage } from '../homepage/homepage';
import { AdminVisitorDataPage } from '../admin-visitor-data/admin-visitor-data'; 
import { Graph1Page } from '../graph1/graph1';
import { Graph3Page } from '../graph3/graph3';
import { Graph4Page } from '../graph4/graph4';
import { GraphCustomPage } from '../graph-custom/graph-custom';
import { AdminHomePage } from '../admin-home/admin-home'; 

@IonicPage()
@Component({
  selector: 'page-graph2',
  templateUrl: 'graph2.html',
})
export class Graph2Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  
  goToAdminHome(){
    this.navCtrl.push(AdminHomePage);
  }
  
  goToAdminVisitorData(){
    this.navCtrl.push(AdminVisitorDataPage);
  }

  goToGraph1(){
    this.navCtrl.push(Graph1Page);
  }

  goToGraph2(){
    this.navCtrl.push(Graph2Page);
  }

  goToGraph3(){
    this.navCtrl.push(Graph3Page);
  }

  goToGraph4(){
    this.navCtrl.push(Graph4Page);
  }

  goToGraphCustom(){
    this.navCtrl.push(GraphCustomPage);
  }

  @ViewChild('pieChart') pieChart;
  @ViewChild('barChart') barChart;
  @ViewChild('lineChart') lineChart;

  public technologies              : any = {
    "technologies" : [
   {
      'technology' : 'Under 16 years old',
      'time'       : 50,
      'color'      : 'rgba(206, 61, 95, 0.5)',
      'hover'      : 'rgba(199, 108, 129, 0.5)'
   },
   {
      'technology' : '16-24 year olds',
      'time'       : 15,
      'color'      : 'rgba(83, 131, 185, 0.5)',
      'hover'      : 'rgba(122, 160, 202, 0.5)'
   },
   {
      'technology' : '25-34 year olds',
      'time'       : 10,
      'color'      : 'rgba(198, 147, 194, 0.5)',
      'hover'      : 'rgba(200, 166, 197, 0.5)'
   },
   {
      'technology' : '35-44 year olds',
      'time'       : 5,
      'color'      : 'rgba(54, 116, 152, 0.5)',
      'hover'      : 'rgba(103, 139, 160, 0.5)'
   },
   {
      'technology' : '45-54 years old',
      'time'       : 10,
      'color'      : 'rgba(152, 54, 145, 0.5)',
      'hover'      : 'rgba(152, 89, 149, 0.5)',
   },
   {
      'technology' : '55 and above',
      'time'       : 10,
      'color'      : 'rgba(192, 192, 192, 0.5)',
      'hover'      : 'rgba(220, 220, 220, 0.5)'
   }
   ]
};		
public pieChartEl                : any;
public barChartEl                : any;
public lineChartEl               : any;
public chartLabels               : any    = [];
public chartValues               : any    = [];
public chartColours              : any    = [];
public chartHoverColours         : any    = [];
public chartLoadingEl            : any;


  ionViewDidLoad() 
  {
     this.defineChartData();
     this.createPieChart();  
     this.createBarChart();  
     this.createLineChart();   
  }


   /**
    *
    * Parse the JSON data, push specific keys into selected arrays for use with 
    * each chart
    *
    */
    defineChartData() : void
    {
       let k : any;
 
       for(k in this.technologies.technologies)
       {
          var tech  =      this.technologies.technologies[k];
 
          this.chartLabels.push(tech.technology);
          this.chartValues.push(tech.time);
          this.chartColours.push(tech.color);
          this.chartHoverColours.push(tech.hover);
       }
    }
 
 
 
 
    /**
     *
     * Configure the Pie chart, define configuration options
     *
     */
    createPieChart() : void
    {
       
      this.pieChartEl 			= new Chart(this.pieChart.nativeElement, 
        {
           type: 'pie',
           data: {
               labels: this.chartLabels,
               datasets: [{
                   label                 : 'Daily Technology usage',
                   data                  : this.chartValues,
                   duration              : 2000,
                   easing                : 'easeInQuart',
                   backgroundColor       : this.chartColours,
                   hoverBackgroundColor  : this.chartHoverColours
               }]
           },
           options : {
              maintainAspectRatio: false,            
              layout: {
                 padding: {
                    left     : 50,
                    right    : 0,
                    top      : 0,
                    bottom   : 0
                 }
              },
              animation: {
                 duration : 5000
              }
           }
        });
  
  
  
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    }
 
 
 
 
    /**
     *
     * Configure the Bar chart, define configuration options
     *
     */
    createBarChart() : void
    {
  
    }
 
 
 
 
    /**
     *
     * Configure the Line chart, define configuration options
     *
     */
    createLineChart() : void
    {
       // We'll define the pie chart related logic here shortly
    }
 

   
  
  }

