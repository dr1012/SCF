import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

const DATABASE_FILENAME: string = 'data.db';

@Injectable()
export class sqlitedatabase {
    // The database is a variable of type SQLiteObject,
    // not a table, the file that contains the table
     db: SQLiteObject = null; //storage the SQLiteObject return by create method

    constructor(
      private http: HttpClient,
      private platform: Platform,
      private sqlite: SQLite
    ) {
      this.platform.ready().then(() => {
        //call openDB method
        this.openDB().then(() => {
          //call createTable method 
          this.createTables();
        });
      }); 
    }
  
    public openDB(): Promise<void>{
      return this.sqlite.create({
        name: DATABASE_FILENAME,
        location: 'default'
      })
      .then( (db: SQLiteObject) => {
        //storage object to property
        this.db = db; 
      });
    }


    

    // Create database
    createDatabaseFile(): void {
        console.log("creating database")
        this.sqlite.create({      //creates new database
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                console.log('Database created!')
                this.db = db;  //assign
                this.createTables(); //create new tables
            }).catch(e => console.log(e));
    }

    // Create tables
    createTables(): void {
        var sql  =  "CREATE TABLE IF NOT EXISTS sutton_user \n\
                    (   id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                        first_name varchar(32) NOT NULL,\
                        last_name varchar(32) NOT NULL,\
                        email_address varchar(32) DEFAULT NULL,\
                        address varchar(48) DEFAULT NULL,\
                        postcode varchar(16) DEFAULT NULL,\
                        phone_number varchar(16) DEFAULT NULL\
                    )";
        
        this.db
            .executeSql(sql, {})
            .then(() => {
                console.log("Created table[sutton_user]");
            }).catch(e => console.log(e));            
                    
        var sql2  =  "CREATE TABLE IF NOT EXISTS login_history (\
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                        user_id INTEGER NOT NULL,\
                        login_ts BIGINT DEFAULT NULL,\
                        logout_ts BIGINT DEFAULT NULL \
                      )";

                      this.db
                      .executeSql(sql2, {})
                      .then(() => {
                          console.log("Created table[login_history]");
                      }).catch(e => console.log(e));   
                              
                  this.db.executeSql('CREATE TABLE IF NOT EXISTS Volunteers ( ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, FirstName TEXT NOT NULL, LastName TEXT NOT NULL, Email TEXT NOT NULL, PhoneNumber TEXT NOT NULL, Address TEXT NOT NULL, Postcode TEXT NOT NULL )', {}) //Executes an SQL command
                      .then(() => {
                          console.log("first table crated");
                          this.db.executeSql('CREATE TABLE IF NOT EXISTS Questionnaire_Answers ( Question1 TEXT, Question2 TEXT, Question3 TEXT, Question4 TEXT, Question5 TEXT, Question6 TEXT, Question7 TEXT, Question8 TEXT, Question9 TEXT, Question10 TEXT, Question11 TEXT, Question12 TEXT, Question13 TEXT, Question14 TEXT, Question15 TEXT )', {})
                              .then(() => console.log('second table created'))
                              .catch(e => console.log(e));
                      })
                      .catch(e => console.log(e));
        
    }

    // Register user to database
    registerUser(data): Promise<void> {
        var sql =   "insert into sutton_user(\
                        first_name, last_name, \
                        email_address, \
                        phone_number, \
                        address, postcode \
                    ) values (?,?,?,?,?,?)";
        var values = [
                        data["first_name"], 
                        data["last_name"], 
                        data["email_address"], 
                        data["phone_number"], 
                        data["address"], 
                        data["postcode"]
                     ];
                              
        return this.db.executeSql(sql,values);
    }

    // Suggestion for listing the user name based on last name
    suggestLastName(query): Promise<any>{
        return this.db.executeSql("select * from sutton_user where last_name like '%"+query+"%' limit 5", []);
    }
    
    // Return when the user last logged in
    last_login(user_id): Promise<any>{
        let sql = "select * from login_history where user_id=? order by id desc limit 1";
        let parameters = [user_id];
        return this.db.executeSql(sql, parameters);
    }
    
    // Add a login entry to database
    login(user_id): Promise<void>{
        let sql =   "insert into login_history(\
                        user_id, login_ts \
                    ) values (?,?)";
        let parameters = [user_id, Date.now()];
        return this.db.executeSql(sql, parameters);
    }
    
    // Update logout time to database
    logout(user_id): Promise<void>{
        console.log("logout user:"+ user_id);
        let sql =   "UPDATE login_history \
                        SET logout_ts=? \
                    WHERE user_id=?";
        let parameters = [Date.now(), user_id];
        return this.db.executeSql(sql, parameters);
    }
    
    /* Old Codes below; Not used anymore */
    

    
    returnFinal() {
         this.db.executeSql('select * from sutton_user', [])
            .then((data) => {
                if (data == null) {
                    console.log("no data in table");
                    return [];
                }
                let returnArray = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        returnArray.push({
                            Id: data.rows.item(i).id,
                            FirstName: data.rows.item(i).first_name,
                            LastName: data.rows.item(i).last_name,
                            Email: data.rows.item(i).email_address, 
                            PhoneNumber: data.rows.item(i).phone_number, 
                            Address: data.rows.item(i).address, 
                            Postcode: data.rows.item(i).postcode,
                        });
                    }

                }




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

      returnAll(): Promise<any>{
        return this.db.executeSql('select * from sutton_user', []);
    }

    allUsers(): any{
        this.db.executeSql("select * from sutton_user", [])
            .then((data) => {
                let users = [];
                if(data.rows.length>0){
                    for(var i=0; i<data.rows.length; i++){
                        users.push(data.rows.item(i).first_name);
                    }
                }
                return users;
            }).catch(e => {
                return [];
            });;
    }








}


