import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/map';

const DATABASE_FILENAME: string =  'data.db';
@Injectable()
export class sqlitedatabase {
 
   db: SQLiteObject; // a database is a variable of type SQLitObject, a database is not a table!!! It's the file that contains the table
 
  constructor(public http: HttpClient, public sqlite: SQLite) {
    this.createDatabaseFile(); 
  }



  public volunteers: Array<Object>;
  answers: string[] = [];
  list =[];
  public returnArray: Array<any>;
  data: any = null;
 

   createDatabaseFile(): void{
    this.sqlite.create({      //creates new database
      name: 'DATABASE_FILENAME',   
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Database created!');
        this.db = db;  //assign
        this.createTables(); //create new tables
      })
      .catch(e => console.log(e));
  }




   createTables(): void{
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `Volunteers` ( `ID` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `FirstName` TEXT NOT NULL, `LastName` TEXT NOT NULL, `Email` TEXT NOT NULL, `PhoneNumber` TEXT NOT NULL, `Address` TEXT NOT NULL, `Postcode` TEXT NOT NULL )', {}) //Executes an SQL command
    .then(() => {
      console.log("first table crated");})
    .catch(e => console.log(e));
  }




   insertRegistrationData(data: any[]): void{


    this.db.executeSql('insert into volunteers (FirstName,LastName,Email, PhoneNumber,Address,Postcode) values (?,?,?,?,?,?)', [data[0], data[1], data[2], data[3], data[4], data[5]]) //Executes an SQL command
    .then(() => {
      console.log("Registration data added");})
      .catch(e => console.log(e));
    }







  retrieveLastNamePair(){
    this.db.executeSql('select LastName from volunteers', [])
    .then((data) => {
  
      if(data==null){
        console.log("no data in table");
      }
  
      let returnArray = [];
        if(data.rows.length>0){
          for(var i=0; i<data.rows.length; i++){
            returnArray.push({LastName: data.rows.item(i).LastName}); // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
          }
        
        }
        console.log(returnArray);
        console.log(JSON.stringify(returnArray));
        return returnArray;
        
        
        
  
      }, err => {
        console.log('Error: ', err);
        return [];
      });
    }

    retrieveLastName(){
      return this.db.executeSql('select LastName from volunteers', [])
      .then((data) => {
        let returnArray = [];
          if(data.rows.length>0){
            for(var i=0; i<data.rows.length; i++){
              returnArray.push(data.rows.item(i).LastName); // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
            }
          
          }
         //console.log(returnArray);
          //console.log(JSON.stringify(returnArray));
          return returnArray;
          
          
          
    
        }, err => {
          console.log('Error: ', err);
          return [];
        });
        
      }

      retrieveFirstName(){
        return this.db.executeSql('select FirstName from volunteers', [])
        .then((data) => {
          let returnArray = [];
            if(data.rows.length>0){
              for(var i=0; i<data.rows.length; i++){
                returnArray.push(data.rows.item(i).FirstName); // returns an array of JSON pairs, can play around to retrieve specific elements in the row too
              }
            
            }
           //console.log(returnArray);
            //console.log(JSON.stringify(returnArray));
            return returnArray;
            
            
            
      
          }, err => {
            console.log('Error: ', err);
            return [];
          });
          
        }

      returnFinal(){
        return this.db.executeSql('select FirstName,LastName,Email,PhoneNumber,Address,Postcode from volunteers', [])
        .then((data) => {
      
          let returnArray = [];
            if(data.rows.length>0){
              for(var i=0; i<data.rows.length; i++){
                returnArray.push({FirstName: data.rows.item(i).FirstName, LastName: data.rows.item(i).LastName, Email: data.rows.item(i).Email, PhoneNumber: data.rows.item(i).PhoneNumber, Address: data.rows.item(i).Address, Postcode: data.rows.item(i).Postcode }); 
              }
            
            }
            //console.log(returnArray);
            //console.log(JSON.stringify(returnArray));
            return returnArray;
            
            
            
      
          }, err => {
            console.log('Error: ', err);
            return [];
          });
        }

      ReturnSetArray(mylist: any[]){
        return this.db.executeSql('select FirstName,LastName,Email,PhoneNumber,Address,Postcode from volunteers', [])
        .then((data) => {
      
      
            if(data.rows.length>0){
              for(var i=0; i<data.rows.length; i++){
                mylist.push({FirstName: data.rows.item(i).FirstName, LastName: data.rows.item(i).LastName, Email: data.rows.item(i).Email, PhoneNumber: data.rows.item(i).PhoneNumber, Address: data.rows.item(i).Address, Postcode: data.rows.item(i).Postcode }); 
              }
            
            }
            //console.log(returnArray);
            //console.log(JSON.stringify(returnArray));
            
            
            
            
      
          }, err => {
            console.log('Error: ', err);
            return [];
          });
          
        }

        ReturnID(firstName: String, lastName: String){
          var Id;
          return this.db.executeSql('select ID from volunteers where FirstName = ? and LastName = ?', [firstName,lastName])
          .then((data) => {
            Id = data;
            console.log('ID retrieved correctly');
            return Id;
          }, err => {
            console.log('Error: ', err);
          });
         
        }




}


