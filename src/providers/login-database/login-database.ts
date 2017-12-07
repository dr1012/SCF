import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ShareProvider } from '../../providers/share/share';
import * as papa from 'papaparse';
import { Http } from '@angular/http';

/*
  Generated class for the LoginDatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()


export class LoginDatabaseProvider {
  csvData: any[]  =[];
  headerRow : any[] =[];
   logData :any[][];
  db: SQLiteObject; // a database is a variable of type SQLitObject, a database is not a table!!! It's the file that contains the table

  constructor(public httpclient: HttpClient, public sqlite: SQLite, private sqlitedatabase: sqlitedatabase, private shareprovider: ShareProvider, private http: Http) {
    this.createDatabaseFile();
  }

  createDatabaseFile(): void {
    this.sqlite.create({      //creates new database
      name: 'logindata.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Database created!')
        this.db = db;  //assign
        this.createTables(); //create new tables
      })
      .catch(e => console.log(e));
  }




  createTables(): void {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `LogTable` ( `ID` INTEGER, `FirstName` TEXT, `LastName` TEXT, `LoginDate` TEXT, `LoginTime` TEXT, `LogoutDate` TEXT, `LogoutTime` TEXT )', {})
      .then(() => {
        console.log("Log table created");
      })
      .catch(e => console.log(e));
  }
/*
  insertLoginData(firstName: String, lastName: String, data: any[]): void {

    var Id = this.sqlitedatabase.ReturnID(firstName, lastName);

    this.db.executeSql('insert into LogTable (ID, FirstName, LastName, LoginDate, LoginTime) values (?,?,?,?,?)', [Id, data[0], data[1], data[2], data[3]]) //Executes an SQL command
      .then(() => {
        console.log("Login data added");
      })
      .catch(e => console.log(e));
  }


  insertLogoutData(firstName: String, lastName: String, LogoutDate: String, LogoutTime: String): void {
    var Id = this.sqlitedatabase.ReturnID(firstName, lastName);
    this.db.executeSql('UPDATE LogTable set LogoutDate=?, LogoutTime=? WHERE ID=?', [LogoutDate, LogoutTime, Id]) //Executes an SQL command
      .then(() => {
        console.log("Logout data added");
      })
      .catch(e => console.log(e));
  }


  returnLogData() {

    return this.db.executeSql("SELECT * FROM LogTable", []).then((data) => {
      let logData = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          logData.push(data.rows.item(i).ID, data.rows.item(i).FirstName, data.rows.item(i).LastName, data.rows.item(i).LoginDate, data.rows.item(i).LoginTime, data.rows.item(i).LogoutDate, data.rows.item(i).LogoutTime);
        }
      }
      return logData;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
*/
  returnLogDataForCsv(logData: any[][]) {
      this.db.executeSql("SELECT * FROM LogTable", {}).then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.logData[i].push([data.rows.item(i).ID, data.rows.item(i).FirstName, data.rows.item(i).LastName, data.rows.item(i).LoginDate, data.rows.item(i).LoginTime, data.rows.item(i).LogoutDate, data.rows.item(i).LogoutTime]);
        }
      }
     
    }, err => {
      console.log('Error: ', err);
      
    });

  }









}