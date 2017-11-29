import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class WebService {

  constructor(public http: Http,
    public sqlite: SQLite) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table volunteers(firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(50), phone_number NUMERIC(15, 0), address TEXT, postcode TEXT)', {})
          .then(() => {
            console.log("Database Created");
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  getData() {
    return this.http.get("https://jsonplaceholder.typicode.com/photos")
      .map(x => x.json());
  }
  getDataFromSQLlite() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('select * from volunteers', []);
      })
      .catch(e => console.log(e));
  }

  InsertData(data: any[]) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        
          db.executeSql('insert into volunteers values (?,?,?,?,?,?)', [data[0], data[1], data[2], data[3], data[4], data[5]])
            .then(() => {
              console.log("Data Inserted");
              console.log(data[0]+"," +data[1]+","+ data[2]+"," +data[3]+", "+data[4]+", "+data[5])
            })
            .catch(e => console.log(e));
          
      })
      .catch(e => console.log(e));
  }
  ClearDB() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('delete from volunteers', {})
          .then(() => {
            console.log("Data Cleared");
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
}