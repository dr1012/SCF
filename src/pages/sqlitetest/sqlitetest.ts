import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


const DATABASE_FILENAME: string =  'data.db';
@Component({
  selector: 'page-sqlitetest',
  templateUrl: 'sqlitetest.html',
})
export class SqlitetestPage {

  private db: SQLiteObject; // a database is a variable of type SQLitObject, a database is not a table!!! It's the file that contains the table

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
    this.createDatabaseFile(); 
  }

  volunteers: any[] = [];
  answers: string[] = [];

  private createDatabaseFile(): void{
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




  private createTables(): void{
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `Volunteers` ( `ID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `First Name` TEXT NOT NULL, `Last Name` TEXT NOT NULL, `Email` TEXT NOT NULL, `Phone Number` NUMERIC NOT NULL, `Address` TEXT NOT NULL, `Postcode` TEXT NOT NULL )', {}) //Executes an SQL command
    .then(() => {
      console.log("first table crated");
      this.db.executeSql('CREATE TABLE IF NOT EXISTS `Questionnaire_Answers` ( `Question 1` TEXT, `Question 2` TEXT, `Question 3` TEXT, `Question 4` TEXT, `Question 5` TEXT, `Question 6` TEXT, `Question 7` TEXT, `Question 8` TEXT, `Question 9` TEXT, `Question 10` TEXT, `Question 11` TEXT, `Question 12` TEXT, `Question 13` TEXT, `Question 14` TEXT, `Question 15` TEXT )', {})
      .then(() => console.log('second table created'))
      .catch(e => console.log(e));
    } )
    .catch(e => console.log(e));
  }




  private insertRegistrationData(data: any[]): void{


    this.db.executeSql('insert into volunteers values (?,?,?,?,?,?)', [data[0], data[1], data[2], data[3], data[4], data[5]]) //Executes an SQL command
    .then(() => {
      console.log("Registration data added");})
      .catch(e => console.log(e));
    }




  private insertQuestionnaireData(data: any){    //here we will call this for each questionnaire question so that the volunteers can quit half way through the questionnaire and if extra questions are added it still works
      this.db.executeSql('insert into Questionnaire_Answers (Question 1) VALUES(\''+  +'\')  ', {})
      .then(() => console.log('Questionnaire data added'))
      .catch(e => console.log(e));


  }


private retrieveVolunteers(){
  this.volunteers = [];
  this.db.executeSql('SELECT * FROM VOLUNTEERS',{})
  .then((data) => {

    if(data==null){
      return
    }

    if(data.rows){
      if(data.rows.length>0){
        for(var i=0; i<data.rows.length; i++){
          this.volunteers.push(data.rows.item(i)) // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
        }
      }
    }
  });
}

private retrieveQuestionnaireAnswers(){
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
