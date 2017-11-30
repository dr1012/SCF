import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASE_FILENAME: string =  'data.db';
@Injectable()
export class sqlitedatabase {
 
   db: SQLiteObject; // a database is a variable of type SQLitObject, a database is not a table!!! It's the file that contains the table
 
  constructor(public http: HttpClient, public sqlite: SQLite ) {
    this.createDatabaseFile(); 
  }



  volunteers: any[] = [];
  answers: string[] = [];

   createDatabaseFile(): void{
    this.sqlite.create({      //creates new database
      name: 'DATABASE_FILENAME',   
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
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `Volunteers` ( `ID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `FirstName` TEXT NOT NULL, `LastName` TEXT NOT NULL, `Email` TEXT NOT NULL, `PhoneNumber` NUMERIC NOT NULL, `Address` TEXT NOT NULL, `Postcode` TEXT NOT NULL )', {}) //Executes an SQL command
    .then(() => {
      console.log("first table crated");
      this.db.executeSql('CREATE TABLE IF NOT EXISTS `Questionnaire_Answers` ( `Question1` TEXT, `Question2` TEXT, `Question3` TEXT, `Question4` TEXT, `Question5` TEXT, `Question6` TEXT, `Question7` TEXT, `Question8` TEXT, `Question9` TEXT, `Question10` TEXT, `Question11` TEXT, `Question12` TEXT, `Question13` TEXT, `Question14` TEXT, `Question15` TEXT )', {})
      .then(() => console.log('second table created'))
      .catch(e => console.log(e));
    } )
    .catch(e => console.log(e));
  }




   insertRegistrationData(data: any[]): void{


    this.db.executeSql('insert into volunteers (FirstName,LastName,Email, PhoneNumber,Address,Postcode) values (?,?,?,?,?,?)', [data[0], data[1], data[2], data[3], data[4], data[5]]) //Executes an SQL command
    .then(() => {
      console.log("Registration data added");})
      .catch(e => console.log(e));
    }


 retrieveVolunteers(){
  this.volunteers = [];
  this.db.executeSql('SELECT * FROM VOLUNTEERS',[])
  .then((data) => {

    if(data==null){
      console.log("now data in table");
    }

    if(data.rows){
      if(data.rows.length>0){
        for(var i=0; i<data.rows.length; i++){
          this.volunteers.push(data.rows.item(i)) // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
        }
        return this.volunteers;
      }
    }
  });
}

 retrieveQuestionnaireAnswers(){
  this.volunteers = [];
  this.db.executeSql('SELECT * FROM Questionnaire_Answers',{})
  .then((data) => {

    if(data==null){
      return
    }

    if(data.rows){
      if(data.rows.length>0){
        for(var i=0; i<data.rows.length; i++){
          this.answers.push(data.rows.item(i)) // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
        }
      }
    }
  });
}
  

}
