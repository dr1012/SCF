import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ShareProvider } from '../../providers/share/share';

import 'rxjs/add/operator/map';

const QUESTIONNAIRE_DATABASE: string =  'data.db';
@Injectable()
export class QuestionnaireDatabaseProvider {

  db: SQLiteObject; // a database is a variable of type SQLitObject, a database is not a table!!! It's the file that contains the table
  
   constructor(public http: HttpClient, public sqlite: SQLite, private sqlitedatabase :sqlitedatabase, private shareprovider: ShareProvider) {
     this.createDatabaseFile(); 
   }

   createDatabaseFile(): void{
    this.sqlite.create({      //creates new database
      name: 'QUESTIONNAIRE_DATABASE',   
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Database created!')
        this.db = db;  //assign
        this.createTables(); //create new tables
      })
      .catch(e => console.log(e));
  }




  
  createTables(): void{
    this.db.executeSql('CREATE TABLE IF NOT EXISTS "Question1" ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Field4` INTEGER DEFAULT 0, `Field5` INTEGER DEFAULT 0, `Field6` INTEGER DEFAULT 0, `Other` TEXT )', {}) //Executes an SQL command
    .then(() => {
      console.log("table 1 created");
      this.db.executeSql('CREATE TABLE IF NOT EXISTS "Question2" ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Field4` INTEGER DEFAULT 0, `Field5` INTEGER DEFAULT 0, `Field6` INTEGER DEFAULT 0, `Other` TEXT )', {})
      .then(() => {
        console.log("table 2 created");
        this.db.executeSql('CREATE TABLE IF NOT EXISTS "Question3" ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Field4` INTEGER DEFAULT 0, `Field5` INTEGER DEFAULT 0, `Field6` INTEGER DEFAULT 0 )', {})
        .then(() => {
      console.log("table 3 created");
      this.db.executeSql('CREATE TABLE IF NOT EXISTS "Question4" ( `ID` INTEGER, `Field1` TEXT )', {})
      .then(() => {
        console.log("table 4  created");
        this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question5` ( `ID` INTEGER, `Field1` TEXT )', {})
        .then(() => {
          console.log("table 5 created");
          this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question6` ( `ID` INTEGER, `Field1` TEXT )', {})
          .then(() => {
            console.log("table 6 created");
            this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question7` ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Other` TEXT )', {})
            .then(() => {
              console.log("table 7 created");
              this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question8` ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0 )', {})
              .then(() => {
                console.log("table 8 created");
                this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question9` ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0 )', {})
              .then(() => {
                console.log("table 9 created");
                this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question10` ( `ID` INTEGER, `Field1` TEXT )', {})
                .then(() => {
                  console.log("table 10 created");
                  this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question11` ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Other` INTEGER DEFAULT 0 )', {})
                  .then(() => {
                    console.log("table 11 created");
                    this.db.executeSql('CREATE TABLE IF NOT EXISTS `Question12` ( `ID` INTEGER, `Field1` INTEGER DEFAULT 0, `Field2` INTEGER DEFAULT 0, `Field3` INTEGER DEFAULT 0, `Field4` INTEGER DEFAULT 0 )', {})
                    .then(() => {
                      console.log("table 12 created");
                      this.db.executeSql('CREATE TABLE IF NOT EXISTS `Emergency_Contact` ( `ID` INTEGER, `Name` TEXT, `PhoneNumber` NUMERIC, `Relationship` TEXT )', {})
                      .then(() => console.log('emergency contact table created'))
                      .catch(e => console.log(e));})})})})})})})})})})})})
                      .catch(e => console.log(e));


                    }

                    
                 getID(){
                   var id=this.sqlitedatabase.ReturnID(this.shareprovider.getFirstName(),this.shareprovider.getLastName());
                   return id;
                 }   
      
      
  

}
