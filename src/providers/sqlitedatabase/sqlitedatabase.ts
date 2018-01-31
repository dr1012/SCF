////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file sqlitedabase.ts is adapted from https://devdactic.com/ionic-sqlite-queries-database/

*/
////////////////////////////////////////////////////////////////////////////////////////////////



import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

const DATABASE_FILENAME: string = 'data.db';

@Injectable()
export class sqlitedatabase {
    // The database is a variable of type SQLiteObject,
    // not a table, the file that contains the table
    public db: SQLiteObject = null; //storage the SQLiteObject return by create method

    private answerCache = {};
    private diversityCache = {};

    constructor(
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

    public openDB(): Promise<void> {
        return this.sqlite.create({
            name: DATABASE_FILENAME,
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                //storage object to property
                this.db = db;
            });
    }




    /**
     * This method crates the SQLite database and calles the creatTable() method that will creat the relevant tables in the database. 
     */
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

    /**
     * This method creates all the SQLite tables that will be used in the app. The sutton_user table to store registration information. 
     * The login_history table to store login data.
     * The question table to store all the registation questionnaire questions.
     * The question_response table to store the individual responses from the registration questionnaire questions.
     * The diversity table to store all the diversity questionnaire questions.
     * The diversity_response table to store the individual respones from the diversity questionnaire questions. 
     * The last_sync table to store the time stamps of the imported data from registration Google Sheet.
     * The last_sync2 table to store the time stamps of the imported data from diversity Google Sheet. 
     * 
     * For the last_sync and last_syn2 table, it is verified wether or not the tables are empty. If they are, they are pre-populated with the first data row so that the querry in the google-drive.ts file doesn't result in an error. 
     * The data that is used for pre-population is 1, which is 1 millisecond after the 1st of January 1970 so this should never cause any problems with the timestamps in the Google Sheets as the time stamp never goes back this far. 
     */
    createTables(): void {
        var sql = "CREATE TABLE IF NOT EXISTS sutton_user \n\
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

        var sql2 = "CREATE TABLE IF NOT EXISTS login_history (\
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


        var last_sync_table = "CREATE TABLE IF NOT EXISTS last_sync_table (\
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                last_sync BIGINT NOT NULL)";

        this.db
            .executeSql(last_sync_table, {})
            .then(() => {
                console.log("Created table[last_sync_table]");
                let new_sql = 'SELECT max(id) as count from last_sync_table';
                this.db.executeSql(new_sql, []).then((data) => {
                    console.log("querry output:  " + data.rows.item(0).count);
                    if (parseInt(data.rows.item(0).count) > 0) {
                        console.log("last_sync_table NOT empty")
                    }
                    else {
                        this.setLastSync("1");
                        console.log("last_sync_table empty, adding first value")
                    }
                });
            }).catch(e => console.log(e));



        var last_sync_table2 = "CREATE TABLE IF NOT EXISTS last_sync_table2 (\
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                last_sync BIGINT NOT NULL)";

        this.db
            .executeSql(last_sync_table2, {})
            .then(() => {
                console.log("Created table[last_sync_table2]");
                let new_sql = 'SELECT max(id) as count from last_sync_table2';
                this.db.executeSql(new_sql, []).then((data) => {
                    console.log("querry output:  " + data.rows.item(0).count);
                    if (parseInt(data.rows.item(0).count) > 0) {
                        console.log("last_sync_table2 NOT empty")
                    }
                    else {
                        this.setLastSync2("1");
                        console.log("last_sync_table2 empty, adding first value")
                    }
                });
            }).catch(e => console.log(e));


    }









    /**
     * This method adds new data to the sutton_user table from an array.  
     * @param data 
     */
    registerUser(data): Promise<any> {
        var sql = "insert into sutton_user(\
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

        return this.db.executeSql(sql, values);
    }

    /**
     * Suggestion for listing the user name based on last name
     * @param query
     */
    suggestLastName(query): Promise<any> {
        return this.db.executeSql("select * from sutton_user where last_name like '%" + query + "%' limit 5", []);
    }

    /**
     * This method returns when the user last logged in. 
     * @param user_id 
     */
    last_login(user_id): Promise<any> {
        let sql = "select * from login_history where user_id=? order by id desc limit 1";
        let parameters = [user_id];
        return this.db.executeSql(sql, parameters);
    }

    /**
     * This method adds a login entry to the login_history table in the SQLite database. 
     * @param user_id 
     */
    login(user_id): Promise<void> {
        let sql = "insert into login_history(\
                        user_id, login_ts \
                    ) values (?,?)";
        let parameters = [user_id, Date.now()];
        return this.db.executeSql(sql, parameters);
    }

    /**
     * Update logout time to database
     */
    logout(user_id): Promise<void> {
        console.log("logout user:" + user_id);
        let sql = "UPDATE login_history \
                        SET logout_ts=? \
                    WHERE user_id=?";
        let parameters = [Date.now(), user_id];
        return this.db.executeSql(sql, parameters);
    }





    /**
     * This method populates the 'diversity' table with all the questions of the diversity questionnaire. 
     */
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






    // login history
    loginHistory(): Promise<any> {
        let sql = "SELECT sutton_user.id as id, first_name, last_name, email_address, login_ts\
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id limit 20";
        return this.db.executeSql(sql, []);
    }

    // total attendance
    totalAttendance(): Promise<any> {
        let sql = "SELECT age_group, count(login_history.user_id) as count \
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id group by age_group";
        return this.db.executeSql(sql, []);
    }

    // Total Number of visiters per year
    totalVisitorsYear(): Promise<any> {
        let sql = "SELECT age_group, count(login_history.user_id) as count \
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id";
        return this.db.executeSql(sql, []);
    }

    // total registered
    totalRegistered(): Promise<any> {
        let sql = "SELECT age_group, count(*) as count \
                       FROM sutton_user";
        return this.db.executeSql(sql, []);
    }


    // Admin login credentials
    adminCredentials(username): Promise<any> {
        let sql = "select * from admin where username=?";
        return this.db.executeSql(sql, [username]);
    }

    /**
 * This method populates the 'question' table with all the questions of the registration questionnaire. 
 */
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

    /**
     * This method querries the question table for a certain row based  on the input position. 
     * @param position 
     */
    getQuestion(position: number): Promise<any> {
        let sql = "select * from question where position = ? order by id desc limit 1";
        let params = [position];
        return this.db.executeSql(sql, params);
    }

    /**
     * This method querries the last_sync table for the last time stamp. 
     */
    getLastSync(): Promise<any> {
        let sql = "SELECT * FROM last_sync_table ORDER BY id DESC LIMIT 1"
        return this.db.executeSql(sql, []);
    }

    /**
        * This method querries the last_sync2 table for the last time stamp. 
        */
    getLastSync2(): Promise<any> {
        let sql = "SELECT * FROM last_sync_table2 ORDER BY id DESC LIMIT 1"
        return this.db.executeSql(sql, []);
    }

    /**
    * This method adds a new data row to the last_sync table. 
    */
    setLastSync(lastSync): Promise<any> {
        console.log("last sync set")
        let sql = "insert into last_sync_table(last_sync) values (?);"
        return this.db.executeSql(sql, [lastSync])

    }


    /**
    * This method adds a new data row to the last_sync2 table. 
    */
    setLastSync2(lastSync): Promise<any> {
        console.log("last sync2 set")
        let sql = "insert into last_sync_table2(last_sync) values (?);"
        return this.db.executeSql(sql, [lastSync])

    }

    /**
         * This method querries the diversity table for a certain row based  on the input position. 
         * @param position 
         */
    getDiversityQuestion(position: number): Promise<any> {
        let sql = "select * from diversity where position = ? order by id desc limit 1";
        let params = [position];
        return this.db.executeSql(sql, params);
    }

    /**
     * This method inserts all the data stored inside the registration questionnaire cache object for a specific user_id. 
     * @param user_id 
     */
    insertCachedAnswers(user_id: number) {
        console.log("Inserting cached answers for user:" + user_id);
        let insert_sql = "INSERT INTO question_response (\
    						user_id, question_id, option_text )\
							VALUES (?, ?, ?)";
        for (let question_key in this.answerCache) {
            console.log("question_key:" + question_key);
            let answers = this.answerCache[question_key];
            console.log(answers);
            for (let index in answers) {
                let answer = answers[index];
                console.log("answer:" + answer);
                let params = [user_id, question_key, answer];
                this.db.executeSql(insert_sql, params).then(() => {
                    console.log("inserted question response:" + question_key + ":" + answer);
                });
            }
        }
    }



    /**
        * This method inserts all the data stored inside the diversity questionnaire cache object.
        * @param user_id 
        */
    insertDiversityCache() {
        console.log("Inserting cached diversity answers");
        let insert_sql = "INSERT INTO diversity_response (\
                              question_id, option_text )\
                              VALUES (?, ?)";
        for (let question_key in this.diversityCache) {
            console.log("question_key:" + question_key);
            let answers = this.diversityCache[question_key];
            console.log(answers);
            for (let index in answers) {
                let answer = answers[index];
                console.log("answer:" + answer);
                let params = [question_key, answer];
                this.db.executeSql(insert_sql, params).then(() => {
                    console.log("inserted question response:" + question_key + ":" + answer);
                });
            }
        }
    }



    /**
     * This method is used to in testing. It querries all the elements in the question_reponse table and counts the number of identical entries. 
     */
    listAllStats(): Promise<any> {
        let sql = "select user_id, recorded_at, question_id, option_text, count(*) as count  \
                from question_response \
                group by question_id, option_text";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {

                if (data.rows.length > 0) {
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

                return stats;
            },
            err => {
                console.log('Error: ', err);
                return [];
            });
    }

    /**
     * This method is used to in producing a csv of the questionnaire data. 
     */
    listAllStats2(): Promise<any> {
        let sql = "select user_id, recorded_at, question_id, option_text, count(*) as count  \
                  from question_response \
                  group by question_id, option_text";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {

                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            question_id: data.rows.item(i).question_id,
                            response: data.rows.item(i).option_text,
                            count: data.rows.item(i).count
                        });
                    }
                }

                return stats;
            },
            err => {
                console.log('Error: ', err);
                return [];
            });
    }


    /**
     * This method adds a key:value pair to the asnwerCache object. 
     * @param question_id 
     * @param answerList 
     */
    addToAnswerCache(question_id: number, answerList) {
        this.answerCache[question_id] = answerList;
    }

    /**
     * This method deletes a specific key:value pair from the answerCache object. 
     * @param question_id 
     */
    clearAnswerCache(question_id: number) {
        delete this.answerCache[question_id];
    }

    /**
     * This method is used in testing. It outputs the contents of the answerCache object to the console. 
     */
    logAnswerCache() {
        console.log(JSON.stringify(this.answerCache));
    }

    /**
     * This method adds a key:value pair to the diveristyCache object. 
     * @param question_id 
     * @param answerList 
     */
    addToDiversityCache(question_id: number, answerList) {
        this.diversityCache[question_id] = answerList;
    }

    /**
    * This method deletes a specific key:value pair from the diversityCache object. 
    * @param question_id 
    */
    clearDiversityCache(question_id: number) {
        delete this.diversityCache[question_id];
    }

    /**
    * This method is used in testing. It outputs the contents of the diversityCache object to the console. 
    */
    logDiversityCache() {
        console.log(JSON.stringify(this.diversityCache));
    }

    /**
     * This method is used in  testing. It querries all the elements from the diveristy_response table and groups them by identical entries. 
     */
    listAllDiversity(): Promise<any> {
        let sql = "select recorded_at, question_id, option_text, count(*) as count  \
        from diversity_response \
        group by question_id, option_text";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
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

    /**
     * This method is used in producing a csv of all diversity questionnaire data responses. 
     */
    listAllDiversity2(): Promise<any> {
        let sql = "select recorded_at, question_id, option_text, count(*) as count  \
        from diversity_response \
        group by question_id, option_text";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
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


    /**
     * Method provides the grpahs with the entire catalogue of login data,
     * so that graphs can be made dating as far back as records go.
     */
    listLoginDetailsForGraphs(): Promise<any> {
        let sql = "select user_id, login_ts\
        from login_history\
        ";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            user_id: data.rows.item(i).user_id,
                            login_time: data.rows.item(i).login_ts,
                        });
                    }
                }
                console.log((stats));
                console.log(JSON.stringify(stats));
                return stats;
            },
            err => {
                console.log('Error: ', err);
                return [];
            });
    }

    /**
     * Method provides the table with the entire catalogue of login data.
     * Data is to be visualised tabularly and an option is also provided
     * to download the data onto the device.
     */
    listLoginDetailsForTable(): Promise<any> {
        let sql = "SELECT sutton_user.id as id, first_name, last_name, email_address, login_ts, logout_ts\
        FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id\
        ";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            first_name: data.rows.item(i).first_name,
                            last_name: data.rows.item(i).last_name,
                            email_address: data.rows.item(i).email_address,
                            login_time: new Date(data.rows.item(i).login_ts),
                            logout_time: new Date(data.rows.item(i).logout_ts)
                        });

                    }
                }
                console.log((stats));
                console.log(JSON.stringify(stats));
                return (stats);
            },
            err => {
                console.log('Error: ', err);
                return [];
            });
    }

    /**
     * Method to provide function with login and logout data to determine whether a 
     * volunteer has forgotten to logout and, thus, needs to be logged out
     * automatically
     */
    listDetailsForAutoLogout(): Promise<any> {
        let sql = "select user_id, login_ts, logout_ts\
        from login_history\
        ";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            user_id: data.rows.item(i).user_id,
                            login_time: data.rows.item(i).login_ts,
                            logout_time: data.rows.item(i).logout_ts,
                        });
                    }
                }
                return stats;
            },
            err => {
                console.log('Error: ', err);
                return [];
            });
    }

    /**
     * Update logout time to database if the user forgets to logout and the day ends
     */
    autoLogout(user_id, dateToSetMS): Promise<void> {
        console.log("Auto logout user: " + user_id + " at time: " + dateToSetMS);
        let sql = "UPDATE login_history \
                        SET logout_ts=? \
                    WHERE user_id=?";
        let parameters = [dateToSetMS, user_id];
        console.log(parameters);
        return this.db.executeSql(sql, parameters);
    }

    /**
     * This method is used for testing. It querries all data entries from the login_history table. 
     */
    listAllLog(): Promise<any> {
        let sql = "select user_id, login_ts, logout_ts\
        from login_history\
        group by user_id";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
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


    /**
     * This method is used for testing. It querries all data entries from the sutton_user table. 
     */
    listAllRegistration(): Promise<any> {
        let sql = "select * from sutton_user";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            user_id: data.rows.item(i).id.toString(),
                            first_name: data.rows.item(i).first_name,
                            last_name: data.rows.item(i).last_name,
                            email_address: data.rows.item(i).email_address,
                            phone_number: data.rows.item(i).phone_number,
                            address: data.rows.item(i).address,
                            postcode: data.rows.item(i).postcode,
                            emergency_name: data.rows.item(i).emergency_name,
                            emergency_telephone: data.rows.item(i).emergency_telephone,
                            emergency_relationship: data.rows.item(i).emergency_relationship

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

    /**
     * This method clears the sutton_user table including the auto-incrementing field. 
     */
    clearRegistrationDb(): Promise<any> {

        console.log("clearRegistrationDB function called");
        let sql = "delete from sutton_user";
        let sql2 = "delete from sqlite_sequence where name='sutton_user'"
        return this.db.executeSql(sql, {})
            .then(() => {
                console.log("sutton_user  table reset to zero");


                return this.db.executeSql(sql2, {})
                    .then(() => {
                        console.log("sutton_user autoincrement reset to zero");
                    }).catch(e => console.log(e));

            }).catch(e => console.log(e));


    }

    /**
     * This method adds data from an array to the sutton_user table. 
     * @param data 
     */
    registerUserFromDB(data): Promise<any> {
        var sql = "insert into sutton_user(\
                        id, first_name, last_name, \
                        email_address, \
                        phone_number, \
                        address, postcode, \
                        emergency_name,\
                        emergency_telephone,\
                        emergency_relationship\
                    ) values (?,?,?,?,?,?,?,?,?,?)";
        var values = [
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5],
            data[6],
            data[7],
            data[8],
            data[9]
        ];

        return this.db.executeSql(sql, values).catch(e => console.log(e));
    }

    /**
     * This method querries all the rows from the question_response table. It is used in the admin-home.ts file and for testing purposes. 
     */
    listAllStatsNoCount(): Promise<any> {
        let sql = "select id, user_id, recorded_at, question_id, option_text  \
                  from question_response\
                  order by user_id, question_id";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            id: data.rows.item(i).id,
                            user_id: data.rows.item(i).user_id,
                            recorded_at: data.rows.item(i).recorded_at,
                            question_id: data.rows.item(i).question_id,
                            response: data.rows.item(i).option_text,
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


    /**
    * This method clears the question_response table including the auto-incrementing field. 
    */
    clearRegistrationQuestionnaireDB(): Promise<any> {

        console.log("clearRegistrationQuestionnaireDB function called");
        let sql = "delete from question_response";
        let sql2 = "delete from sqlite_sequence where name='question_response'"
        return this.db.executeSql(sql, {})
            .then(() => {
                console.log("question_response  table reset to zero");


                return this.db.executeSql(sql2, {})
                    .then(() => {
                        console.log("question_response autoincrement reset to zero");
                    }).catch(e => console.log(e));

            }).catch(e => console.log(e));


    }


    /**
    * This method clears the login_history table including the auto-incrementing field. 
    */
    clearLoginHistoryDB(): Promise<any> {

        console.log("clearLoginHistoryDB function called");
        let sql = "delete from login_history";
        let sql2 = "delete from sqlite_sequence where name='login_history'"
        return this.db.executeSql(sql, {})
            .then(() => {
                console.log("login_history  table reset to zero");


                return this.db.executeSql(sql2, {})
                    .then(() => {
                        console.log("login_history autoincrement reset to zero");
                    }).catch(e => console.log(e));

            }).catch(e => console.log(e));


    }


    /**
    * This method clears the diversity_response table including the auto-incrementing field. 
    */
    clearDiversityQuestionnaireDB(): Promise<any> {

        console.log("clearDiversityQuestionnaireDB function called");
        let sql = "delete from diversity_response";
        let sql2 = "delete from sqlite_sequence where name='diversity_response'"
        return this.db.executeSql(sql, {})
            .then(() => {
                console.log("diversity_response  table reset to zero");


                return this.db.executeSql(sql2, {})
                    .then(() => {
                        console.log("diversity_response autoincrement reset to zero");
                    }).catch(e => console.log(e));

            }).catch(e => console.log(e));


    }


    /**
  * This method querries all the rows from the diversity_response table. It is used in the admin-home.ts file and for testing purposes. 
  */
    listAllDiversityNoCount(): Promise<any> {
        let sql = "select id, recorded_at, question_id, option_text\
        from diversity_response\
        order by recorded_at, question_id";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            id: data.rows.item(i).id,
                            recorded_at: data.rows.item(i).recorded_at,
                            question_id: data.rows.item(i).question_id,
                            response: data.rows.item(i).option_text
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



    /**
     * Thie method querries all the data entries from the last_sync table. It is used for testing purposes. 
     */
    listLastSync(): Promise<any> {
        let sql = "select * from last_sync_table";
        let stats = [];
        return this.db.executeSql(sql, [])
            .then(
            (data) => {
                //console.log(JSON.stringify(data));
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        stats.push({
                            id: data.rows.item(i).id,
                            date: data.rows.item(i).last_sync,
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

    /**
     * This method adds data from an array to the login_history table. 
     * @param data 
     */
    addLoginDataToDB(data): Promise<any> {
        var sql = "insert into login_history(\
                        id, user_id, \
                        login_ts, \
                        logout_ts\
                    ) values (?,?,?,?)";
        var values = [
            data[0],
            data[1],
            data[2],
            data[3]
        ];

        return this.db.executeSql(sql, values).catch(e => console.log(e));
    }


    /**
       * This method adds data from an array to the question_response table. 
       * @param data 
       */
    addRegistrationQuestionnaireToDB(data): Promise<any> {
        var sql = "insert into question_response(\
                        id, user_id, \
                        recorded_at, \
                        question_id, option_text\
                    ) values (?,?,?,?,?)";
        var values = [
            data[0],
            data[1],
            data[2],
            data[3],
            data[4]
        ];

        return this.db.executeSql(sql, values).catch(e => console.log(e));
    }

    /**
       * This method adds data from an array to the diversity_response table. 
       * @param data 
       */
    addDiversityQuestionnaireToDB(data): Promise<any> {
        var sql = "insert into diversity_response(\
                        id,\
                        recorded_at,\
                        question_id, option_text\
                    ) values (?,?,?,?)";
        var values = [
            data[0],
            data[1],
            data[2],
            data[3],
        ];

        return this.db.executeSql(sql, values).catch(e => console.log(e));
    }

    /**
     * This method resets the answerCache object. 
     */
    resetAnswerCache() {
        this.answerCache = {};
    }

    /**
     * This method resets the diversityCache object. 
     */
    resetDiversityCache() {
        this.diversityCache = {};
    }






}


