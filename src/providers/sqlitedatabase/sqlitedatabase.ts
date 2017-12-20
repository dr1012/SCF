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
    private db: SQLiteObject = null; //storage the SQLiteObject return by create method

    private answerCache = {};
    private diversityCache={};

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
                        phone_number varchar(16) DEFAULT NULL,\
                        emergency_name varchar(48) DEFAULT NULL,\
                        emergency_telephone varchar(16) DEFAULT NULL,\
                        emergency_relationship varchar(48) DEFAULT NULL\
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
                              
                
                      
        // Questions
        var sql_question_table = "CREATE TABLE IF NOT EXISTS question (\
                                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                      question_text TEXT NOT NULL,\
                                      position INTEGER NOT NULL,\
                                      enabled TINYINT NOT NULL\
                                    )"; 
        var sql_question_option_table = "CREATE TABLE IF NOT EXISTS question_option (\
                                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                      question_id INTEGER NOT NULL,\
                                      option_text TEXT NOT NULL,\
                                      position INTEGER NOT NULL,\
                                      enabled INTEGER NOT NULL\
                                    )";        
        var sql_question_response_table = "CREATE TABLE IF NOT EXISTS question_response (\
                                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                      question_id INTEGER NOT NULL,\
                                      option_id INTEGER NULL,\
                                      option_text TEXT NULL,\
                                      user_id INTEGER NOT NULL,\
                                      recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\
                                    )";     

         var sql_diversity_table = "CREATE TABLE IF NOT EXISTS diversity (\
                                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                      question_text TEXT NOT NULL,\
                                      position INTEGER NOT NULL,\
                                      enabled TINYINT NOT NULL\
                                    )";         
                                    
                                    
        var sql_diversity_response_table = "CREATE TABLE IF NOT EXISTS diversity_response (\
                                      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                      question_id INTEGER NOT NULL,\
                                      option_text TEXT NOT NULL,\
                                      recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\
                                    )";                             
                                    
        this.db
            .executeSql(sql_question_table, {})
            .then(() => {
                console.log("Created table[question_table]");
                this.insertQuestions();
            }).catch(e => console.log(e));  
        this.db
            .executeSql(sql_question_option_table, {})
            .then(() => {
                console.log("Created table[question_option_table]");
            }).catch(e => console.log(e));  
        this.db
            .executeSql(sql_question_response_table, {})
            .then(() => {
                console.log("Created table[question_response_table]");
            }).catch(e => console.log(e));  

            this.db
            .executeSql(sql_diversity_table, {})
            .then(() => {
                console.log("Created table[diversity_table]");
                this.insertDiversityQuestions();
            }).catch(e => console.log(e));  

        this.db
            .executeSql(sql_diversity_response_table, {})
            .then(() => {
                console.log("Created table[diversity_response_table]");
            }).catch(e => console.log(e)); 

        }


  






    // Register user to database
    registerUser(data): Promise<any> {
        var sql =   "insert into sutton_user(\
                        first_name, last_name, \
                        email_address, \
                        phone_number, \
                        address, postcode, \
                        emergency_name,\
                        emergency_telephone,\
                        emergency_relationship\
                    ) values (?,?,?,?,?,?,?,?,?); SELECT last_insert_rowid()";
        var values = [
                        data["first_name"], 
                        data["last_name"], 
                        data["email_address"], 
                        data["phone_number"], 
                        data["address"], 
                        data["postcode"],
                        data["emergency_name"],
                        data["emergency_telephone"],
                        data["emergency_relationship"]
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
    





    insertDiversityQuestions() {
        
                
                let question1 = "Age category";
                let question2 = "Sex";
                let question3 = "Sexual orientation. Are you...";
                let question4 = "Ethnicity. Are you...";
                let question5 = "Disability: are your day-to-day activities limited because of\
                a health problem or disability which has lasted,\
                or is expected to last, at least 12 months?";
                let question6 = "Caring responsibilities: do you regularly provide unpaid\
             support caring for someone? [A carer is someone who spends a\
                significant proportion of their time providing unpaid support\
                to a family member, partner or friend who is ill, frail,\
                disabled or has mental health or substance misuse problems]";
                let question7 = "Religion or belief: are you or do you have...";
                let question8 = "Current employment status"
                let question9 = "Which London borough do you live in?"
                let sql = "INSERT INTO diversity ( id, question_text, position, enabled ) \
                            VALUES (?, ?, ?, 1)";
        
                this.db.executeSql(sql, [1, question1, 1]);
                this.db.executeSql(sql, [2, question2, 2]);
                this.db.executeSql(sql, [3, question3, 3]);
                this.db.executeSql(sql, [4, question4, 4]);
                this.db.executeSql(sql, [5, question5, 5]);
                this.db.executeSql(sql, [6, question6, 6]);
                this.db.executeSql(sql, [7, question7, 7]);
                this.db.executeSql(sql, [8, question8, 8]);
                this.db.executeSql(sql, [9, question9, 9]);
               
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


    /* Questionnaires */

    insertQuestions() {

        
        let question1 = "Please tick the volunteering activities you are interested in.*\
        Tick all that apply.";
        let question2 = "Please tell us why you would like to volunteer at Sutton Community Farm.*\
         Tick all that apply.";
        let question3 = "Please tick the statements applicable to you.* This helps us \
        understand how much support you might require with activities.";
    	let question4 = "Please add any further information about the support you\
          require. Include whether you are coming with a support\
          worker.";
          let question5 = "Do you have any medical conditions, allergies, disabilities\
          or existing injuries that may affect participation? Our staff\
          will discuss this with you in a sensitive and\
          confidential manner.*";
    	let question6 = "Do you have a particular interest in supporting other\
          volunteers at the farm as a Buddy Volunteer?\
          This would require additional training";

    	let question7 = "To help keep in touch with the farm community, would you like\
          to be added to our Google Group? You can leave anytime.";
    	let question8 = "Where did you hear about Sutton Community Farm?*";
        let question9 = "Please tick which days you are able to volunteer.*";
    	

    	let sql = "INSERT INTO question ( id, question_text, position, enabled ) \
    				VALUES (?, ?, ?, 1)";

        this.db.executeSql(sql, [1, question1, 1]);
        this.db.executeSql(sql, [2, question2, 2]);
        this.db.executeSql(sql, [3, question3, 3]);
        this.db.executeSql(sql, [4, question4, 4]);
        this.db.executeSql(sql, [5, question5, 5]);
        this.db.executeSql(sql, [6, question6, 6]);
        this.db.executeSql(sql, [7, question7, 7]);
        this.db.executeSql(sql, [8, question8, 8]);
        this.db.executeSql(sql, [9, question9, 9]);
       
    }

    getQuestion(position:number): Promise<any> {
    	let sql = "select * from question where position = ? order by id desc limit 1";
    	let params = [position];
    	return this.db.executeSql(sql, params);
    }


    getDiversityQuestion(position:number): Promise<any> {
    	let sql = "select * from diversity where position = ? order by id desc limit 1";
    	let params = [position];
    	return this.db.executeSql(sql, params);
    }

    insertCachedAnswers(user_id: number){
      console.log("Inserting cached answers for user:" + user_id);           
    	let insert_sql = "INSERT INTO question_response (\
    						user_id, question_id, option_text )\
							VALUES (?, ?, ?)";
    	for(let question_key in this.answerCache){
        console.log("question_key:"+question_key);
    		let answers = this.answerCache[question_key];
    		console.log(answers);
    		for (let index in answers){
          let answer = answers[index];
          console.log("answer:"+answer);
    			let params = [user_id, question_key, answer];
    			this.db.executeSql(insert_sql, params).then(()=>{ 
            console.log("inserted question response:"+question_key+":"+answer);
          });
    		}
    	}
    }




    insertDiversityCache(){
        console.log("Inserting cached diversity answers");           
          let insert_sql = "INSERT INTO diversity_response (\
                              question_id, option_text )\
                              VALUES (?, ?)";
          for(let question_key in this.diversityCache){
          console.log("question_key:"+question_key);
              let answers = this.diversityCache[question_key];
              console.log(answers);
              for (let index in answers){
            let answer = answers[index];
            console.log("answer:"+answer);
                  let params = [question_key, answer];
                  this.db.executeSql(insert_sql, params).then(()=>{ 
              console.log("inserted question response:"+question_key+":"+answer);
            });
              }
          }
      }




    getAnswers(user_id: number, question_id: number){
    	let sql = "select * from question_response where user_id = ? and question_id = ?";
    	this.db.executeSql(sql, [user_id, question_id])
    			.then((data)=>{console.log(JSON.stringify(data))});
    }

    // List answers with count statistics for a given question
    listAnswerStats(question_id: number): Promise<any>{
      let sql = "select user_id, recorded_at, question_id, option_text, count(*) as count\
                 from question_response \
                 where question_id=? \
                 group by question_id, option_text";
      let stats = [];
      return this.db.executeSql(sql, [question_id])
          .then(
            (data)=>{ 
              //console.log(JSON.stringify(data));
              if(data.rows.length>0){
                for (var i = 0; i < data.rows.length; i++) {
                    stats.push({
                        user_id: data.rows.item(i).user_id,
                        recorded_at: data.rows.item(i).recorded_at,
                        question_id: data.rows.item(i).question_id,
                        response: data.rows.item(i).option_text,
                        count: data.rows.item(i).count
                    });
                }
              }
              //console.log(JSON.stringify(stats));
              //console.log("------------------");
              return stats;
            }, 
            err => {
                console.log('Error: ', err);
                return [];
            });
    }

    // List all answers with count statistics for all questions
    listAllStats(): Promise<any>{
      let sql = "select user_id, recorded_at, question_id, option_text, count(*) as count  \
                from question_response \
                group by question_id, option_text";
      let stats = [];
      return this.db.executeSql(sql, [])
          .then(
            (data)=>{ 
              //console.log(JSON.stringify(data));
              if(data.rows.length>0){
                for (var i = 0; i < data.rows.length; i++) {
                    stats.push({
                        user_id: data.rows.item(i).user_id,
                        recorded_at: data.rows.item(i).recorded_at,
                        question_id: data.rows.item(i).question_id,
                        response: data.rows.item(i).option_text,
                        count: data.rows.item(i).count
                    });
                }
              }
              //console.log(JSON.stringify(stats));
              return stats;
            }, 
            err => {
                console.log('Error: ', err);
                return [];
            });
    }


    // Add to answer cache
    addToAnswerCache(question_id: number, answerList){
    	this.answerCache[question_id] = answerList;
    }

    // Clear answer cache
    clearAnswerCache(question_id: number){
    	delete this.answerCache[question_id];
    }

    // log answer cache
    logAnswerCache(){
    	console.log(JSON.stringify(this.answerCache));
    }

    addToDiversityCache(question_id: number, answerList){
        this.diversityCache[question_id] = answerList;
    }

    logDiversityCache(){
    	console.log(JSON.stringify(this.diversityCache));
    }

// list registration data for a give person
    listRegistration(firstname: string, lastname: string): Promise<any>{
        let sql = "select * from sutton_user where first_name=? and last_name=?";
        let stats = [];
        return this.db.executeSql(sql, [firstname, lastname])
            .then(
              (data)=>{ 
                //console.log(JSON.stringify(data));
                if(data.rows.length>0){
                  for (var i = 0; i < data.rows.length; i++) {
                      stats.push({
                          user_id: data.rows.item(i).id,
                          first_name: data.rows.item(i).first_name,
                          last_name: data.rows.item(i).last_name,
                          email_address: data.rows.item(i).email_address,
                          phone_number: data.rows.item(i).phone_number,
                         address: data.rows.item(i).address,
                          postcode: data.rows.item(i).postcode,
                          emergency_name: data.rows.item(i).emergency_name,
                          emergency_telephone: data.rows.item(i).emergency_telephone,
                          emergency_relationship: data.rows.item(i).emergency_reltationship

                      });
                  }
                }
                //console.log(JSON.stringify(stats));
                //console.log("------------------");
                return stats;
              }, 
              err => {
                  console.log('Error: ', err);
                  return [];
              });
      }

      listAllDiversity(): Promise<any>{
        let sql = "select recorded_at, question_id, option_text, count(*) as count  \
        from diversity_response \
        group by question_id, option_text";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
              (data)=>{ 
                //console.log(JSON.stringify(data));
                if(data.rows.length>0){
                  for (var i = 0; i < data.rows.length; i++) {
                      stats.push({
                        recorded_at: data.rows.item(i).recorded_at,
                        question_id: data.rows.item(i).question_id,
                        response: data.rows.item(i).option_text,
                        count: data.rows.item(i).count
                      });
                  }
                }
                //console.log(JSON.stringify(stats));
                return stats;
              }, 
              err => {
                  console.log('Error: ', err);
                  return [];
              });
      }

      listAllLog(): Promise<any>{
        let sql = "select user_id, login_ts, logout_ts\
        from login_history\
        group by user_id";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
              (data)=>{ 
                //console.log(JSON.stringify(data));
                if(data.rows.length>0){
                  for (var i = 0; i < data.rows.length; i++) {
                      stats.push({
                        user_id: data.rows.item(i).user_id,
                        login_time: data.rows.item(i).login_ts,
                        logout_time: data.rows.item(i).logout_ts
                      });
                  }
                }
                //console.log(JSON.stringify(stats));
                return stats;
              }, 
              err => {
                  console.log('Error: ', err);
                  return [];
              });
      }

      


}


