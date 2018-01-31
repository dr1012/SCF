import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {


    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    loginText = 'Login';
    lastNameInput = '';

    showList: boolean = false;
    items: any;
    selectedItem: any;

    constructor(public http: Http,
        public navCtrl: NavController,
        private alertController: AlertController,
        private sqlitedatabase: sqlitedatabase,
        private storage: Storage) {


        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(wallpaperID => {
            console.log(wallpaperID);

            if (wallpaperID == "autumn") {
                this.winter = false;
                this.summer = false;
                this.autumn = true;
                this.spring = false;
            } else if (wallpaperID == "summer") {
                this.winter = false;
                this.summer = true;
                this.autumn = false;
                this.spring = false;
            } else if (wallpaperID == "winter") {
                this.winter = true;
                this.summer = false;
                this.autumn = false;
                this.spring = false;
            } else if (wallpaperID == "spring") {
                this.winter = false;
                this.summer = false;
                this.autumn = false;
                this.spring = true;
            }

        });

        this.autoLogoutUser();
    }

    /**
   * This method retrieves the name suggestions from the local database. It querries the sutton_user table for users who's last name has some similarity to the 
   * input lastname in the text input box. 
   * @param ev 
   */
    getItems(ev: any) {
        this.loginText = "Login";
        // set val to the value of the searchbar
        let val = ev.target.value || '';

        // populate the list from database
        this.sqlitedatabase.suggestLastName(val)
            .then((data) => {
                if (data == null) {
                    console.log("no data in table");
                    return [];
                }

                this.items = [];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        this.items.push({
                            id: data.rows.item(i).id,
                            first_name: data.rows.item(i).first_name,
                            last_name: data.rows.item(i).last_name,
                        });
                    }

                }
                // Show the results
                this.showList = true;

            }, err => {
                console.log('Error: ', err);
                return [];
            });

        // hide the results when the query is empty
        this.showList = false;

    }

    onEnter() {
        console.log("on enter")
        this.setSelection(this.items[0]);
    }

    /**
     * This method takes the selected name by the user and parses it to the login button so that the user's name is displayed on the button.
     * @param item 
     */
    setSelection(item: any) {
        console.log("selected item:" + JSON.stringify(item));
        this.selectedItem = item;
        this.lastNameInput = item.last_name;
        this.showList = false;
        this.loginText = "Login (" + item.first_name + " " + item.last_name + ")";
    }



    /**
    * This method is called when the login button is clicked. It  registers the login times stamp of the user into the login_history table. 
    * It then informs the user of the success status of the operation through an alert message.
    * If a user is already logged in , the alert message will warn the user of this. 
    */
    loginToApp() {
        if (this.selectedItem == undefined || this.selectedItem.id == undefined) {
            let addTodoAlert = this.alertController.create({
                title: "Warning!!",
                message: "Please select your name to login",
            });
            addTodoAlert.present();
        } else {
            this.sqlitedatabase.last_login(this.selectedItem.id)
                .then((data) => {
                    console.log("Last Login: " + JSON.stringify(data.rows.item(0)));
                    if (data.rows.length == 0 || data.rows.item(0).logout_ts != undefined) {
                        this.sqlitedatabase.login(this.selectedItem.id)
                            .then(() => {
                                this.showLoginResponse("Login successful");
                                // clear lastname
                                this.clearLogin();
                            }, err => {
                                this.showLoginResponse("Login failed");
                                console.log('Error1: ', err);
                            });
                    } else {
                        this.showLoginResponse("Already logged in.");
                    }
                }).catch(e => {
                    console.log('Error2: ', e);
                    this.showLoginResponse("Login failed");
                });
        }
    }

    /**
    * This method is called when a person logs in and shows an alert message with information that the login was succesfull. 
    * @param response 
    */
    showLoginResponse(response) {
        let loginResultAlert = this.alertController.create({
            title: "Login Response",
            message: response,
        });
        loginResultAlert.present();
    }

    /**
     * This method clears the variables so that they can be used by the next user and resets the text of the login button to 'Login'
     */
    clearLogin() {
        this.lastNameInput = '';
        this.selectedItem = undefined;
        this.loginText = 'Login';
    }

    /**
    * This method takes the user back to the homepage.
    * @param params 
    */
    goToHomepage(params) {
        if (!params) params = {};
        this.navCtrl.push(HomepagePage);
    }

    /**
     * This method takes the user back to the previous page which in this case is the homepage.
     */
    goBack() {
        this.navCtrl.pop();
    }

    /**
     * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
     * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
     * that the farm shuts.
     * 2) The auto-logout is executed after the day on which the volunteer logged in.
     */
    autoLogoutUser() {
        this.sqlitedatabase.listDetailsForAutoLogout()
            .then((stats) => {
                var d = new Date(); //Gives the current time and date
                var currentTimeMS = d.getTime();

                for (var j = 0; j < stats.length; j++) {
                    //Below gives us the date to compare
                    var handledTotalDate = new Date(stats[j].login_time);
                    var handledYear = handledTotalDate.getFullYear();
                    var handledMonth = handledTotalDate.getMonth(); //Month in date format is 0-11
                    var handledDate = handledTotalDate.getDate();

                    var logoutTime = new Date(stats[j].logout_time); //Finds if the logout time exists

                    if (logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)" || logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (BST)") {
                        var logoutBoolean = 0; //If logout time is null, given date Thu Jan 01 1970...
                    } else {
                        logoutBoolean = 1;
                    }

                    //Creates a logout date on the same day as the login data for 17:00
                    var dateToSet = new Date();
                    dateToSet.setDate(handledDate);
                    dateToSet.setFullYear(handledYear);
                    dateToSet.setMonth(handledMonth);
                    dateToSet.setHours(16);
                    dateToSet.setMinutes(30, 0, 0);

                    console.log("Date to set: " + dateToSet);
                    var dateToSetMS = dateToSet.getTime();

                    console.log("Time to set: " + dateToSetMS);
                    var reverseDateTest = new Date(dateToSetMS);
                    console.log("Reverse test: " + reverseDateTest);

                    //Logs the user out if it finds the value of logoutBoolean = 0
                    if (currentTimeMS > dateToSetMS && logoutBoolean === 0) {
                        //Logout user at 17:00 of current date, if it is passed that time on the same day
                        this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
                            .then(() => {

                            }, err => {
                                console.log('Error1: ', err);
                            });
                    } else {
                        console.log("Already logged out");
                    }


                }
            }
            , err => {
                console.log("something went wrong on auto-logging out users");
            });
    }


}
