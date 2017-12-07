import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { sqlitedatabase } from "../../providers/sqlitedatabase/sqlitedatabase";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { ShareProvider } from "../../providers/share/share";
import { Platform } from "ionic-angular";

import "rxjs/add/operator/map";

const QUESTIONNAIRE_DATABASE: string =  "data.db";
@Injectable()
export class QuestionnaireDatabaseProvider {

  db: SQLiteObject = null; 
  
   constructor(public http: HttpClient, private platform: Platform, public sqlite: SQLite, private sqlitedatabase :sqlitedatabase, private shareprovider: ShareProvider) {
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
      name: QUESTIONNAIRE_DATABASE,
      location: "default"
    })
    .then( (db: SQLiteObject) => {
      //storage object to property
      this.db = db; 
    });
  }


  createDatabaseFile(): void {
    console.log("creating database")
    this.sqlite.create({      //creates new database
            name: "data.db",
            location: "default"
        }).then((db: SQLiteObject) => {
            console.log("Database created!")
            this.db = db;  //assign
            this.createTables(); //create new tables
        }).catch(e => console.log(e));
}




  
  createTables(): void{
    this.db.executeSql("CREATE TABLE IF NOT EXISTS Question1 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Field4 INTEGER DEFAULT 0,\ Field5 INTEGER DEFAULT 0,\ Field6 INTEGER DEFAULT 0,\ Other TEXT \)", {}) //Executes an SQL command
    .then(() => {
      console.log("table 1 created");
    }).catch(e => console.log(e));  
    
      this.db.executeSql("CREATE TABLE IF NOT EXISTS Question2 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Field4 INTEGER DEFAULT 0,\ Field5 INTEGER DEFAULT 0,\ Field6 INTEGER DEFAULT 0,\ Other TEXT \)", {})
      .then(() => {
        console.log("table 2 created");
      }).catch(e => console.log(e)); 

        this.db.executeSql("CREATE TABLE IF NOT EXISTS Question3 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Field4 INTEGER DEFAULT 0,\ Field5 INTEGER DEFAULT 0,\ Field6 INTEGER DEFAULT 0 \)", {})
        .then(() => {
      console.log("table 3 created");
    }).catch(e => console.log(e));  

      this.db.executeSql("CREATE TABLE IF NOT EXISTS Question4 (\ ID INTEGER,\ Field1 TEXT \)", {})
      .then(() => {
        console.log("table 4  created");
      }).catch(e => console.log(e));  

        this.db.executeSql("CREATE TABLE IF NOT EXISTS Question5 (\ ID INTEGER,\ Field1 TEXT \)", {})
        .then(() => {
          console.log("table 5 created");
        }).catch(e => console.log(e));  

          this.db.executeSql("CREATE TABLE IF NOT EXISTS Question6 (\ ID INTEGER,\ Field1 TEXT \)", {})
          .then(() => {
            console.log("table 6 created");
          }).catch(e => console.log(e));  

            this.db.executeSql("CREATE TABLE IF NOT EXISTS Question7 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Other TEXT )", {})
            .then(() => {
              console.log("table 7 created");
            }).catch(e => console.log(e));  

              this.db.executeSql("CREATE TABLE IF NOT EXISTS Question8 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0 \)", {})
              .then(() => {
                console.log("table 8 created");
              }).catch(e => console.log(e));  
              
                this.db.executeSql("CREATE TABLE IF NOT EXISTS Question9 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0 \)", {})
              .then(() => {
                console.log("table 9 created");
              }).catch(e => console.log(e));  

                this.db.executeSql("CREATE TABLE IF NOT EXISTS Question10 (\ ID INTEGER,\ Field1 TEXT \)", {})
                .then(() => {
                  console.log("table 10 created");
                }).catch(e => console.log(e));  

                  this.db.executeSql("CREATE TABLE IF NOT EXISTS Question11 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Other INTEGER DEFAULT 0 \)", {})
                  .then(() => {
                    console.log("table 11 created");
                  }).catch(e => console.log(e));  

                    this.db.executeSql("CREATE TABLE IF NOT EXISTS Question12 (\ ID INTEGER,\ Field1 INTEGER DEFAULT 0,\ Field2 INTEGER DEFAULT 0,\ Field3 INTEGER DEFAULT 0,\ Field4 INTEGER DEFAULT 0 \)", {})
                    .then(() => {
                      console.log("table 12 created");
                    }).catch(e => console.log(e));  

                      this.db.executeSql("CREATE TABLE IF NOT EXISTS Emergency_Contact (\ ID INTEGER,\ Name TEXT,\ PhoneNumber NUMERIC,z Relationship TEXT )", {})
                      .then(() => {
                        console.log("Emergy contact table created");
                      }).catch(e => console.log(e));  
                      

                    }

                    
                 getID(){
                   var id=this.sqlitedatabase.ReturnID(this.shareprovider.getFirstName(),this.shareprovider.getLastName());
                   return id;
                 }   

                 //not sure if this will work as data.rows.items(i).Field1 Field2 etc  to populate the array.
                 ReturnQuestionnaireData1(){
                  return this.db.executeSql("select Field1, Field2, Field3, Field4, Field5, Field6, Other from Question1", [])
                  .then((data) => {
                    let returnArray = [];
                      if(data.rows.length>0){
                        for(var i=0; i<data.rows.length; i++){
                          returnArray.push(data.rows.item(i).Field1,data.rows.item(i).Field2,data.rows.item(i).Field3,data.rows.item(i).Field4,data.rows.item(i).Field5,data.rows.item(i).Field6,data.rows.item(i).Other); 
                        }
                      
                      }
                      return returnArray;

                    }, err => {
                      console.log("Error: ", err);
                      return [];
                    });
                    
                  }

                  ReturnQuestionnaireData2(){
                    return this.db.executeSql("select Field1, Field2, Field3, Field4, Field5, Field6, Other from Question2", [])
                    .then((data) => {
                      let returnArray = [];
                        if(data.rows.length>0){
                          for(var i=0; i<data.rows.length; i++){
                            returnArray.push(data.rows.item(i)); 
                          }
                        
                        }
                        return returnArray;
  
                      }, err => {
                        console.log("Error: ", err);
                        return [];
                      });
                      
                    }

                    ReturnQuestionnaireData3(){
                      return this.db.executeSql("select Field1, Field2, Field3, Field4, Field5, Field6 from Question3", [])
                      .then((data) => {
                        let returnArray = [];
                          if(data.rows.length>0){
                            for(var i=0; i<data.rows.length; i++){
                              returnArray.push(data.rows.item(i)); 
                            }
                          
                          }
                          return returnArray;
    
                        }, err => {
                          console.log("Error: ", err);
                          return [];
                        });
                        
                      }

                      ReturnQuestionnaireData4(){
                        return this.db.executeSql("select Field1 from Question4", [])
                        .then((data) => {
                          let returnArray = [];
                            if(data.rows.length>0){
                              for(var i=0; i<data.rows.length; i++){
                                returnArray.push(data.rows.item(i)); 
                              }
                            
                            }
                            return returnArray;
      
                          }, err => {
                            console.log("Error: ", err);
                            return [];
                          });
                          
                        }

                        ReturnQuestionnaireData5(){
                          return this.db.executeSql("select Field1 from Question5", [])
                          .then((data) => {
                            let returnArray = [];
                              if(data.rows.length>0){
                                for(var i=0; i<data.rows.length; i++){
                                  returnArray.push(data.rows.item(i)); 
                                }
                              
                              }
                              return returnArray;
        
                            }, err => {
                              console.log("Error: ", err);
                              return [];
                            });
                            
                          }

                          ReturnQuestionnaireData6(){
                            return this.db.executeSql("select Field1 from Question6", [])
                            .then((data) => {
                              let returnArray = [];
                                if(data.rows.length>0){
                                  for(var i=0; i<data.rows.length; i++){
                                    returnArray.push(data.rows.item(i)); 
                                  }
                                
                                }
                                return returnArray;
          
                              }, err => {
                                console.log("Error: ", err);
                                return [];
                              });
                              
                            }

                            ReturnQuestionnaireData7(){
                              return this.db.executeSql("select Field1, Field2, Field3, Other from Question7", [])
                              .then((data) => {
                                let returnArray = [];
                                  if(data.rows.length>0){
                                    for(var i=0; i<data.rows.length; i++){
                                      returnArray.push(data.rows.item(i)); 
                                    }
                                  
                                  }
                                  return returnArray;
            
                                }, err => {
                                  console.log("Error: ", err);
                                  return [];
                                });
                                
                              }

                              ReturnQuestionnaireData8(){
                                return this.db.executeSql("select Field1 from Question8", [])
                                .then((data) => {
                                  let returnArray = [];
                                    if(data.rows.length>0){
                                      for(var i=0; i<data.rows.length; i++){
                                        returnArray.push(data.rows.item(i)); 
                                      }
                                    
                                    }
                                    return returnArray;
              
                                  }, err => {
                                    console.log("Error: ", err);
                                    return [];
                                  });
                                  
                                }

                                ReturnQuestionnaireData9(){
                                  return this.db.executeSql("select Field1 from Question9", [])
                                  .then((data) => {
                                    let returnArray = [];
                                      if(data.rows.length>0){
                                        for(var i=0; i<data.rows.length; i++){
                                          returnArray.push(data.rows.item(i)); 
                                        }
                                      
                                      }
                                      return returnArray;
                
                                    }, err => {
                                      console.log("Error: ", err);
                                      return [];
                                    });
                                    
                                  }
                                  ReturnQuestionnaireData10(){
                                    return this.db.executeSql("select Field1 from Question10", [])
                                    .then((data) => {
                                      let returnArray = [];
                                        if(data.rows.length>0){
                                          for(var i=0; i<data.rows.length; i++){
                                            returnArray.push(data.rows.item(i)); 
                                          }
                                        
                                        }
                                        return returnArray;
                  
                                      }, err => {
                                        console.log("Error: ", err);
                                        return [];
                                      });
                                      
                                    }
                                    ReturnQuestionnaireData11(){
                                      return this.db.executeSql("select Field1, Field2, Field3, Other from Question11", [])
                                      .then((data) => {
                                        let returnArray = [];
                                          if(data.rows.length>0){
                                            for(var i=0; i<data.rows.length; i++){
                                              returnArray.push(data.rows.item(i)); 
                                            }
                                          
                                          }
                                          return returnArray;
                    
                                        }, err => {
                                          console.log("Error: ", err);
                                          return [];
                                        });
                                        
                                      }

                                      ReturnQuestionnaireData12(){
                                        return this.db.executeSql("select Field1, Field2, Field3, Field4 from Question12", [])
                                        .then((data) => {
                                          let returnArray = [];
                                            if(data.rows.length>0){
                                              for(var i=0; i<data.rows.length; i++){
                                                returnArray.push(data.rows.item(i)); 
                                              }
                                            
                                            }
                                            return returnArray;
                      
                                          }, err => {
                                            console.log("Error: ", err);
                                            return [];
                                          });
                                          
                                        }

                                        ReturnEmergencyContact(){
                                          return this.db.executeSql("select ID, Name, PhoneNumber, Relationship from Emergency_Contact", [])
                                          .then((data) => {
                                            let returnArray = [];
                                              if(data.rows.length>0){
                                                for(var i=0; i<data.rows.length; i++){
                                                  returnArray.push(data.rows.item(i)); 
                                                }
                                              
                                              }
                                              return returnArray;
                        
                                            }, err => {
                                              console.log("Error: ", err);
                                              return [];
                                            });
                                            
                                          }

                                          /*public Cursor getData(){
                                            return IDBCursorWithValue
                                          }*/
                                           ReturnData(){
                                              let buffer: ArrayBuffer;
                                              

                                           }

                                         
  
                    
            
                 
      
      
  

}
