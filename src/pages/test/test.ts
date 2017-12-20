import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ShareProvider } from '../../providers/share/share';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import {LoginDatabaseProvider} from '../../providers/login-database/login-database';



/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  db: SQLiteObject

  items: any;
  returnArray = [];
  csvData: any[]  =[];
  Data :any[][];
  headerRow : any[] =[];
  Header: String[] = ["ID", "First Name", "Last Name", "Email", "Phone", "Address", "Postcode"];
  constructor(public httpclient: HttpClient, public sqlite: SQLite, private sqlitedatabase: sqlitedatabase, private shareprovider: ShareProvider, private http: Http, private logindatabase:LoginDatabaseProvider) {
   
  }
  









  private readCsvData() {
    this.http.get('assets/dummyData.csv')
    .subscribe(
      data => this.extractData(data),
      err =>  this.handleError(err)

    );
  }

  private extractData(res){
    let csvData = res['_body'] || '';
    let parsedData =  papa.parse(csvData).data;
    this.headerRow = parsedData[0]; //so this headerRow will be an array of the header elements
    parsedData.splice(0,1);
    this.csvData = parsedData; //array of arrays so each internal array is a row and is an array of the row values
  }

  handleError(err){

    console.log(err);

  }

  populateArray(){

  }
  
getallData(){
  this.sqlitedatabase.returnAll()
  .then((data) => {
      if (data == null) {
          console.log("no data in table");
          return [];
      }

      this.returnArray = [];
      if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
              this.returnArray.push([
                  data.rows.item(i).id,
                  data.rows.item(i).first_name,
                  data.rows.item(i).last_name,
                  data.rows.item(i).email_address, 
                  data.rows.item(i).phone_number, 
                  data.rows.item(i).address, 
                  data.rows.item(i).postcode,
              ]);
          }

      }
     

  }, err => {
      console.log('Error: ', err);
      return [];
  }); 
}


  /*downloadCSV(){

  

   let csv = papa.unparse({
      fields: this.Header,
      data: this.sqlitedatabase.returnFinal()
    }); //parses an array of arrays, first internal array is headerRow, all other arrays are data rows
        //in our case puts the array data back into


  

  var blob =  new Blob([csv]);
  var a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = "newdata.csv";
  document.body.appendChild(a);
  a.click();
document.body.removeChild(a);

  }*/

  trackByFn(index: any, item: any){
    return index
  }

}
