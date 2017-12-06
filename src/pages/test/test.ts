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

  csvData: any[]  =[];
  Data :any[][];
  headerRow : any[] =[];
  Header: String[] = ["ID", "First Name", "Last Name", "LoginDate", "LoginTime", "LogoutDate", "LogoutTime"];
  constructor(public httpclient: HttpClient, public sqlite: SQLite, private sqlitedatabase: sqlitedatabase, private shareprovider: ShareProvider, private http: Http, private logindatabase:LoginDatabaseProvider) {
    this.createDatabaseFile(); 
  }
  

  createDatabaseFile(): void{
    this.sqlite.create({      //creates new database
      name: 'DATABASE_FILENAME',   
      location: 'assets/dummydb.db'
    })
      .then((db: SQLiteObject) => {
        console.log('Database created!');
        this.db = db;  //assign
        this.createTables(); //create new tables
        this.populateDatabase2();
      })
      .catch(e => console.log(e));
  }

  createTables(): void {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `LogTable2` ( `ID` INTEGER, `FirstName` TEXT, `LastName` TEXT, `LoginDate` TEXT, `LoginTime` TEXT, `LogoutDate` TEXT, `LogoutTime` TEXT )', {})
      .then(() => {
        console.log("Log table2 created");
      })
      .catch(e => console.log(e));
  }

  populateDatabase2(){
    this.logindatabase.db.executeSql('insert into LogTable2 (ID, FirstName, LastName, LoginDate, LoginTime, LogoutDate, LogoutTime) values ("1","David","Rudolf","10/12/13","12:00","10/12/13","16:00")',[]) //Executes an SQL command
    .then(() => {
      console.log("Login data2 added");
    })
    .catch(e => console.log(e));
    this.logindatabase.db.executeSql('insert into LogTable2 (ID, FirstName, LastName, LoginDate, LoginTime, LogoutDate, LogoutTime) values ("5","Ed","Gerrad","11/12/13","09:00","15/12/13","17:00")',[]) //Executes an SQL command
    .then(() => {
      console.log("Login data2 added");
    })
    .catch(e => console.log(e));


  }


  private readDatabaseData() {
    this.http.get('assets/database.db')
    .map(res => res.json())
    .subscribe(response => {
        this.items = response.data;

      });
      console.log(this.items);
      console.log("stringify: "+JSON.stringify(this.items))
  }














  populateDatabase(){
    this.logindatabase.db.executeSql('insert into LogTable (ID, FirstName, LastName, LoginDate, LoginTime, LogoutDate, LogoutTime) values ("1","David","Rudolf","10/12/13","12:00","10/12/13","16:00")',[]) //Executes an SQL command
    .then(() => {
      console.log("Login data added");
    })
    .catch(e => console.log(e));
    this.logindatabase.db.executeSql('insert into LogTable (ID, FirstName, LastName, LoginDate, LoginTime, LogoutDate, LogoutTime) values ("5","Ed","Gerrad","11/12/13","09:00","15/12/13","17:00")',[]) //Executes an SQL command
    .then(() => {
      console.log("Login data added");
    })
    .catch(e => console.log(e));


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

  

 /* downloadCSV(){
    

   let csv = papa.unparse({
      fields: this.Header,
      data: this.logindatabase.returnLogDataForCsv()
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
