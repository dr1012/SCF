webpackJsonp([0],{

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginPage = (function () {
    function LoginPage(http, navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.loginText = 'Login';
        this.lastNameInput = '';
        this.showList = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.autoLogoutUser();
    }
    /**
   * This method retrieves the name suggestions from the local database. It querries the sutton_user table for users who's last name has some similarity to the
   * input lastname in the text input box.
   * @param ev
   */
    LoginPage.prototype.getItems = function (ev) {
        var _this = this;
        this.loginText = "Login";
        // set val to the value of the searchbar
        var val = ev.target.value || '';
        // populate the list from database
        this.sqlitedatabase.suggestLastName(val)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return [];
            }
            _this.items = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    _this.items.push({
                        id: data.rows.item(i).id,
                        first_name: data.rows.item(i).first_name,
                        last_name: data.rows.item(i).last_name,
                    });
                }
            }
            // Show the results
            _this.showList = true;
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
        // hide the results when the query is empty
        this.showList = false;
    };
    LoginPage.prototype.onEnter = function () {
        console.log("on enter");
        this.setSelection(this.items[0]);
    };
    /**
     * This method takes the selected name by the user and parses it to the login button so that the user's name is displayed on the button.
     * @param item
     */
    LoginPage.prototype.setSelection = function (item) {
        console.log("selected item:" + JSON.stringify(item));
        this.selectedItem = item;
        this.lastNameInput = item.last_name;
        this.showList = false;
        this.loginText = "Login (" + item.first_name + " " + item.last_name + ")";
    };
    /**
    * This method is called when the login button is clicked. It  registers the login times stamp of the user into the login_history table.
    * It then informs the user of the success status of the operation through an alert message.
    * If a user is already logged in , the alert message will warn the user of this.
    */
    LoginPage.prototype.loginToApp = function () {
        var _this = this;
        if (this.selectedItem == undefined || this.selectedItem.id == undefined) {
            var addTodoAlert = this.alertController.create({
                title: "Warning!!",
                message: "Please select your name to login",
            });
            addTodoAlert.present();
        }
        else {
            this.sqlitedatabase.last_login(this.selectedItem.id)
                .then(function (data) {
                console.log("Last Login: " + JSON.stringify(data.rows.item(0)));
                if (data.rows.length == 0 || data.rows.item(0).logout_ts != undefined) {
                    _this.sqlitedatabase.login(_this.selectedItem.id)
                        .then(function () {
                        _this.showLoginResponse("Login successful");
                        // clear lastname
                        _this.clearLogin();
                    }, function (err) {
                        _this.showLoginResponse("Login failed");
                        console.log('Error1: ', err);
                    });
                }
                else {
                    _this.showLoginResponse("Already logged in.");
                }
            }).catch(function (e) {
                console.log('Error2: ', e);
                _this.showLoginResponse("Login failed");
            });
        }
    };
    /**
    * This method is called when a person logs in and shows an alert message with information that the login was succesfull.
    * @param response
    */
    LoginPage.prototype.showLoginResponse = function (response) {
        var loginResultAlert = this.alertController.create({
            title: "Login Response",
            message: response,
        });
        loginResultAlert.present();
    };
    /**
     * This method clears the variables so that they can be used by the next user and resets the text of the login button to 'Login'
     */
    LoginPage.prototype.clearLogin = function () {
        this.lastNameInput = '';
        this.selectedItem = undefined;
        this.loginText = 'Login';
    };
    /**
    * This method takes the user back to the homepage.
    * @param params
    */
    LoginPage.prototype.goToHomepage = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user back to the previous page which in this case is the homepage.
     */
    LoginPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    /**
     * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
     * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
     * that the farm shuts.
     * 2) The auto-logout is executed after the day on which the volunteer logged in.
     */
    LoginPage.prototype.autoLogoutUser = function () {
        var _this = this;
        this.sqlitedatabase.listDetailsForAutoLogout()
            .then(function (stats) {
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
                }
                else {
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
                    _this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
                        .then(function () {
                    }, function (err) {
                        console.log('Error1: ', err);
                    });
                }
                else {
                    console.log("Already logged out");
                }
            }
        }, function (err) {
            console.log("something went wrong on auto-logging out users");
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\login\login.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Login-Logo.png" style="display:block;width:35%;height:auto;margin-left:auto;margin-right:auto;" />\n            </h1>\n\n        </ion-row>\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goToHomepage()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <br>\n        <br>\n        <ion-row>\n\n            <ion-col>\n                <h2 class="white-text" id="login-heading1" style="color:#ffffff;" align="center">\n                    Please start typing in your last name and choose from the drop-down list\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row>\n\n        </ion-row>\n        <br>\n        <br>\n\n        <ion-row>\n\n            <ion-col>\n\n\n                <form id="Login-form2" style="display:block;margin-left:auto;margin-right:auto;">\n                    <ion-searchbar #q (keyup.enter)="onEnter()" [(ngModel)]="lastNameInput" [ngModelOptions]="{standalone: true}" (ionInput)="getItems($event)"\n                        animation="false" placeholder="Last Name" class="full-width-select" style="width:300px" style="display:block;margin-left:auto;margin-right:auto;">\n                    </ion-searchbar>\n                    <ion-list *ngIf="showList">\n                        <ion-item *ngFor="let item of items" (click)=\'setSelection(item);\'>\n                            {{ item.first_name }} {{item.last_name}}\n                        </ion-item>\n                    </ion-list>\n                </form>\n\n\n\n\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-col>\n\n                <a id="login-button27" class="semi-transparent-button" href="#" on-click="loginToApp()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <ion-icon name="log-in"></ion-icon>\n                        <label> {{loginText}} </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n        </ion-row>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\login\login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdminPage = (function () {
    function AdminPage(navCtrl, alertController, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.storage = storage;
        this.passwordInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
            * This is the logic that assigns the desired background, chosen in
            * admin-app-settings.ts, to the background of the current page.
            */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * Method takes administrator to the admin homepage, provided the
     * correct password is entered.
     */
    AdminPage.prototype.goToAdminHome = function () {
        if (this.passwordInput === "Squash88") {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__["a" /* AdminHomePage */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning!",
                message: "Incorrect Password",
            });
            addTodoAlert.present();
        }
    };
    /**
     * Method returns user to the homepage.
     */
    AdminPage.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    AdminPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-admin',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\admin\admin.html"*/'<!-- ADMIN LOG IN PAGE -->\n\n<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Admin_Logo.png" style="display:block;width:35%;height:auto;margin-left:auto;margin-right:auto;" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n        <ion-row>\n            <ion-col>\n                <!-- Back button, to homepage -->\n                <a id="admin-back-button" class="nav-button" href="#" on-click="goToHomepage()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n            <ion-col>\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <br>\n            <br>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col></ion-col>\n            <ion-col>\n                <!-- Password Entry Form -->\n                <ion-item>\n                    <ion-input type="password" placeholder="Password Input" class="password-container" [(ngModel)]="passwordInput"></ion-input>\n                </ion-item>\n                <br>\n            </ion-col>\n            <ion-col></ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col></ion-col>\n\n            <ion-col>\n\n                <!-- Admin Log in button -->\n                <a id="admin-login-button1" class="semi-transparent-button" href="#" on-click="goToAdminHome()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="log-in"></ion-icon>\n                        <label> &#8239; Login as Admin</label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col></ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\admin\admin.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], AdminPage);
    return AdminPage;
}());

//# sourceMappingURL=admin.js.map

/***/ }),

/***/ 152:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 152;

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminVisitorDataPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__graph1_graph1__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph2_graph2__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph3_graph3__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__graph4_graph4__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__graph_scatter1_graph_scatter1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__graph_scatter2_graph_scatter2__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__graph_scatter3_graph_scatter3__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__graph_scatter4_graph_scatter4__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__graph_scatter5_graph_scatter5__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__graph_pie2_graph_pie2__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__graph_pie3_graph_pie3__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__graph_pie4_graph_pie4__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__graph_pie5_graph_pie5__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__graph_bar1_graph_bar1__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__graph_bar2_graph_bar2__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__graph_bar3_graph_bar3__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__graph_bar4_graph_bar4__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__graph_bar5_graph_bar5__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};























var AdminVisitorDataPage = (function () {
    function AdminVisitorDataPage(navCtrl, navParams, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.toggled = false;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * Method returns the administrator to the homepage, effectively 'logging' them out.
     */
    AdminVisitorDataPage.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * Method returns admin to the admin homepage
     */
    AdminVisitorDataPage.prototype.goToAdminHome = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__["a" /* AdminHomePage */]);
    };
    /**
     * Methods for Graph 1
     */
    AdminVisitorDataPage.prototype.goToGraph1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__graph1_graph1__["a" /* Graph1Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraph2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph2_graph2__["a" /* Graph2Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraph4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__graph4_graph4__["a" /* Graph4Page */]);
    };
    /**
     * Methods for Graph 2
     */
    AdminVisitorDataPage.prototype.goToGraphScatter1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__graph_scatter1_graph_scatter1__["a" /* GraphScatter1Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraph3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph3_graph3__["a" /* Graph3Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphBar1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_17__graph_bar1_graph_bar1__["a" /* GraphBar1Page */]);
    };
    /**
     * Methods for Graph 3
     */
    AdminVisitorDataPage.prototype.goToGraphScatter2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__graph_scatter2_graph_scatter2__["a" /* GraphScatter2Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphPie2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__graph_pie2_graph_pie2__["a" /* GraphPie2Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphBar2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_18__graph_bar2_graph_bar2__["a" /* GraphBar2Page */]);
    };
    /**
     * Methods for Graph 4
     */
    AdminVisitorDataPage.prototype.goToGraphScatter3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__graph_scatter3_graph_scatter3__["a" /* GraphScatter3Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphPie3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_14__graph_pie3_graph_pie3__["a" /* GraphPie3Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphBar3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_19__graph_bar3_graph_bar3__["a" /* GraphBar3Page */]);
    };
    /**
     * Methods for Graph 5
     */
    AdminVisitorDataPage.prototype.goToGraphScatter4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__graph_scatter4_graph_scatter4__["a" /* GraphScatter4Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphPie4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__graph_pie4_graph_pie4__["a" /* GraphPie4Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphBar4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_20__graph_bar4_graph_bar4__["a" /* GraphBar4Page */]);
    };
    /**
     * Methods for Graph 6
     */
    AdminVisitorDataPage.prototype.goToGraphScatter5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__graph_scatter5_graph_scatter5__["a" /* GraphScatter5Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphPie5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_16__graph_pie5_graph_pie5__["a" /* GraphPie5Page */]);
    };
    AdminVisitorDataPage.prototype.goToGraphBar5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_21__graph_bar5_graph_bar5__["a" /* GraphBar5Page */]);
    };
    AdminVisitorDataPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-admin-visitor-data',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\admin-visitor-data\admin-visitor-data.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminHome()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminHome()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n\n\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 1) Number of Unique Visits Per Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraph1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n        <br>\n        <ion-row>\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 2) Total Number of Visits Per Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n        </ion-row>\n        <br>\n        <ion-row>\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 3) Total Number of Unique Visits </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter2()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar2()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n        </ion-row>\n        <br>\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 4) Number of Unique Visits Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n        <br>\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 5) Total Number of Visits Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie4()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n        <br>\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 6) Categorised Visits Over Last 12 Months </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie5()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n    </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\admin-visitor-data\admin-visitor-data.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_22__ionic_storage__["b" /* Storage */]])
    ], AdminVisitorDataPage);
    return AdminVisitorDataPage;
}());

//# sourceMappingURL=admin-visitor-data.js.map

/***/ }),

/***/ 193:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 193;

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register0Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register1_register1__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Register0Page = (function () {
    function Register0Page(navCtrl, alertController, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method takes the user back to the HomePage page.
     */
    Register0Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page.
     */
    Register0Page.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    /**
     * This method takes the user to the Register1Page page.
     */
    Register0Page.prototype.goRegister1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register1_register1__["a" /* Register1Page */]);
    };
    /**
     * This method displays an alert message.
     */
    Register0Page.prototype.Not16 = function () {
        var addTodoAlert = this.alertController.create({
            title: "Warning",
            message: "You have to be at least 16 years old to register. Please contact a member of staff",
        });
        addTodoAlert.present();
    };
    Register0Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register0',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register0\register0.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n            </h1>\n\n        </ion-row>\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <br>\n                <br>\n                <h2 id="register0-heading21" class="white-text">\n                    Are you over 16 years old?\n\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister1()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="checkmark"></ion-icon>\n                        <label> Yes</label>\n                    </div>\n                </a>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="Not16()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="close"></ion-icon>\n                        <label> No</label>\n                    </div>\n                </a>\n            </ion-col>\n\n\n\n\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register0\register0.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], Register0Page);
    return Register0Page;
}());

//# sourceMappingURL=register0.js.map

/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register2_register2__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Register1Page = (function () {
    function Register1Page(http, navCtrl, alertController, shareprovider, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.storage = storage;
        this.firstNameInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.showList = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
     */
    Register1Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method deletes the last user entry and takes the user to the previous page.
     */
    Register1Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('first_name');
        this.navCtrl.pop();
    };
    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page.
     */
    Register1Page.prototype.goRegister2 = function () {
        if (this.firstNameInput) {
            this.shareprovider.updateRegistrationInfo('first_name', this.firstNameInput);
            console.log(this.shareprovider.getRegistrationInfo());
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register2_register2__["a" /* Register2Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your First Name",
            });
            addTodoAlert.present();
        }
    };
    Register1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register1\register1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n\n\n\n    <ion-row>\n      <br>\n      <br>\n\n\n      <ion-col>\n        <h2 class="white-text" id="login-heading1">\n          Please type in your first name:\n        </h2>\n      </ion-col>\n\n\n      <br>\n      <br>\n    </ion-row>\n\n\n\n    <ion-row>\n\n\n\n      <ion-col></ion-col>\n      <ion-col>\n        <form id="Register-form1" style="display:block;margin-left:auto;margin-right:auto;">\n          <ion-item id="Register-input1">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="firstNameInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n      <ion-col></ion-col>\n\n\n\n\n    </ion-row>\n    <ion-row>\n\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister2()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n\n    </ion-row>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register1\register1.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Register1Page);
    return Register1Page;
}());

//# sourceMappingURL=register1.js.map

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register3_register3__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Register2Page = (function () {
    function Register2Page(http, navCtrl, alertController, shareprovider, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.storage = storage;
        this.lastNameInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.showList = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    Register2Page.prototype.onEnter = function () {
        this.setName(this.items[0]);
    };
    Register2Page.prototype.setName = function (item) {
        console.log(item);
        this.lastNameInput = item;
        this.showList = false;
    };
    /**
         * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
         */
    Register2Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    Register2Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('first_name');
        this.navCtrl.pop();
    };
    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page.
     */
    Register2Page.prototype.goRegister3 = function () {
        if (this.lastNameInput) {
            this.shareprovider.updateRegistrationInfo('last_name', this.lastNameInput);
            console.log(this.shareprovider.getRegistrationInfo());
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register3_register3__["a" /* Register3Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your Last Name",
            });
            addTodoAlert.present();
        }
    };
    Register2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register2\register2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <br>\n      <br>\n      <ion-col>\n        <h2 id="login-heading1" class="white-text">\n          Please type in your surname:\n        </h2>\n      </ion-col>\n\n\n      <br>\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col></ion-col>\n\n      <ion-col>\n\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;">\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="lastNameInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n    </ion-row>\n    <ion-row>\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister3()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n\n    </ion-row>\n\n\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register2\register2.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Register2Page);
    return Register2Page;
}());

//# sourceMappingURL=register2.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register4_register4__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Register3Page = (function () {
    function Register3Page(navCtrl, alertController, shareprovider, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.storage = storage;
        this.emailInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
     */
    Register3Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    Register3Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('last_name');
        this.navCtrl.pop();
    };
    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page.
     */
    Register3Page.prototype.goRegister4 = function () {
        if (this.emailInput) {
            if (this.emailInput.includes("@")) {
                this.shareprovider.updateRegistrationInfo('email_address', this.emailInput);
                console.log(this.shareprovider.getRegistrationInfo());
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register4_register4__["a" /* Register4Page */]);
            }
            else {
                var addTodoAlert = this.alertController.create({
                    title: "Warning!!",
                    message: "Please a valid email address",
                });
                addTodoAlert.present();
            }
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your email address",
            });
            addTodoAlert.present();
        }
    };
    Register3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register3\register3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <br>\n      <br>\n      <ion-col>\n        <h2 id="login-heading1" class="white-text">\n          Please enter your email address:\n        </h2>\n      </ion-col>\n\n      <br>\n      <br>\n\n    </ion-row>\n\n\n\n    <ion-row>\n      <ion-col>\n\n      </ion-col>\n      <ion-col>\n\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;">\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="email" placeholder="" [(ngModel)]="emailInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n      <ion-col>\n\n\n      </ion-col>\n    </ion-row>\n    <ion-row>\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister4()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n\n    </ion-row>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register3\register3.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Register3Page);
    return Register3Page;
}());

//# sourceMappingURL=register3.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register5_register5__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Register4Page = (function () {
    function Register4Page(navCtrl, alertController, shareprovider, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.storage = storage;
        this.telInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
     */
    Register4Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    Register4Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('email_address');
        this.navCtrl.pop();
    };
    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page.
     */
    Register4Page.prototype.goRegister5 = function () {
        if (this.telInput) {
            if (this.telInput.length > 0) {
                this.shareprovider.updateRegistrationInfo('phone_number', this.telInput);
                console.log(this.shareprovider.getRegistrationInfo());
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register5_register5__["a" /* Register5Page */]);
            }
            else {
                var addTodoAlert = this.alertController.create({
                    title: "Warning!!",
                    message: "Please enter a telephone number, for example: 07123456789",
                });
                addTodoAlert.present();
            }
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your telephone number",
            });
            addTodoAlert.present();
        }
    };
    Register4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register4\register4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <br>\n      <br>\n      <ion-col>\n        <h2 id="login-heading1" class="white-text">\n          Please enter your telephone number:\n        </h2>\n      </ion-col>\n\n\n      <br>\n      <br>\n\n    </ion-row>\n\n\n\n    <ion-row>\n      <ion-col>\n      </ion-col>\n      <ion-col>\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;">\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="tel" placeholder="" [(ngModel)]="telInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n      <ion-col>\n\n\n\n      </ion-col>\n    </ion-row>\n    <ion-row>\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister5()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n\n    </ion-row>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register4\register4.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Register4Page);
    return Register4Page;
}());

//# sourceMappingURL=register4.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register5Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__register6_register6__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Register5Page = (function () {
    function Register5Page(http, navCtrl, alertController, shareprovider, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.storage = storage;
        this.addressInput = '';
        this.postcodeInput = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
     */
    Register5Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    Register5Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('phone_number');
        this.navCtrl.pop();
    };
    /**
         * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page.
         */
    Register5Page.prototype.goRegister6 = function () {
        if (this.addressInput && this.postcodeInput) {
            this.shareprovider.updateRegistrationInfo('address', this.addressInput);
            this.shareprovider.updateRegistrationInfo('postcode', this.postcodeInput);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__register6_register6__["a" /* Register6Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter both address and postcode",
            });
            addTodoAlert.present();
        }
    };
    Register5Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register5',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register5\register5.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <br>\n      <br>\n      <ion-col>\n        <h2 id="login-heading1" class="white-text">\n          Please enter your address and postcode:\n        </h2>\n      </ion-col>\n\n      <br>\n      <br>\n      <br>\n      <br>\n\n    </ion-row>\n\n\n\n    <ion-row>\n      <ion-col>\n        <h3 id="login-heading4" class="white-text">\n          Address:\n        </h3>\n      </ion-col>\n\n      <ion-col>\n\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;" float-left>\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="addressInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n        <br>\n        <br>\n        <br>\n        <br>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <ion-col>\n        <h3 id="login-heading4" class="white-text">\n          Postcode:\n        </h3>\n      </ion-col>\n      <ion-col>\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;" float-left>\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="postcodeInput" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n\n    </ion-row>\n    <ion-row>\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister6()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n    </ion-row>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register5\register5.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Register5Page);
    return Register5Page;
}());

//# sourceMappingURL=register5.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register6Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__questionnaire1_questionnaire1__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var Register6Page = (function () {
    function Register6Page(http, navCtrl, alertController, shareprovider, dbProvider, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.dbProvider = dbProvider;
        this.storage = storage;
        this.emergency_name = '';
        this.emergency_telephone = '';
        this.emergency_relationship = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page.
     */
    Register6Page.prototype.goToHomepage = function () {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    Register6Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('address');
        this.shareprovider.deleteItemFromRegistration('postcode');
        this.navCtrl.pop();
    };
    /**
     * This method adds the elements of the registration_info object in the share.ts file where the registration data is temporarly stored to the sutton_user SQLite table.
     */
    Register6Page.prototype.registerAccount = function () {
        var _this = this;
        console.log(this.shareprovider.getRegistrationInfo());
        this.dbProvider.registerUser(this.shareprovider.getRegistrationInfo())
            .then(function (data) {
            console.log("registered output data:" + JSON.stringify(data));
            console.log("id: " + data.insertId);
            _this.showAlert("Success", "Registration is successful. Id:" + data.insertId);
            _this.shareprovider.setUserId(data.insertId);
        }).catch(function (e) {
            _this.showAlert("Failure", "Something went wrong on registering user");
            console.log(e);
        });
        ;
    };
    /**
     * This method registers the user input in the registration_info object in the share.ts file adds all the elements of the object to the sutton_user SQLite table (through the registerAccount() method) and takes the user to the next page.
     */
    Register6Page.prototype.goRegister7 = function () {
        if (this.emergency_name && this.emergency_telephone && this.emergency_relationship) {
            this.shareprovider.updateRegistrationInfo('emergency_name', this.emergency_name);
            this.shareprovider.updateRegistrationInfo('emergency_telephone', this.emergency_telephone);
            this.shareprovider.updateRegistrationInfo('emergency_relationship', this.emergency_relationship);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
            this.registerAccount();
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__questionnaire1_questionnaire1__["a" /* Questionnaire1Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please complete all three fields",
            });
            addTodoAlert.present();
        }
    };
    Register6Page.prototype.showAlert = function (title, message) {
        var alert = this.alertController.create({
            title: title,
            message: message,
        });
        alert.present();
    };
    Register6Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register6',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\register6\register6.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Register-Logo.png" style="display:block;width:50%;height:auto;margin-left:auto;margin-right:auto;" />\n      </h1>\n\n    </ion-row>\n\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <br>\n      <br>\n      <ion-col>\n        <h2 id="login-heading1" class="white-text">\n          Who should we contact in the event of an emergency?\n        </h2>\n      </ion-col>\n\n      <br>\n      <br>\n      <br>\n      <br>\n\n    </ion-row>\n\n\n\n    <ion-row>\n      <ion-col>\n        <h3 id="login-heading4" class="white-text">\n          Name:\n        </h3>\n      </ion-col>\n\n      <ion-col>\n\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;" float-left>\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="emergency_name" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n        <br>\n        <br>\n        <br>\n        <br>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <ion-col>\n        <h3 id="login-heading4" class="white-text">\n          Telephone:\n        </h3>\n      </ion-col>\n      <ion-col>\n\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;" float-left>\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="tel" placeholder="" [(ngModel)]="emergency_telephone" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n\n    </ion-row>\n\n\n    <ion-row>\n      <ion-col>\n        <h3 id="login-heading4" class="white-text">\n          Relationship to you:\n        </h3>\n      </ion-col>\n      <ion-col>\n        <form id="login-form2" style="display:block;margin-left:auto;margin-right:auto;" float-left>\n          <ion-item id="login-input2">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="" [(ngModel)]="emergency_relationship" [ngModelOptions]="{standalone: true}" style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n\n    </ion-row>\n    <ion-row>\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goRegister7()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n    </ion-row>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\register6\register6.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */]])
    ], Register6Page);
    return Register6Page;
}());

//# sourceMappingURL=register6.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire2_questionnaire2__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_share_share__ = __webpack_require__(32);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Questionnaire1Page = (function () {
    function Questionnaire1Page(navCtrl, alertController, shareprovider, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.shareprovider = shareprovider;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            'Outdoors:  Growing and harvesting',
            'Indoors: Portioning and packing vegetables',
            'DIY annd improving infrastructure',
            'Supporting others (social/therapeutic horticulture)',
            'Supporting events and markets',
            'Other',
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire1Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(1)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire1Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire2_questionnaire2__["a" /* Questionnaire2Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
    * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
    */
    Questionnaire1Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire1Page.prototype.goBack = function () {
        this.shareprovider.deleteItemFromRegistration('emergency_name');
        this.shareprovider.deleteItemFromRegistration('emergency_telephone');
        this.shareprovider.deleteItemFromRegistration('emergency_relationship');
        this.navCtrl.pop();
    };
    Questionnaire1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire1\questionnaire1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire1\questionnaire1.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire1Page);
    return Questionnaire1Page;
}());

//# sourceMappingURL=questionnaire1.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire3_questionnaire3__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire2Page = (function () {
    function Questionnaire2Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.choices = [
            'To learn new skills',
            'To meet people',
            'For exercise',
            'For enjoyment',
            'To do something different',
            'To improve my mental wellbeing',
            'Other',
        ];
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire2Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(2)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire2Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire3_questionnaire3__["a" /* Questionnaire3Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
     */
    Questionnaire2Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire2Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire2\questionnaire2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire2\questionnaire2.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire2Page);
    return Questionnaire2Page;
}());

//# sourceMappingURL=questionnaire2.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire4_questionnaire4__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire3Page = (function () {
    function Questionnaire3Page(navCtrl, sqlitedatabase, alertController, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlitedatabase = sqlitedatabase;
        this.alertController = alertController;
        this.storage = storage;
        this.choices = [
            'I often take the initiative and enjoy having responsibility',
            'Some tasks may not be appropriate for me (e.g. delicate jobs, very hard labour)',
            'I am comfortable working independently with minimal instruction',
            'Once I build my confidence and knowledge, I am able to work independently with minimal instruction',
            'I would always like to work with someone who can support me',
            'I need one-to-one support at all times'
        ];
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire3Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(3)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire3Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    return all_choices_1[i];
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire4_questionnaire4__["a" /* Questionnaire4Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
     */
    Questionnaire3Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page and deletes the his/hers last answer input.
     */
    Questionnaire3Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire3\questionnaire3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire3\questionnaire3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire3Page);
    return Questionnaire3Page;
}());

//# sourceMappingURL=questionnaire3.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire6_questionnaire6__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire4Page = (function () {
    function Questionnaire4Page(navCtrl, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.getQuestion();
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire4Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(4)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire4Page.prototype.goNext = function () {
        this.sqlitedatabase.addToAnswerCache(this.question_id, [this.response_text]);
        this.sqlitedatabase.logAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire6_questionnaire6__["a" /* Questionnaire6Page */]);
    };
    /**
     * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
     */
    Questionnaire4Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire4Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire4\questionnaire4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n  [class.springBackground]="spring" [class.customBackground]="custom">\n  <ion-grid>\n    <ion-row>\n\n      <h1 id="login-heading2">\n        <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n        />\n      </h1>\n\n    </ion-row>\n\n    <ion-row>\n      <ion-col>\n        <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="arrow-round-back"></ion-icon>\n            <label> &#8239; Back</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n      <ion-col></ion-col>\n\n\n      <ion-col>\n        <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n          <div>\n            <label> &#8239; </label>\n            <ion-icon name="home"></ion-icon>\n            <label> &#8239; Home</label>\n          </div>\n\n        </a>\n      </ion-col>\n\n    </ion-row>\n    <ion-row>\n\n\n      <ion-col>\n\n        <h2 id="register0-heading21" class="white-text">{{question_text}}</h2>\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n      <!-- <ion-col></ion-col> -->\n      <ion-col>\n\n        <!--         <form id="Register-form1">\n          <ion-item id="Register-input1">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="Please start typing here" [(ngModel)]="informationInput" [ngModelOptions]="{standalone: true}" style="width:300px"></ion-input>\n          </ion-item>\n        </form>  -->\n        <form id="Questionnaire4">\n          <ion-item id="Questionnaire4-input">\n            <ion-label></ion-label>\n            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n              style="width:200px"></ion-input>\n          </ion-item>\n        </form>\n\n      </ion-col>\n\n      <!-- <ion-col></ion-col> -->\n\n    </ion-row>\n    <ion-row>\n\n\n      <ion-col>\n\n        <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n          <div>\n            <label> </label>\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            <label> Next</label>\n          </div>\n        </a>\n\n      </ion-col>\n\n\n    </ion-row>\n\n  </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire4\questionnaire4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire4Page);
    return Questionnaire4Page;
}());

//# sourceMappingURL=questionnaire4.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire6Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire7_questionnaire7__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire6Page = (function () {
    function Questionnaire6Page(navCtrl, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.getQuestion();
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire6Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(5)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire6Page.prototype.goNext = function () {
        this.sqlitedatabase.addToAnswerCache(this.question_id, [this.response_text]);
        this.sqlitedatabase.logAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire7_questionnaire7__["a" /* Questionnaire7Page */]);
    };
    /**
 * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
 */
    Questionnaire6Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire6Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire6Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire6',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire6\questionnaire6.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <!-- <ion-col></ion-col> -->\n            <ion-col>\n                <form id="Questionnaire6">\n                    <ion-item id="Questionnaire6-input">\n                        <ion-label></ion-label>\n                        <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                            style="width:200px"></ion-input>\n                    </ion-item>\n                </form>\n            </ion-col>\n            <!-- <ion-col></ion-col> -->\n\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire6\questionnaire6.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire6Page);
    return Questionnaire6Page;
}());

//# sourceMappingURL=questionnaire6.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire7Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire9_questionnaire9__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire7Page = (function () {
    function Questionnaire7Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            'Yes',
            'No',
            'Not sure yet',
            'Other'
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire7Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(6)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire7Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire9_questionnaire9__["a" /* Questionnaire9Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
 * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
 */
    Questionnaire7Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire7Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire7Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire7',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire7\questionnaire7.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]" (click)="selectOnly(i)"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire7">\n                        <ion-item id="Questionnaire7-input">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire7\questionnaire7.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire7Page);
    return Questionnaire7Page;
}());

//# sourceMappingURL=questionnaire7.js.map

/***/ }),

/***/ 250:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire9Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire10_questionnaire10__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire9Page = (function () {
    function Questionnaire9Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            'I don\'t mind',
            'No thank you'
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire9Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(7)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire9Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    return all_choices_1[i];
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire10_questionnaire10__["a" /* Questionnaire10Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
  * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
  */
    Questionnaire9Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire9Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire9Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire9',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire9\questionnaire9.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]" (click)="selectOnly(i)"></ion-checkbox>\n                    </ion-item>\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire9\questionnaire9.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire9Page);
    return Questionnaire9Page;
}());

//# sourceMappingURL=questionnaire9.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire10Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__questionnaire11_questionnaire11__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Questionnaire10Page = (function () {
    function Questionnaire10Page(navCtrl, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getQuestion();
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire10Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(8)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire10Page.prototype.goNext = function () {
        this.sqlitedatabase.addToAnswerCache(this.question_id, [this.response_text]);
        this.sqlitedatabase.logAnswerCache();
        //this.sqlitedatabase.insertCachedAnswers(0);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__questionnaire11_questionnaire11__["a" /* Questionnaire11Page */]);
    };
    /**
 * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
 */
    Questionnaire10Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire10Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire10Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire10',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire10\questionnaire10.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">{{question_text}}</h2>\n\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <form id="Questionnaire10">\n                    <ion-item id="Questionnaire10-input">\n                        <ion-label></ion-label>\n                        <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                            style="width:200px"></ion-input>\n                    </ion-item>\n                </form>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n\n        </ion-row>\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire10\questionnaire10.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], Questionnaire10Page);
    return Questionnaire10Page;
}());

//# sourceMappingURL=questionnaire10.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Questionnaire11Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__diversity_questionnaire0_diversity_questionnaire0__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Questionnaire11Page = (function () {
    function Questionnaire11Page(navCtrl, alertController, sqlitedatabase, shareProvider, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.shareProvider = shareProvider;
        this.storage = storage;
        this.choices = [
            'Wednesday',
            'Thursday Morning',
            'Saturdays (fortnighlty/monthly)',
            'Other'
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.getQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular registration questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    Questionnaire11Page.prototype.getQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getQuestion(9)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    Questionnaire11Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToAnswerCache(this.question_id, selected);
            this.sqlitedatabase.logAnswerCache();
            var user_id = this.shareProvider.getUserId();
            this.sqlitedatabase.insertCachedAnswers(user_id);
            var successAlert = this.alertController.create({
                message: "Thank you for filling up the questionnaires.\
                 Your responses are carefully saved."
            });
            successAlert.present();
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__diversity_questionnaire0_diversity_questionnaire0__["a" /* DiversityQuestionnaire0Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the answerCache object in the sqlitedatabase.ts file.
     */
    Questionnaire11Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetAnswerCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    Questionnaire11Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    Questionnaire11Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-questionnaire11',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\questionnaire11\questionnaire11.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire11">\n                        <ion-item id="Questionnaire11-input">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\questionnaire11\questionnaire11.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_4__providers_share_share__["a" /* ShareProvider */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]])
    ], Questionnaire11Page);
    return Questionnaire11Page;
}());

//# sourceMappingURL=questionnaire11.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire0Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__diversity_questionnaire1_diversity_questionnaire1__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DiversityQuestionnaire0Page = (function () {
    function DiversityQuestionnaire0Page(navCtrl, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method takes the user to the DiversityQuestionnaire1Page page.
     */
    DiversityQuestionnaire0Page.prototype.goToDiversityQuestionnaire1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__diversity_questionnaire1_diversity_questionnaire1__["a" /* DiversityQuestionnaire1Page */]);
    };
    /**
     * This method takes the user to the HomepagePage page.
     */
    DiversityQuestionnaire0Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
   * This method takes the user to the LoginPage page.
   */
    DiversityQuestionnaire0Page.prototype.goBack = function () {
        this.sqlitedatabase.clearAnswerCache(9);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
    };
    DiversityQuestionnaire0Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire0',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire0\diversity-questionnaire0.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Inclusivity-Form-Logo.png" style="display:block;width:55%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n            <ion-col>\n                <br>\n                <br>\n                <h2 id="register0-heading21" class="white-text">\n                    To improve our services and find out who we\'re reaching, we monitor diversity information. Your replies are confidential\n                    and will not be used in a way that identifies you. It is entirely optional whether you choose to give\n                    this information.\n                </h2>\n                <br>\n                <br>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n            <ion-col></ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goToDiversityQuestionnaire1()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="checkmark"></ion-icon>\n                        <label> Yes</label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col></ion-col>\n\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goToHomepage()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="close"></ion-icon>\n                        <label> No</label>\n                    </div>\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire0\diversity-questionnaire0.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], DiversityQuestionnaire0Page);
    return DiversityQuestionnaire0Page;
}());

//# sourceMappingURL=diversity-questionnaire0.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__diversity_questionnaire2_diversity_questionnaire2__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DiversityQuestionnaire1Page = (function () {
    function DiversityQuestionnaire1Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "16-24 years", "25-44 years", "45-64  years", "65 years or over"
        ];
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
     */
    DiversityQuestionnaire1Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        console.log("function called");
        this.sqlitedatabase.getDiversityQuestion(1)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
     * This method registers the user answers and takes the user to the next page.
     */
    DiversityQuestionnaire1Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    return all_choices_1[i];
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__diversity_questionnaire2_diversity_questionnaire2__["a" /* DiversityQuestionnaire2Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
     */
    DiversityQuestionnaire1Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page and deletes the his/hers last answer input.
     */
    DiversityQuestionnaire1Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire1\diversity-questionnaire1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n                </ion-list>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire1\diversity-questionnaire1.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire1Page);
    return DiversityQuestionnaire1Page;
}());

//# sourceMappingURL=diversity-questionnaire1.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire3_diversity_questionnaire3__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DiversityQuestionnaire2Page = (function () {
    function DiversityQuestionnaire2Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Female", "Male", "Other"
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
           * This is the logic that assigns the desired background, chosen in
           * admin-app-settings.ts, to the background of the current page.
           */
        var promise1 = this.storage.get('wallpaperToggle');
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
     */
    DiversityQuestionnaire2Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(2)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
     * This method registers the user answers and takes the user to the next page.
     */
    DiversityQuestionnaire2Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire3_diversity_questionnaire3__["a" /* DiversityQuestionnaire3Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
     */
    DiversityQuestionnaire2Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page and deletes the his/hers last answer input.
     */
    DiversityQuestionnaire2Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire2\diversity-questionnaire2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire2\diversity-questionnaire2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire2Page);
    return DiversityQuestionnaire2Page;
}());

//# sourceMappingURL=diversity-questionnaire2.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire4_diversity_questionnaire4__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DiversityQuestionnaire3Page = (function () {
    function DiversityQuestionnaire3Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Bisexual", "Gay Man", "Heterosexual", "Lesbian or gay woman", "Prefer not to say", "Other"
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
         * This is the logic that assigns the desired background, chosen in
         * admin-app-settings.ts, to the background of the current page.
         */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
   * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
   */
    DiversityQuestionnaire3Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(3)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
   * This method registers the user answers and takes the user to the next page.
   */
    DiversityQuestionnaire3Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire4_diversity_questionnaire4__["a" /* DiversityQuestionnaire4Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
     */
    DiversityQuestionnaire3Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
   * This method takes the user to the previous page and deletes the his/hers last answer input.
   */
    DiversityQuestionnaire3Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire3\diversity-questionnaire3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire3\diversity-questionnaire3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire3Page);
    return DiversityQuestionnaire3Page;
}());

//# sourceMappingURL=diversity-questionnaire3.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire5_diversity_questionnaire5__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DiversityQuestionnaire4Page = (function () {
    function DiversityQuestionnaire4Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Asian or Asian British", "Black or Black British", "Mixed background", "Other ethnic group", "White or White British", "Prefer not to say", "Other"
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
         * This is the logic that assigns the desired background, chosen in
         * admin-app-settings.ts, to the background of the current page.
         */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
   * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
   */
    DiversityQuestionnaire4Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(4)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
   * This method registers the user answers and takes the user to the next page.
   */
    DiversityQuestionnaire4Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire5_diversity_questionnaire5__["a" /* DiversityQuestionnaire5Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
    * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
    */
    DiversityQuestionnaire4Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
   * This method takes the user to the previous page and deletes the his/hers last answer input.
   */
    DiversityQuestionnaire4Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire4\diversity-questionnaire4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire4\diversity-questionnaire4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire4Page);
    return DiversityQuestionnaire4Page;
}());

//# sourceMappingURL=diversity-questionnaire4.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire5Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire6_diversity_questionnaire6__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DiversityQuestionnaire5Page = (function () {
    function DiversityQuestionnaire5Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Yes", "No"
        ];
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
            * This is the logic that assigns the desired background, chosen in
            * admin-app-settings.ts, to the background of the current page.
            */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
     */
    DiversityQuestionnaire5Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(5)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
     * This method registers the user answers and takes the user to the next page.
     */
    DiversityQuestionnaire5Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    return all_choices_1[i];
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire6_diversity_questionnaire6__["a" /* DiversityQuestionnaire6Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
     */
    DiversityQuestionnaire5Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page and deletes the his/hers last answer input.
     */
    DiversityQuestionnaire5Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire5Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire5',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire5\diversity-questionnaire5.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire5\diversity-questionnaire5.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire5Page);
    return DiversityQuestionnaire5Page;
}());

//# sourceMappingURL=diversity-questionnaire5.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire6Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__diversity_questionnaire7_diversity_questionnaire7__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DiversityQuestionnaire6Page = (function () {
    function DiversityQuestionnaire6Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Yes", "No"
        ];
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
     */
    DiversityQuestionnaire6Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(6)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
     * This method registers the user answers and takes the user to the next page.
     */
    DiversityQuestionnaire6Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    return all_choices_1[i];
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__diversity_questionnaire7_diversity_questionnaire7__["a" /* DiversityQuestionnaire7Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
     */
    DiversityQuestionnaire6Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user to the previous page and deletes the his/hers last answer input.
     */
    DiversityQuestionnaire6Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire6Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire6',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire6\diversity-questionnaire6.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire6\diversity-questionnaire6.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire6Page);
    return DiversityQuestionnaire6Page;
}());

//# sourceMappingURL=diversity-questionnaire6.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire7Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire8_diversity_questionnaire8__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DiversityQuestionnaire7Page = (function () {
    function DiversityQuestionnaire7Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Atheist/no religious belief", "Buddhist", "Chrsitian", "Hindu", "Jewish", "Muslim", "Secular beliefs", "Sikh", "Prefer not to say", "Other"
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
        * This is the logic that assigns the desired background, chosen in
        * admin-app-settings.ts, to the background of the current page.
        */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
   * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
   */
    DiversityQuestionnaire7Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(7)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
   * This method registers the user answers and takes the user to the next page.
   */
    DiversityQuestionnaire7Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire8_diversity_questionnaire8__["a" /* DiversityQuestionnaire8Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    DiversityQuestionnaire7Page.prototype.selectOnly = function (i) {
        console.log("selected number index:" + i);
        this.responses = this.responses.map(function (x, index) { return i == index; });
    };
    /**
   * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
   */
    DiversityQuestionnaire7Page.prototype.goToHomepage = function () {
        this.sqlitedatabase.resetDiversityCache();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
   * This method takes the user to the previous page and deletes the his/hers last answer input.
   */
    DiversityQuestionnaire7Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire7Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire7',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire7\diversity-questionnaire7.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire7\diversity-questionnaire7.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire7Page);
    return DiversityQuestionnaire7Page;
}());

//# sourceMappingURL=diversity-questionnaire7.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire8Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire9_diversity_questionnaire9__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DiversityQuestionnaire8Page = (function () {
    function DiversityQuestionnaire8Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.choices = [
            "Working full or part time", "Unemployed", "Not working - due to health issues/disability", "Not working  - looking after house/children", "Not working - Retired", "Student", "Self-employed", "Other"
        ];
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        this.responses = this.choices.map(function (x, i) { return false; });
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle');
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    DiversityQuestionnaire8Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(8)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
 * This method registers the user answers and takes the user to the next page.
 */
    DiversityQuestionnaire8Page.prototype.goNext = function () {
        if (this.responses.indexOf(true) > -1) {
            var all_choices_1 = this.choices;
            var input_text_1 = this.response_text;
            console.log("responses:" + this.responses);
            var selected = this.responses
                .map(function (x, i) {
                if (x) {
                    if (i < all_choices_1.length - 1)
                        return all_choices_1[i];
                    else
                        return input_text_1;
                }
            }).filter(function (x, i) { return x != null; });
            console.log("selected:" + selected);
            this.sqlitedatabase.addToDiversityCache(this.question_id, selected);
            this.sqlitedatabase.logDiversityCache();
            //this.sqlitedatabase.insertCachedAnswers(0);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__diversity_questionnaire9_diversity_questionnaire9__["a" /* DiversityQuestionnaire9Page */]);
        }
        else {
            var addTodoAlert = this.alertController.create({
                message: "Please select at least one option"
            });
            addTodoAlert.present();
        }
    };
    DiversityQuestionnaire8Page.prototype.selectOnly = function (i) {
        console.log("selected number index:" + i);
        this.responses = this.responses.map(function (x, index) { return i == index; });
    };
    /**
 * This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
 */
    DiversityQuestionnaire8Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
 * This method takes the user to the previous page and deletes the his/hers last answer input.
 */
    DiversityQuestionnaire8Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire8Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire8',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire8\diversity-questionnaire8.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <ion-list>\n\n                    <ion-item *ngFor="let choice of choices; let i = index">\n                        <ion-label>{{choice}}</ion-label>\n                        <ion-checkbox [(ngModel)]="responses[i]"></ion-checkbox>\n                    </ion-item>\n\n                    <form id="Questionnaire1">\n                        <ion-item id="Questionnaire1-input7">\n                            <ion-label></ion-label>\n                            <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                                style="width:200px"></ion-input>\n                        </ion-item>\n                    </form>\n\n\n                </ion-list>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire8\diversity-questionnaire8.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire8Page);
    return DiversityQuestionnaire8Page;
}());

//# sourceMappingURL=diversity-questionnaire8.js.map

/***/ }),

/***/ 262:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiversityQuestionnaire9Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DiversityQuestionnaire9Page = (function () {
    function DiversityQuestionnaire9Page(navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.response_text = '';
        this.question_id = 0;
        this.question_text = '';
        this.getDiversityQuestion();
        /**
          * This method retrieves the login history from the SQLite database.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
 * This method retrieves the question data for the particular diversity questionnaire question and sets the question_id and question_text variables with the relevant data.
 */
    DiversityQuestionnaire9Page.prototype.getDiversityQuestion = function () {
        var _this = this;
        this.sqlitedatabase.getDiversityQuestion(9)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return;
            }
            if (data.rows.length > 0) {
                _this.question_id = data.rows.item(0).id;
                _this.question_text = data.rows.item(0).question_text;
                console.log('question:' + _this.question_text);
            }
        }, function (err) {
            console.log('Error: ', err);
        });
    };
    /**
* This method registers the user answers, inserts all the user answers into the local database, displays the registered data in the console and takes the user to the HomePage page.
*/
    DiversityQuestionnaire9Page.prototype.goNext = function () {
        this.sqlitedatabase.addToDiversityCache(this.question_id, [this.response_text]);
        this.sqlitedatabase.logDiversityCache();
        this.sqlitedatabase.insertDiversityCache();
        var successAlert = this.alertController.create({
            message: "Thank you for filling up the questionnaires.\
             Your responses are carefully saved."
        });
        successAlert.present();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
* This method takes the user to the HomepagePage page and resets the diversityCache object in the sqlitedatabase.ts file.
*/
    DiversityQuestionnaire9Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
* This method takes the user to the previous page and deletes the his/hers last answer input.
*/
    DiversityQuestionnaire9Page.prototype.goBack = function () {
        this.sqlitedatabase.clearDiversityCache(this.question_id - 1);
        this.navCtrl.pop();
    };
    DiversityQuestionnaire9Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-diversity-questionnaire9',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire9\diversity-questionnaire9.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Questionnaire-Logo.png" style="display:block;width:70%;height:auto;margin-left:auto;margin-right:auto;"\n                />\n            </h1>\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goBack()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <h2 id="register0-heading21" class="white-text">\n                    {{question_text}}\n                </h2>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <!-- <ion-col></ion-col> -->\n            <ion-col>\n                <form id="Questionnaire6">\n                    <ion-item id="Questionnaire6-input">\n                        <ion-label></ion-label>\n                        <ion-input type="text" placeholder="Please specify here" [(ngModel)]="response_text" [ngModelOptions]="{standalone: true}"\n                            style="width:200px"></ion-input>\n                    </ion-item>\n                </form>\n            </ion-col>\n            <!-- <ion-col></ion-col> -->\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n            <ion-col>\n\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goNext()">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="arrow-round-forward"></ion-icon>\n                        <label> Next</label>\n                    </div>\n                </a>\n\n            </ion-col>\n            <ion-col></ion-col>\n            <ion-col></ion-col>\n        </ion-row>\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\diversity-questionnaire9\diversity-questionnaire9.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], DiversityQuestionnaire9Page);
    return DiversityQuestionnaire9Page;
}());

//# sourceMappingURL=diversity-questionnaire9.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LogoutPage = (function () {
    function LogoutPage(http, navCtrl, alertController, sqlitedatabase, storage) {
        var _this = this;
        this.http = http;
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.logoutText = 'Logout';
        this.lastNameInput = '';
        this.showList = false;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.autoLogoutUser();
    }
    /**
     * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
     * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
     * that the farm shuts.
     * 2) The auto-logout is executed after the day on which the volunteer logged in.
     */
    LogoutPage.prototype.autoLogoutUser = function () {
        var _this = this;
        this.sqlitedatabase.listDetailsForAutoLogout()
            .then(function (stats) {
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
                }
                else {
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
                    _this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
                        .then(function () {
                    }, function (err) {
                        console.log('Error1: ', err);
                    });
                }
                else {
                    console.log("Already logged out");
                }
            }
        }, function (err) {
            console.log("something went wrong on auto-logging out users");
        });
    };
    /**
     * This method retrieves the name suggestions from the local database. It querries the sutton_user table for users who's last name has some similarity to the
     * input lastname in the text input box.
     * @param ev
     */
    LogoutPage.prototype.getItems = function (ev) {
        var _this = this;
        this.logoutText = "Logout";
        // set val to the value of the searchbar
        var val = ev.target.value || '';
        // populate the list from database
        this.sqlitedatabase.suggestLastName(val)
            .then(function (data) {
            if (data == null) {
                console.log("no data in table");
                return [];
            }
            _this.items = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    _this.items.push({
                        id: data.rows.item(i).id,
                        first_name: data.rows.item(i).first_name,
                        last_name: data.rows.item(i).last_name,
                    });
                }
            }
            // Show the results
            _this.showList = true;
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
        // hide the results when the query is empty
        this.showList = false;
    };
    LogoutPage.prototype.onEnter = function () {
        this.setSelection(this.items[0]);
    };
    /**
     * This method takes the selected name by the user and parses it to the logout button so that the user's name is displayed on the button.
     * @param item
     */
    LogoutPage.prototype.setSelection = function (item) {
        console.log(item);
        this.selectedItem = item;
        this.lastNameInput = item.last_name;
        this.showList = false;
        this.logoutText = "Logout (" + item.first_name + " " + item.last_name + ")";
    };
    /**
     * This method is called when the logout button is clicked. It  registers the logout times stamp of the user into the login_history table.
     *  It then informs the user of the success status of the operation through an alert message.
     *  Only logged-in users can be logged out. If a not logged-in user tries to logout he will be prompted with an alert message.
     */
    LogoutPage.prototype.logoutFromApp = function () {
        var _this = this;
        if (this.selectedItem == undefined || this.selectedItem.id == undefined) {
            var addTodoAlert = this.alertController.create({
                title: "Warning!!",
                message: "Please select your name to logout",
            });
            addTodoAlert.present();
        }
        else {
            this.sqlitedatabase.last_login(this.selectedItem.id)
                .then(function (data) {
                console.log(JSON.stringify(data));
                if (data.rows.length != 0 && data.rows.item(0).login_ts !== undefined) {
                    if (data.rows.item(0).logout_ts == undefined) {
                        _this.sqlitedatabase.logout(_this.selectedItem.id)
                            .then(function () {
                            _this.showLoginResponse("Logout successful.");
                            // clear lastname
                            _this.clearLogout();
                        }, function (err) {
                            _this.showLoginResponse("Logout failed.");
                            console.log('Error1: ', err);
                        });
                    }
                    else {
                        _this.showLoginResponse("Already logged out.");
                    }
                }
                else {
                    _this.showLoginResponse("Failed! You must be logged in to logout.");
                }
            }, function (err) {
                console.log('Error2: ', err);
                _this.showLoginResponse("Logout failed");
            });
        }
    };
    /**
     * This method is called when a person logs out and shows an alert message with information that the logout was succesfull.
     * @param response
     */
    LogoutPage.prototype.showLoginResponse = function (response) {
        var loginResultAlert = this.alertController.create({
            title: "Logout Response",
            message: response,
        });
        loginResultAlert.present();
    };
    /**
     * This method clears the variables so that they can be used by the next user and resets the text of the logout button to 'Logout'
     */
    LogoutPage.prototype.clearLogout = function () {
        this.lastNameInput = '';
        this.selectedItem = undefined;
        this.logoutText = 'Logout';
    };
    /**
     * This method takes the user back to the homepage.
     * @param params
     */
    LogoutPage.prototype.goToHomepage = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes the user back to the previous page which in this case is the homepage.
     */
    LogoutPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    LogoutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-logout',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\logout\logout.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Logout-Logo.png" style="display:block;width:40%;height:auto;margin-left:auto;margin-right:auto;" />\n            </h1>\n\n        </ion-row>\n        <ion-row>\n            <ion-col>\n                <a id="login-back-button" class="nav-button" href="#" on-click="goToHomepage()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <br>\n            <br>\n\n            <h2 id="logout-heading1" class="white-text">\n                Please start typing in your last name and choose from the drop-down list\n            </h2>\n            <br>\n            <br>\n\n        </ion-row>\n\n\n\n        <ion-row>\n\n            <ion-col>\n                <form id="Logout-form2">\n                    <ion-searchbar #q (keyup.enter)="onEnter()" [(ngModel)]="lastNameInput" [ngModelOptions]="{standalone: true}" (ionInput)="getItems($event)"\n                        animation="false" placeholder="Last Name" class="full-width-select" style="width:300px" style="display:block;margin-left:auto;margin-right:auto;">\n                    </ion-searchbar>\n                    <ion-list *ngIf="showList">\n                        <ion-item *ngFor="let item of items" (click)=\'setSelection(item);\'>\n                            {{ item.first_name }} {{item.last_name}}\n                        </ion-item>\n                    </ion-list>\n                </form>\n\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-col>\n                <a id="login-button27" class="semi-transparent-button" href="#" on-click="logoutFromApp()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <ion-icon name="log-in"></ion-icon>\n                        <label> {{logoutText}} </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n        </ion-row>\n\n\n        <ion-row>\n\n            <ion-col>\n\n\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\logout\logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]])
    ], LogoutPage);
    return LogoutPage;
}());

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShareProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file share.ts is adapted from https://www.lynda.com/Ionic-tutorials/Ionic-3-0-Mobile-App-Developers/562260-2.html?srchtrk=index%3A1%0Alinktypeid%3A2%0Aq%3AIonic+3.0+for+Mobile+App+Developers%0Apage%3A1%0As%3Arelevance%0Asa%3Atrue%0Aproducttypeid%3A2


*/
////////////////////////////////////////////////////////////////////////////////////////////////


var ShareProvider = (function () {
    function ShareProvider(http) {
        this.http = http;
        this.registration_info = {};
        this.user_id = 0;
        console.log('Hello ShareProvider Provider');
    }
    /**
     * This method adds a key:value pair to the registration_info object.
     * @param key
     * @param value
     */
    ShareProvider.prototype.updateRegistrationInfo = function (key, value) {
        this.registration_info[key] = value;
    };
    /**
     * This method returns the registrion_info object.
     */
    ShareProvider.prototype.getRegistrationInfo = function () {
        return this.registration_info;
    };
    /**
     * This method returns the value of the user_id variable.
     */
    ShareProvider.prototype.getUserId = function () {
        return this.user_id;
    };
    /**
     * This method sets the value of the user_id variable.
     * @param user_id
     */
    ShareProvider.prototype.setUserId = function (user_id) {
        this.user_id = user_id;
    };
    /**
     * This method deletes the elemet with key 'key' from the registration_info object
     * @param key
     */
    ShareProvider.prototype.deleteItemFromRegistration = function (key) {
        delete this.registration_info[key];
    };
    /**
     * This method resets the registrion_info object.
     */
    ShareProvider.prototype.resetRegistration = function () {
        this.registration_info = {};
    };
    ShareProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], ShareProvider);
    return ShareProvider;
}());

//# sourceMappingURL=share.js.map

/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminAppSettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__admin_home_admin_home__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdminAppSettingsPage = (function () {
    function AdminAppSettingsPage(navCtrl, navParams, modalCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.custom = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    AdminAppSettingsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AdminAppSettingsPage');
    };
    /**
     * Method returns user to homepage
     */
    AdminAppSettingsPage.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * Method returns user to admin homepage
     */
    AdminAppSettingsPage.prototype.goToAdminHome = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__admin_home_admin_home__["a" /* AdminHomePage */]);
    };
    /**
     * Each of these functions is used to set the wallpaper for the entire app.
     * This is achieved by setting the boolean variable, associated with the
     * the desired wallpaper, to 'true'. All of the other boolean variables, which
     * are associated with the other wallpapers are set to 'false'.
     * */
    AdminAppSettingsPage.prototype.springToggle = function () {
        this.storage.remove('wallpaperToggle');
        this.storage.set('wallpaperToggle', 'spring');
        this.winter = false;
        this.summer = false;
        this.autumn = false;
        this.spring = true;
    };
    AdminAppSettingsPage.prototype.summerToggle = function () {
        this.storage.remove('wallpaperToggle');
        this.storage.set('wallpaperToggle', 'summer');
        this.winter = false;
        this.summer = true;
        this.autumn = false;
        this.spring = false;
    };
    AdminAppSettingsPage.prototype.winterToggle = function () {
        this.storage.remove('wallpaperToggle');
        this.storage.set('wallpaperToggle', 'winter');
        this.winter = true;
        this.summer = false;
        this.autumn = false;
        this.spring = false;
    };
    AdminAppSettingsPage.prototype.autumnToggle = function () {
        this.storage.remove('wallpaperToggle');
        this.storage.set('wallpaperToggle', 'autumn');
        this.winter = false;
        this.summer = false;
        this.autumn = true;
        this.spring = false;
    };
    AdminAppSettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-admin-app-settings',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\admin-app-settings\admin-app-settings.html"*/'\n\n<ion-content padding [class.winterBackground]="winter"  [class.summerBackground]="summer"  [class.autumnBackground]="autumn" [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n                    \n                        <h1 id="login-heading2">\n                                <img src="assets/img/App-Settings.png" style="display:block;width:55%;height:auto;margin-left:auto;margin-right:auto;"/>\n                        </h1>\n                        \n                     \n        </ion-row>\n    \n        <ion-row>\n                <ion-col>\n                    <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminHome()" float-left>\n                            <div>\n                                <label> &#8239; </label>  \n                                <ion-icon name="arrow-round-back"></ion-icon>  \n                                <label> &#8239; Back</label>       \n                            </div>\n                        \n                    </a> \n                </ion-col>\n                \n                <ion-col></ion-col>\n                \n                \n                          <ion-col>\n                              <!-- Home button, to homepage -->\n                              <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                                  <div>\n                                      <label> &#8239; </label>  \n                                      <ion-icon name="home"></ion-icon>  \n                                      <label> &#8239; Home</label>       \n                                  </div>\n                                \n                              </a> \n                             \n                          </ion-col>\n                          \n                        </ion-row>\n    \n                        <br>\n                        <br>\n    \n    \n                        <ion-row>\n     \n                          <ion-col> \n    \n                              <a id="homepage-button1" class="semi-transparent-button" href="#"  on-click="winterToggle()" style="display:block;margin-left:auto;margin-right:auto;">\n                                  <div> \n                                    <ion-icon name="leaf"></ion-icon> \n                                      <label> Beans Theme</label>       \n                                  </div>\n                                \n                              </a>\n                        \n                            <br>\n                            <br>\n                          </ion-col> \n    \n                          \n                        </ion-row>  \n                          \n                        <ion-row>\n    \n                            <ion-col>\n                                <a id="homepage-button2" class="semi-transparent-button" href="#" on-click="autumnToggle()" style="display:block;margin-left:auto;margin-right:auto;">\n                                    <ion-icon name="rose"></ion-icon>\n                                    <label> Beans Theme 2</label>     \n                                </a>   \n                          <br>\n                          <br>\n                        \n                        </ion-col> \n    \n                        </ion-row>\n    \n                        <ion-row>\n                            \n    \n                                <ion-col>\n                                    <a id="homepage-button3" class="semi-transparent-button" href="#" on-click="springToggle()" style="display:block;margin-left:auto;margin-right:auto;">\n                                        <ion-icon name="cloudy-night"></ion-icon>  \n                                        <label> Sunset Theme</label>\n                                        \n                                    </a> \n                                    \n                              <br>\n                              <br>\n                            \n                            </ion-col> \n                            \n                            </ion-row>\n                        \n                        <ion-row>\n                            \n    \n                            <ion-col>\n                                <a id="homepage-button3" class="semi-transparent-button" href="#" on-click="summerToggle()" style="display:block;margin-left:auto;margin-right:auto;">\n                                    <ion-icon name="sunny"></ion-icon> \n                                    <label> Sunny Theme</label>\n                                    \n                                </a> \n                                \n                          <br>\n                          <br>\n                        \n                        </ion-col> \n                        \n                        </ion-row>\n                        \n      </ion-grid>\n    \n    \n      \n    </ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\admin-app-settings\admin-app-settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* ModalController */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], AdminAppSettingsPage);
    return AdminAppSettingsPage;
}());

//# sourceMappingURL=admin-app-settings.js.map

/***/ }),

/***/ 385:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminVisitorHistoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_papaparse__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_papaparse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_papaparse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__csv_downloads_csv_downloads__ = __webpack_require__(387);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
  * Creating a dynamic table from csv data is based on a tutorial from https://devdactic.com/csv-data-ionic/
  */
/**
  * Downloading a csv file methodology is based on code from https://forum.ionicframework.com/t/downloading-files-in-ionic-using-cordova-plugin-file-transfer/42315
  */
/**
  * Converting from JS Object arrays to a csv file methodology is based on code from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
  */
/**
  * Writing a text file of csv data and saving it methodology is based on code from https://forum.ionicframework.com/t/generate-download-a-csv-file-with-ionic/63104
  */
var AdminVisitorHistoryPage = (function () {
    function AdminVisitorHistoryPage(navCtrl, popoverCtrl, navParams, http, sqlitedatabase, File) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navParams = navParams;
        this.http = http;
        this.sqlitedatabase = sqlitedatabase;
        this.File = File;
        this.csvData = [];
        this.headerRow = [];
        this.autoLogoutUser();
        this.csvFromDatabase();
    }
    /**
     * Creates a window with options for downloading csv files containing: login data,
     * questionnaire data and diversity questionnaire data.
     * @param myEvent
     */
    AdminVisitorHistoryPage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_8__csv_downloads_csv_downloads__["a" /* CsvDownloadsPage */]);
        popover.present({
            ev: myEvent
        });
    };
    /**
     * This method retrieves the login history from the SQLite database.
     */
    AdminVisitorHistoryPage.prototype.csvFromDatabase = function () {
        var _this = this;
        this.sqlitedatabase.listLoginDetailsForTable()
            .then(function (stats) {
            var arrayConverted = [];
            for (var q = 0; q < stats.length; q++) {
                var logoutTimeString = (stats[q].logout_time).toString();
                var loginTimeString = (stats[q].login_time).toString();
                var currentDateInfoArray = logoutTimeString.split(" ");
                var currentYear = currentDateInfoArray[3];
                var year = 1970;
                if (currentYear.toString() == year.toString()) {
                    var stillActiveString = 'Volunteer still active';
                    arrayConverted.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: stillActiveString
                    });
                }
                else {
                    arrayConverted.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: logoutTimeString
                    });
                }
            }
            // console.log(arrayConverted)
            _this.ConvertToCSV(arrayConverted);
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * This method converts the login history data to csv format.
     */
    AdminVisitorHistoryPage.prototype.ConvertToCSV = function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";
        for (var index in objArray[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (var i = array.length - 1; i >= 0; i--) {
            var line = '';
            for (var index in array[i]) {
                if (line != '')
                    line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        this.saveFile(str);
    };
    /**
     * This method saves the csv data to a file in a local directory.
     */
    AdminVisitorHistoryPage.prototype.saveFile = function (body) {
        var _this = this;
        var fileName = "dummyData.csv";
        this.File.writeFile(this.File.dataDirectory, fileName, body)
            .then(function (_) {
            console.log('Success ;-)' + _this.File.dataDirectory);
        })
            .catch(function (err) {
            _this.File.writeExistingFile(_this.File.dataDirectory, fileName, body)
                .then(function (_) {
                console.log('Success ;-)2' + _this.File.dataDirectory);
            })
                .catch(function (err) {
                console.log(err + 'Failure' + _this.File.dataDirectory);
            });
        });
        this.readCsvData();
    };
    /**
     * This method extracts the csv data from the written file so that it can be parsed to a table.
     */
    AdminVisitorHistoryPage.prototype.readCsvData = function () {
        var _this = this;
        this.http.get(this.File.dataDirectory + 'dummyData.csv')
            .subscribe(function (data) { return _this.extractData(data); }, function (err) { return _this.handleError(err); });
    };
    /**
     * This method sets up a dynamic table in the HTML file and parses the login data to it.
     */
    AdminVisitorHistoryPage.prototype.extractData = function (res) {
        var csvData = res['_body'] || '';
        var parsedData = __WEBPACK_IMPORTED_MODULE_7_papaparse__["parse"](csvData).data;
        // this.headerRow = parsedData[0];
        this.headerRow = ["First Name", "Last Name", "Email Address", "Login Time", "Logout Time"];
        parsedData.splice(0, 1);
        this.csvData = parsedData;
    };
    AdminVisitorHistoryPage.prototype.handleError = function (err) {
        console.log('something went wrong: ', err);
    };
    AdminVisitorHistoryPage.prototype.trackByFn = function (index, item) {
        return index;
    };
    AdminVisitorHistoryPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AdminVisitorHistoryPage');
    };
    /**
     * This method opens the HomepagePage page.
     */
    AdminVisitorHistoryPage.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method opens the AdminPage page.
     */
    AdminVisitorHistoryPage.prototype.goToAdminHome = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__admin_home_admin_home__["a" /* AdminHomePage */]);
    };
    /**
     * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
     * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
     * that the farm shuts.
     * 2) The auto-logout is executed after the day on which the volunteer logged in.
     */
    AdminVisitorHistoryPage.prototype.autoLogoutUser = function () {
        var _this = this;
        this.sqlitedatabase.listDetailsForAutoLogout()
            .then(function (stats) {
            var d = new Date(); //Gives the current time and date
            var currentTimeMS = d.getTime();
            for (var j = 0; j < stats.length; j++) {
                //Below gives us the date to compare
                var handledTotalDate = new Date(stats[j].login_time);
                var handledYear = handledTotalDate.getFullYear();
                var handledMonth = handledTotalDate.getMonth(); //Month in date format is 0-11
                var handledDate = handledTotalDate.getDate();
                var logoutTime = new Date(stats[j].logout_time); //Finds if the logout time exists
                if (logoutTime.toString() === "Thu Jan 01 1970 00:00:00 GMT+0000 (GMT)") {
                    var logoutBoolean = 0; //If logout time is null, given date Thu Jan 01 1970...
                }
                else {
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
                    _this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
                        .then(function () {
                    }, function (err) {
                        console.log('Error1: ', err);
                    });
                }
                else {
                    console.log("Already logged out");
                }
            }
        }, function (err) {
            console.log("something went wrong on auto-logging out users");
        });
    };
    AdminVisitorHistoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-admin-visitor-history',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\admin-visitor-history\admin-visitor-history.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title style="display:block;margin-left:auto;margin-right:auto;">\n      Visitor History\n    </ion-title>\n    <ion-buttons end>\n      <!--  <button ion-button icon-only (click)="downloadCSV()"  (click)="presentPopover($event)"> -->\n      <button ion-button icon-only (click)="presentPopover($event)">\n\n        <ion-icon name="download"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-scroll scrollX="true" scrollY="true" class="data-scroll">\n    <table border="1" class="data-table">\n      <tr>\n        <td *ngFor="let header of headerRow" text-center>\n          <b>{{ header }}</b>\n        </td>\n      </tr>\n      <tr *ngFor="let row of csvData; let i = index">\n        <td *ngFor="let data of row; let j = index; trackBy: trackByFn">\n          <ion-input type="text" [(ngModel)]="csvData[i][j]"></ion-input>\n        </td>\n      </tr>\n    </table>\n  </ion-scroll>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\admin-visitor-history\admin-visitor-history.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* PopoverController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__["a" /* File */]])
    ], AdminVisitorHistoryPage);
    return AdminVisitorHistoryPage;
}());

//# sourceMappingURL=admin-visitor-history.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CsvDownloadsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__ = __webpack_require__(85);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
  * Downloading a csv file methodology is based on code from https://forum.ionicframework.com/t/downloading-files-in-ionic-using-cordova-plugin-file-transfer/42315
  */
/**
  * Converting from JS Object arrays to a csv file methodology is based on code from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
  */
/**
  * Writing a text file of csv data and saving it methodology is based on code from https://forum.ionicframework.com/t/generate-download-a-csv-file-with-ionic/63104
  */
var CsvDownloadsPage = (function () {
    function CsvDownloadsPage(viewCtrl, navCtrl, navParams, sqlitedatabase, File, alertCtrl) {
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.sqlitedatabase = sqlitedatabase;
        this.File = File;
        this.alertCtrl = alertCtrl;
    }
    CsvDownloadsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CsvDownloadsPage');
    };
    /**
     * This method allows the user to download a csv file of diversity questionnaire responses to the device's 'Downloads' folder.
     */
    CsvDownloadsPage.prototype.getDiversityResponses = function () {
        var _this = this;
        this.sqlitedatabase.listAllDiversity2()
            .then(function (allStats) {
            var questionNumber;
            var questionTextArray = [];
            var questionText;
            var questionnaireResults = [];
            for (var z = 0; z < allStats.length; z++) {
                questionNumber = (allStats[z].question_id);
                _this.sqlitedatabase.getDiversityQuestion(questionNumber)
                    .then(function (data) {
                    if (data == null) {
                        console.log("no data in table");
                        return;
                    }
                    var question_text;
                    if (data.rows.length > 0) {
                        questionNumber = data.rows.item(0).id;
                        question_text = data.rows.item(0).question_text;
                        questionText = question_text.toString();
                        questionTextArray.push(questionText);
                        if (questionTextArray.length === allStats.length) {
                            for (var i = 0; i < allStats.length; i++) {
                                questionnaireResults.push({
                                    question: questionTextArray[i],
                                    response: allStats[i].response,
                                    count: allStats[i].count
                                });
                            }
                            console.log("Diversity questionnaire responses: ");
                            console.log(questionnaireResults);
                            var array = typeof questionnaireResults != 'object' ? JSON.parse(questionnaireResults) : questionnaireResults;
                            var str_1 = '';
                            var row = "";
                            for (var index in questionnaireResults[0]) {
                                row += index + ',';
                            }
                            row = row.slice(0, -1);
                            str_1 += row + '\r\n';
                            for (var i_1 = array.length - 1; i_1 >= 0; i_1--) {
                                var line = '';
                                for (var index in array[i_1]) {
                                    if (line != '')
                                        line += ',';
                                    line += array[i_1][index];
                                }
                                str_1 += line + '\r\n';
                            }
                            //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
                            var d = new Date();
                            var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
                            var fileName_1 = "DiversityResponses" + date.toString() + ".csv";
                            console.log(fileName_1);
                            _this.File.writeFile(_this.File.externalRootDirectory + '/Download/', fileName_1, str_1)
                                .then(function (_) {
                                var alert = _this.alertCtrl.create({
                                    title: 'Download Success',
                                    subTitle: 'A .csv of the diversity form responses has been successfully exported to your Downloads folder',
                                    buttons: ['Continue']
                                });
                                alert.present();
                            })
                                .catch(function (err) {
                                _this.File.writeExistingFile(_this.File.dataDirectory, fileName_1, str_1)
                                    .then(function (_) {
                                    var alert = _this.alertCtrl.create({
                                        title: 'Download Success',
                                        subTitle: 'A .csv of the diversity form responses has been successfully exported to your Downloads folder',
                                        buttons: ['Continue']
                                    });
                                    alert.present();
                                })
                                    .catch(function (err) {
                                    console.log(err + 'Failure' + _this.File.dataDirectory);
                                });
                            });
                        }
                    }
                }, function (err) {
                    console.log('Error: ', err);
                });
            }
        }, function (err) {
            console.log("something went wrong on retrieving the diversity form responses");
        });
    };
    /**
     * This method allows the user to download a csv file of questionnaire responses to the device's 'Downloads' folder.
     */
    CsvDownloadsPage.prototype.getQuestionnaireResponses = function () {
        var _this = this;
        this.sqlitedatabase.listAllStats2()
            .then(function (allStats) {
            var questionNumber;
            var questionTextArray = [];
            var questionText;
            var questionnaireResults = [];
            for (var z = 0; z < allStats.length; z++) {
                questionNumber = (allStats[z].question_id);
                _this.sqlitedatabase.getQuestion(questionNumber)
                    .then(function (data) {
                    if (data == null) {
                        console.log("no data in table");
                        return;
                    }
                    var question_text;
                    if (data.rows.length > 0) {
                        questionNumber = data.rows.item(0).id;
                        question_text = data.rows.item(0).question_text;
                        questionText = question_text.toString();
                        questionTextArray.push(questionText);
                        if (questionTextArray.length === allStats.length) {
                            for (var i = 0; i < allStats.length; i++) {
                                questionnaireResults.push({
                                    question: questionTextArray[i],
                                    response: allStats[i].response,
                                    count: allStats[i].count
                                });
                            }
                            console.log("Questionnaire responses: ");
                            console.log(questionnaireResults);
                            var array = typeof questionnaireResults != 'object' ? JSON.parse(questionnaireResults) : questionnaireResults;
                            var str_2 = '';
                            var row = "";
                            for (var index in questionnaireResults[0]) {
                                row += index + ',';
                            }
                            row = row.slice(0, -1);
                            str_2 += row + '\r\n';
                            for (var i_2 = array.length - 1; i_2 >= 0; i_2--) {
                                var line = '';
                                for (var index in array[i_2]) {
                                    if (line != '')
                                        line += ',';
                                    line += array[i_2][index];
                                }
                                str_2 += line + '\r\n';
                            }
                            //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
                            var d = new Date();
                            var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
                            var fileName_2 = "QuestionnaireResponses" + date.toString() + ".csv";
                            console.log(fileName_2);
                            _this.File.writeFile(_this.File.externalRootDirectory + '/Download/', fileName_2, str_2)
                                .then(function (_) {
                                var alert = _this.alertCtrl.create({
                                    title: 'Download Success',
                                    subTitle: 'A .csv of the questionnaire form responses has been successfully exported to your Downloads folder',
                                    buttons: ['Continue']
                                });
                                alert.present();
                            })
                                .catch(function (err) {
                                _this.File.writeExistingFile(_this.File.dataDirectory, fileName_2, str_2)
                                    .then(function (_) {
                                    var alert = _this.alertCtrl.create({
                                        title: 'Download Success',
                                        subTitle: 'A .csv of the questionnaire form responses has been successfully exported to your Downloads folder',
                                        buttons: ['Continue']
                                    });
                                    alert.present();
                                })
                                    .catch(function (err) {
                                    console.log(err + 'Failure' + _this.File.dataDirectory);
                                });
                            });
                        }
                    }
                }, function (err) {
                    console.log('Error: ', err);
                });
            }
        }, function (err) {
            console.log("something went wrong on retrieving questionnaire responses");
        });
    };
    /**
     * This method allows the user to download a csv file of the visitor history to the device's 'Downloads' folder.
     */
    CsvDownloadsPage.prototype.downloadCSV = function () {
        var _this = this;
        this.sqlitedatabase.listLoginDetailsForTable()
            .then(function (stats) {
            var arrayConverted2 = [];
            for (var q = 0; q < stats.length; q++) {
                var logoutTimeString = (stats[q].logout_time).toString();
                var loginTimeString = (stats[q].login_time).toString();
                var currentDateInfoArray = logoutTimeString.split(" ");
                var currentYear = currentDateInfoArray[3];
                var year = 1970;
                if (currentYear.toString() == year.toString()) {
                    var stillActiveString = 'Volunteer still active';
                    arrayConverted2.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: stillActiveString
                    });
                }
                else {
                    arrayConverted2.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: logoutTimeString
                    });
                }
            }
            var array = typeof arrayConverted2 != 'object' ? JSON.parse(arrayConverted2) : arrayConverted2;
            var str = '';
            var row = "";
            for (var index in arrayConverted2[0]) {
                row += index + ',';
            }
            row = row.slice(0, -1);
            str += row + '\r\n';
            for (var i = array.length - 1; i >= 0; i--) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '')
                        line += ',';
                    line += array[i][index];
                }
                str += line + '\r\n';
            }
            //Every time a CSV of the data is downloaded, the file is given a name that includes the Date and Time so it can be uniquely identified    
            var d = new Date();
            var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
            var fileName = "LoginHistory" + date.toString() + ".csv";
            console.log(fileName);
            _this.File.writeFile(_this.File.externalRootDirectory + '/Download/', fileName, str)
                .then(function (_) {
                var alert = _this.alertCtrl.create({
                    title: 'Download Success',
                    subTitle: 'A .csv of the login history has been successfully exported to your Downloads folder',
                    buttons: ['Continue']
                });
                alert.present();
            })
                .catch(function (err) {
                _this.File.writeExistingFile(_this.File.dataDirectory, fileName, str)
                    .then(function (_) {
                    var alert = _this.alertCtrl.create({
                        title: 'Download Success',
                        subTitle: 'A .csv of the login history has been successfully exported to your Downloads folder',
                        buttons: ['Continue']
                    });
                    alert.present();
                })
                    .catch(function (err) {
                    console.log(err + 'Failure' + _this.File.dataDirectory);
                });
            });
        }, function (err) {
            var alert = _this.alertCtrl.create({
                title: 'Download Failure',
                subTitle: 'A .csv of the login history has failed to export',
                buttons: ['Continue']
            });
            alert.present();
        });
    };
    CsvDownloadsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            template: "\n    <ion-list>\n      <ion-list-header> CSV Downloads </ion-list-header>\n      <button ion-item (click)=\"downloadCSV()\"> Login History\n      <ion-icon name=\"download\"></ion-icon> \n      </button>\n      <button ion-item (click)=\"getQuestionnaireResponses()\"> Questionnaire Responses \n      <ion-icon name=\"download\"></ion-icon>\n      </button>\n      <button ion-item (click)=\"getDiversityResponses()\"> Diversity Responses \n      <ion-icon name=\"download\"></ion-icon>\n      </button>\n\n    </ion-list>\n  "
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], CsvDownloadsPage);
    return CsvDownloadsPage;
}());

//# sourceMappingURL=csv-downloads.js.map

/***/ }),

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleDriveProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file google-drive.ts is adapted from https://developers.google.com/apis-explorer/?hl=en_GB#p/sheets/v4/

*/
////////////////////////////////////////////////////////////////////////////////////////////////
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var GoogleDriveProvider = (function () {
    function GoogleDriveProvider(http, sqlitedatabase) {
        this.http = http;
        this.sqlitedatabase = sqlitedatabase;
        this.registrationArray = [];
        this.latestTimeStamp = '';
        this.latestTimeStamp2 = '';
        this.valueChangeStatus = false;
        this.valueChangeStatus2 = false;
    }
    /**
     * This method retrieves the data from the Registration Google sheet usin gthe Google sheets REST API. It stores the data in the 'inputArray' array.
     * It will only do so if the time stamp ofthe particular row in the Google sheet is more recent than the last time stamp from the last import.
     * The program keeps track of the time stamps of the data that was imported.
     */
    GoogleDriveProvider.prototype.getGoogleDocRegistrationData = function () {
        var _this = this;
        this.updateLastSync();
        this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1JL2UaQGqsaGv0dWnShQvFUnivfu-4Hi4P3XkqhwgzpA/values/Live!A2%3AZZZ?key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(function (res) { return res.json(); }).subscribe(function (data) {
            for (var i = 0; i < data.values.length; i++) {
                if (data.values[i][1]) {
                    var lastGoogleTimestamp = data.values[i][0];
                    var lastGoogleTimestampUTC = _this.spliceDateToUTC(lastGoogleTimestamp);
                    console.log("unmodified lastgoogletimestamp2: " + lastGoogleTimestampUTC);
                    console.log("unmodified lastgoogletimestamp: " + lastGoogleTimestamp);
                    console.log("parsed lastTimestamp: " + _this.latestTimeStamp);
                    console.log("parsed lastGoogleTimestamp: " + Date.parse(lastGoogleTimestampUTC));
                    if (Date.parse(lastGoogleTimestampUTC) > +_this.latestTimeStamp) {
                        console.log("adding new data from google sheets because new data available");
                        var inputArray = [];
                        var outputRegistrationArray = [];
                        for (var j = 0; j < data.values[i].length; j++) {
                            inputArray.push(data.values[i][j]);
                        }
                        console.log("inputArray: " + inputArray);
                        _this.spliceDataForRegistration(inputArray, outputRegistrationArray);
                        _this.registerUserFromDB(outputRegistrationArray);
                        _this.valueChangeStatus = true;
                    }
                }
            }
            if (_this.valueChangeStatus) {
                _this.sqlitedatabase.setLastSync(Date.parse(lastGoogleTimestampUTC));
                _this.valueChangeStatus = false;
            }
        });
    };
    /**
     * This method retrieves the data from the Diversity Questionnaire Google sheet using the Google sheets REST API. It stores the data in the 'inputArray' array.
     * It will only do so if the time stamp ofthe particular row in the Google sheet is more recent than the last time stamp from the last import.
     * The program keeps track of the time stamps of the data that was imported.
     */
    GoogleDriveProvider.prototype.getGoogleDocDiversityQuestionnaireData = function () {
        var _this = this;
        this.updateLastSync2();
        this.http.get('https://sheets.googleapis.com/v4/spreadsheets/1eOuV0vyHF7w_ei7t-_PtIxqPjben3oba249IgQ575kc/values/Online%20Applications!A2%3AZZZ?valueRenderOption=FORMATTED_VALUE&key=AIzaSyB1gTt1BzWO6sueuIYAwabWPfgWE6MZrOU').map(function (res) { return res.json(); }).subscribe(function (data) {
            for (var i = 0; i < data.values.length; i++) {
                if (data.values[i][0]) {
                    var lastGoogleTimestamp = data.values[i][0];
                    var lastGoogleTimestampUTC = _this.spliceDateToUTC(lastGoogleTimestamp);
                    console.log("unmodified lastgoogletimestamp2: " + lastGoogleTimestampUTC);
                    console.log("unmodified lastgoogletimestamp: " + lastGoogleTimestamp);
                    console.log("unparsed lastTimestamp: " + _this.latestTimeStamp2);
                    console.log("parsed lastGoogleTimestamp: " + Date.parse(lastGoogleTimestampUTC));
                    if (Date.parse(lastGoogleTimestampUTC) > +_this.latestTimeStamp2) {
                        console.log("adding new data from google sheets because new data available");
                        var inputArray = [];
                        var outputRegistrationArray = [];
                        for (var j = 0; j < data.values[i].length; j++) {
                            inputArray.push(data.values[i][j]);
                        }
                        console.log("inputArray: " + inputArray);
                        _this.spliceDataForDiversityQuestionnaire(inputArray, outputRegistrationArray);
                        for (var l = 0; l < 9; l++) {
                            _this.addDiversityAnswer(l + 1, outputRegistrationArray[l], data.values[i][0]);
                        }
                        _this.valueChangeStatus2 = true;
                    }
                }
            }
            if (_this.valueChangeStatus2) {
                _this.sqlitedatabase.setLastSync2(Date.parse(lastGoogleTimestampUTC));
                _this.valueChangeStatus2 = false;
            }
        });
    };
    /**
     * This method querries the last time stamp for the registration data from the local database and assigns it to the 'latestTimeStamp' variable.
     */
    GoogleDriveProvider.prototype.updateLastSync = function () {
        var _this = this;
        this.sqlitedatabase.getLastSync().then(function (data2) {
            if (data2 == null) {
                console.log("no timestamp yet");
                return;
            }
            if (data2.rows.length > 0) {
                _this.latestTimeStamp = data2.rows.item(0).last_sync;
                console.log('maximumValue:' + data2.rows.item(0).last_sync);
            }
        });
    };
    /**
     * This method querries the last time stamp for the diveristy questionnaire data from the local database and assigns it to the 'latestTimeStamp' variable.
     */
    GoogleDriveProvider.prototype.updateLastSync2 = function () {
        var _this = this;
        this.sqlitedatabase.getLastSync2().then(function (data2) {
            if (data2 == null) {
                console.log("no timestamp yet");
                return;
            }
            if (data2.rows.length > 0) {
                _this.latestTimeStamp2 = data2.rows.item(0).last_sync;
                console.log('maximumValue:' + data2.rows.item(0).last_sync);
            }
        });
    };
    /**
     * This method takes an array of data from the Google sheet registration data and converts it to a format that is readable by the local database.
     * @param inputArray
     * @param outputArray
     */
    GoogleDriveProvider.prototype.spliceDataForRegistration = function (inputArray, outputArray) {
        var str = inputArray[1];
        var splitted = str.split(' ');
        //first name
        outputArray.push(splitted[0]);
        var str2 = '';
        for (var k = 1; k < splitted.length; k++) {
            str2 = str2 + splitted[k] + ' ';
        }
        //last name  
        outputArray.push(str2);
        //email
        outputArray.push(inputArray[5]);
        //phone number
        outputArray.push(inputArray[4]);
        //instead of address
        outputArray.push("");
        //instead of postcode
        outputArray.push(inputArray[2]);
        //emergency_name
        outputArray.push(inputArray[13]);
        //emergency_telephone
        outputArray.push(inputArray[14]);
        //emergency_relationship
        outputArray.push(inputArray[16]);
    };
    /**
     * This method takes an array of data from the Google sheet diversity questionnaire data and converts it to a format that is readable by the local database.
     * @param inputArray
     * @param outputArray
     */
    GoogleDriveProvider.prototype.spliceDataForDiversityQuestionnaire = function (inputArray, outputArray) {
        //Age Category
        outputArray.push(inputArray[19]);
        // Sex
        outputArray.push(inputArray[18]);
        //Sexual orientation
        outputArray.push(inputArray[23]);
        //Etnicity
        outputArray.push(inputArray[20]);
        //Disability
        outputArray.push(inputArray[21]);
        //Caring responsibilities
        outputArray.push(inputArray[22]);
        //Religion
        outputArray.push(inputArray[24]);
        //Curent employment status
        outputArray.push(inputArray[25]);
        //London Borough
        outputArray.push(inputArray[29]);
    };
    /**
     * Thie method takes the date stamp from the google sheet (in dd/mm/yyyy hh:mm:ss) and converts it to a UTC-string format.
     * @param inputDate
     */
    GoogleDriveProvider.prototype.spliceDateToUTC = function (inputDate) {
        var outputUTCDate = '';
        var splitted = inputDate.split('/', 3);
        var splitted2 = splitted[2].split(' ');
        outputUTCDate = outputUTCDate + splitted2[0] + '-' + splitted[1] + '-' + splitted[0] + ' ' + splitted2[1];
        console.log(outputUTCDate);
        return outputUTCDate;
    };
    /**
     * This method adds data from an array to the question_response SQLite table that contains registration questionnaire data.
     * @param data
     */
    GoogleDriveProvider.prototype.addRegistrationQuestionnaireToDB = function (data) {
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
        return this.sqlitedatabase.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
     * This method adds data from an array to the sutton_user SQLite table that contains registration  data.
     * @param data
     */
    GoogleDriveProvider.prototype.registerUserFromDB = function (dataArray) {
        var sql = "insert into sutton_user(\
                 first_name, last_name, \
                  email_address, \
                  phone_number, \
                  address, postcode, \
                  emergency_name,\
                  emergency_telephone,\
                  emergency_relationship\
              ) values (?,?,?,?,?,?,?,?,?)";
        var values = [
            dataArray[0],
            dataArray[1],
            dataArray[2],
            dataArray[3],
            dataArray[4],
            dataArray[5],
            dataArray[6],
            dataArray[7],
            dataArray[8]
        ];
        return this.sqlitedatabase.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
     * This method adds data from an array to the diversity_response SQLite table that contains diversity questionnaire data.
     * @param data
     */
    GoogleDriveProvider.prototype.addDiversityAnswer = function (question_id, answer, timestamp) {
        var insert_sql = "INSERT INTO diversity_response (\
                        question_id, option_text, recorded_at)\
                        VALUES (?, ?, ?)";
        var params = [question_id, answer, timestamp];
        this.sqlitedatabase.db.executeSql(insert_sql, params);
    };
    GoogleDriveProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_2__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GoogleDriveProvider);
    return GoogleDriveProvider;
}());

//# sourceMappingURL=google-drive.js.map

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackandProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file backand.ts is adapted from http://blog.backand.com/how-to-use-ionic-2-with-backand/

*/
////////////////////////////////////////////////////////////////////////////////////////////////
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BackandProvider = (function () {
    function BackandProvider(http) {
        this.http = http;
        this.auth_token = { header_name: 'AnonymousToken', header_value: '25d59e1a-64af-4ec1-9cd0-91eb2516a8e2' };
        this.api_url = 'https://api.backand.com:443';
        this.app_name = 'scfapp';
    }
    BackandProvider.prototype.authHeader = function () {
        var authHeader = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]();
        authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
        return authHeader;
    };
    BackandProvider.prototype.getRegistrations = function () {
        return this.http.get(this.api_url + '/1/objects/registration', {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); });
    };
    BackandProvider.prototype.getLoginData = function () {
        return this.http.get(this.api_url + '/1/objects/login_history', {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); });
    };
    BackandProvider.prototype.getRegistrationQuestionnaireData = function () {
        return this.http.get(this.api_url + '/1/objects/registration_questionnaire', {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); });
    };
    BackandProvider.prototype.getDiversityQuestionnaireData = function () {
        return this.http.get(this.api_url + '/1/objects/diversity_questionnaire', {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); });
    };
    BackandProvider.prototype.addRegistration = function (registration) {
        var data = JSON.stringify({ user_id: registration[0], first_name: registration[1], last_name: registration[2], email_address: registration[3], phone_number: registration[4], address: registration[5], postcode: registration[6], emergency_name: registration[7], emergency_telephone: registration[8], emergency_relationship: registration[9] });
        console.log("print from backand.ts shows what stringify looks like: " + data);
        return this.http.post(this.api_url + '/1/objects/registration', data, {
            headers: this.authHeader()
        })
            .map(function (res) {
            return res.json();
        });
    };
    BackandProvider.prototype.addRegistrationData = function (data) {
        return this.http.post(this.api_url + '/1/objects/registration', data, {
            headers: this.authHeader()
        })
            .map(function (res) {
            return res.json();
        });
    };
    BackandProvider.prototype.getSingleRegistration = function (user_id) {
        return this.http.get(this.api_url + '/1/objects/registration/' + user_id, {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); });
    };
    BackandProvider.prototype.getRegistrationsAsArray = function () {
        this.http.get(this.api_url + '/1/objects/registration', {
            headers: this.authHeader()
        })
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            console.log(data);
        });
    };
    BackandProvider.prototype.addLoginData = function (data) {
        return this.http.post(this.api_url + '/1/objects/login_history', data, {
            headers: this.authHeader()
        })
            .map(function (res) {
            return res.json();
        });
    };
    BackandProvider.prototype.addRegistrationQuestionnaireData = function (data) {
        return this.http.post(this.api_url + '/1/objects/registration_questionnaire', data, {
            headers: this.authHeader()
        })
            .map(function (res) {
            return res.json();
        });
    };
    BackandProvider.prototype.addDiversityQuestionnaireData = function (data) {
        return this.http.post(this.api_url + '/1/objects/diversity_questionnaire', data, {
            headers: this.authHeader()
        })
            .map(function (res) {
            return res.json();
        });
    };
    BackandProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], BackandProvider);
    return BackandProvider;
}());

//# sourceMappingURL=backand.js.map

/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectionCheckProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__ = __webpack_require__(391);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConnectionCheckProvider = (function () {
    function ConnectionCheckProvider(http, network) {
        this.http = http;
        this.network = network;
        this.connectionStatus();
    }
    /**
     * This method checks if the device is connected to a network. If there is not connection or the conenction status is 'uknown' then the 'connected' variable will have the value of false.
     */
    ConnectionCheckProvider.prototype.connectionStatus = function () {
        if (this.network.type == 'unknown' || this.network.type == 'none') {
            this.connected = false;
            console.log("no network connection");
        }
        else {
            this.connected = true;
            console.log("network connection established");
        }
    };
    ConnectionCheckProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__["a" /* Network */]])
    ], ConnectionCheckProvider);
    return ConnectionCheckProvider;
}());

//# sourceMappingURL=connection-check.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(413);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_logout_logout__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_register0_register0__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_register1_register1__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_register2_register2__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_register3_register3__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_register4_register4__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_register5_register5__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_register6_register6__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_questionnaire1_questionnaire1__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_questionnaire2_questionnaire2__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_questionnaire3_questionnaire3__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_questionnaire4_questionnaire4__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_questionnaire6_questionnaire6__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_questionnaire7_questionnaire7__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_questionnaire9_questionnaire9__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_questionnaire10_questionnaire10__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_questionnaire11_questionnaire11__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__angular_common_http__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_sqlite__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_status_bar__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_share_share__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_file_transfer__ = __webpack_require__(520);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ionic_native_file_path__ = __webpack_require__(521);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_camera__ = __webpack_require__(522);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_screen_orientation__ = __webpack_require__(523);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_admin_admin__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_admin_home_admin_home__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_admin_app_settings_admin_app_settings__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_admin_visitor_history_admin_visitor_history__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_graph1_graph1__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_graph2_graph2__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_graph3_graph3__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_graph4_graph4__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_graph_scatter1_graph_scatter1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_graph_scatter2_graph_scatter2__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_graph_scatter3_graph_scatter3__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_graph_scatter4_graph_scatter4__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_graph_scatter5_graph_scatter5__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_graph_pie2_graph_pie2__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_graph_pie3_graph_pie3__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_graph_pie4_graph_pie4__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_graph_pie5_graph_pie5__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__pages_graph_bar1_graph_bar1__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__pages_graph_bar2_graph_bar2__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__pages_graph_bar3_graph_bar3__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_graph_bar4_graph_bar4__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__pages_graph_bar5_graph_bar5__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__pages_diversity_questionnaire0_diversity_questionnaire0__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__pages_diversity_questionnaire1_diversity_questionnaire1__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__pages_diversity_questionnaire2_diversity_questionnaire2__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__pages_diversity_questionnaire3_diversity_questionnaire3__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__pages_diversity_questionnaire4_diversity_questionnaire4__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__pages_diversity_questionnaire5_diversity_questionnaire5__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__pages_diversity_questionnaire6_diversity_questionnaire6__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__pages_diversity_questionnaire7_diversity_questionnaire7__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__pages_diversity_questionnaire8_diversity_questionnaire8__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__pages_diversity_questionnaire9_diversity_questionnaire9__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__providers_google_drive_google_drive__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__providers_backand_backand__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__providers_connection_check_connection_check__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__ionic_native_network__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__pages_csv_downloads_csv_downloads__ = __webpack_require__(387);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










































































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_homepage_homepage__["a" /* HomepagePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_register1_register1__["a" /* Register1Page */],
                __WEBPACK_IMPORTED_MODULE_9__pages_register2_register2__["a" /* Register2Page */],
                __WEBPACK_IMPORTED_MODULE_10__pages_register3_register3__["a" /* Register3Page */],
                __WEBPACK_IMPORTED_MODULE_12__pages_register5_register5__["a" /* Register5Page */],
                __WEBPACK_IMPORTED_MODULE_13__pages_register6_register6__["a" /* Register6Page */],
                __WEBPACK_IMPORTED_MODULE_11__pages_register4_register4__["a" /* Register4Page */],
                __WEBPACK_IMPORTED_MODULE_7__pages_register0_register0__["a" /* Register0Page */],
                __WEBPACK_IMPORTED_MODULE_36__pages_admin_admin__["a" /* AdminPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_admin_home_admin_home__["a" /* AdminHomePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_admin_app_settings_admin_app_settings__["a" /* AdminAppSettingsPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_admin_visitor_history_admin_visitor_history__["a" /* AdminVisitorHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_graph1_graph1__["a" /* Graph1Page */],
                __WEBPACK_IMPORTED_MODULE_42__pages_graph2_graph2__["a" /* Graph2Page */],
                __WEBPACK_IMPORTED_MODULE_43__pages_graph3_graph3__["a" /* Graph3Page */],
                __WEBPACK_IMPORTED_MODULE_44__pages_graph4_graph4__["a" /* Graph4Page */],
                __WEBPACK_IMPORTED_MODULE_14__pages_questionnaire1_questionnaire1__["a" /* Questionnaire1Page */],
                __WEBPACK_IMPORTED_MODULE_15__pages_questionnaire2_questionnaire2__["a" /* Questionnaire2Page */],
                __WEBPACK_IMPORTED_MODULE_16__pages_questionnaire3_questionnaire3__["a" /* Questionnaire3Page */],
                __WEBPACK_IMPORTED_MODULE_17__pages_questionnaire4_questionnaire4__["a" /* Questionnaire4Page */],
                __WEBPACK_IMPORTED_MODULE_18__pages_questionnaire6_questionnaire6__["a" /* Questionnaire6Page */],
                __WEBPACK_IMPORTED_MODULE_19__pages_questionnaire7_questionnaire7__["a" /* Questionnaire7Page */],
                __WEBPACK_IMPORTED_MODULE_20__pages_questionnaire9_questionnaire9__["a" /* Questionnaire9Page */],
                __WEBPACK_IMPORTED_MODULE_21__pages_questionnaire10_questionnaire10__["a" /* Questionnaire10Page */],
                __WEBPACK_IMPORTED_MODULE_22__pages_questionnaire11_questionnaire11__["a" /* Questionnaire11Page */],
                __WEBPACK_IMPORTED_MODULE_45__pages_graph_scatter1_graph_scatter1__["a" /* GraphScatter1Page */],
                __WEBPACK_IMPORTED_MODULE_46__pages_graph_scatter2_graph_scatter2__["a" /* GraphScatter2Page */],
                __WEBPACK_IMPORTED_MODULE_47__pages_graph_scatter3_graph_scatter3__["a" /* GraphScatter3Page */],
                __WEBPACK_IMPORTED_MODULE_48__pages_graph_scatter4_graph_scatter4__["a" /* GraphScatter4Page */],
                __WEBPACK_IMPORTED_MODULE_49__pages_graph_scatter5_graph_scatter5__["a" /* GraphScatter5Page */],
                __WEBPACK_IMPORTED_MODULE_50__pages_graph_pie2_graph_pie2__["a" /* GraphPie2Page */],
                __WEBPACK_IMPORTED_MODULE_51__pages_graph_pie3_graph_pie3__["a" /* GraphPie3Page */],
                __WEBPACK_IMPORTED_MODULE_52__pages_graph_pie4_graph_pie4__["a" /* GraphPie4Page */],
                __WEBPACK_IMPORTED_MODULE_53__pages_graph_pie5_graph_pie5__["a" /* GraphPie5Page */],
                __WEBPACK_IMPORTED_MODULE_54__pages_graph_bar1_graph_bar1__["a" /* GraphBar1Page */],
                __WEBPACK_IMPORTED_MODULE_55__pages_graph_bar2_graph_bar2__["a" /* GraphBar2Page */],
                __WEBPACK_IMPORTED_MODULE_56__pages_graph_bar3_graph_bar3__["a" /* GraphBar3Page */],
                __WEBPACK_IMPORTED_MODULE_57__pages_graph_bar4_graph_bar4__["a" /* GraphBar4Page */],
                __WEBPACK_IMPORTED_MODULE_58__pages_graph_bar5_graph_bar5__["a" /* GraphBar5Page */],
                __WEBPACK_IMPORTED_MODULE_59__pages_diversity_questionnaire0_diversity_questionnaire0__["a" /* DiversityQuestionnaire0Page */],
                __WEBPACK_IMPORTED_MODULE_60__pages_diversity_questionnaire1_diversity_questionnaire1__["a" /* DiversityQuestionnaire1Page */],
                __WEBPACK_IMPORTED_MODULE_61__pages_diversity_questionnaire2_diversity_questionnaire2__["a" /* DiversityQuestionnaire2Page */],
                __WEBPACK_IMPORTED_MODULE_62__pages_diversity_questionnaire3_diversity_questionnaire3__["a" /* DiversityQuestionnaire3Page */],
                __WEBPACK_IMPORTED_MODULE_63__pages_diversity_questionnaire4_diversity_questionnaire4__["a" /* DiversityQuestionnaire4Page */],
                __WEBPACK_IMPORTED_MODULE_64__pages_diversity_questionnaire5_diversity_questionnaire5__["a" /* DiversityQuestionnaire5Page */],
                __WEBPACK_IMPORTED_MODULE_65__pages_diversity_questionnaire6_diversity_questionnaire6__["a" /* DiversityQuestionnaire6Page */],
                __WEBPACK_IMPORTED_MODULE_66__pages_diversity_questionnaire7_diversity_questionnaire7__["a" /* DiversityQuestionnaire7Page */],
                __WEBPACK_IMPORTED_MODULE_67__pages_diversity_questionnaire8_diversity_questionnaire8__["a" /* DiversityQuestionnaire8Page */],
                __WEBPACK_IMPORTED_MODULE_68__pages_diversity_questionnaire9_diversity_questionnaire9__["a" /* DiversityQuestionnaire9Page */],
                __WEBPACK_IMPORTED_MODULE_73__pages_csv_downloads_csv_downloads__["a" /* CsvDownloadsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_23__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_25__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_35__angular_http__["c" /* HttpModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_homepage_homepage__["a" /* HomepagePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_register0_register0__["a" /* Register0Page */],
                __WEBPACK_IMPORTED_MODULE_8__pages_register1_register1__["a" /* Register1Page */],
                __WEBPACK_IMPORTED_MODULE_9__pages_register2_register2__["a" /* Register2Page */],
                __WEBPACK_IMPORTED_MODULE_10__pages_register3_register3__["a" /* Register3Page */],
                __WEBPACK_IMPORTED_MODULE_11__pages_register4_register4__["a" /* Register4Page */],
                __WEBPACK_IMPORTED_MODULE_12__pages_register5_register5__["a" /* Register5Page */],
                __WEBPACK_IMPORTED_MODULE_13__pages_register6_register6__["a" /* Register6Page */],
                __WEBPACK_IMPORTED_MODULE_14__pages_questionnaire1_questionnaire1__["a" /* Questionnaire1Page */],
                __WEBPACK_IMPORTED_MODULE_15__pages_questionnaire2_questionnaire2__["a" /* Questionnaire2Page */],
                __WEBPACK_IMPORTED_MODULE_16__pages_questionnaire3_questionnaire3__["a" /* Questionnaire3Page */],
                __WEBPACK_IMPORTED_MODULE_17__pages_questionnaire4_questionnaire4__["a" /* Questionnaire4Page */],
                __WEBPACK_IMPORTED_MODULE_18__pages_questionnaire6_questionnaire6__["a" /* Questionnaire6Page */],
                __WEBPACK_IMPORTED_MODULE_19__pages_questionnaire7_questionnaire7__["a" /* Questionnaire7Page */],
                __WEBPACK_IMPORTED_MODULE_20__pages_questionnaire9_questionnaire9__["a" /* Questionnaire9Page */],
                __WEBPACK_IMPORTED_MODULE_21__pages_questionnaire10_questionnaire10__["a" /* Questionnaire10Page */],
                __WEBPACK_IMPORTED_MODULE_22__pages_questionnaire11_questionnaire11__["a" /* Questionnaire11Page */],
                __WEBPACK_IMPORTED_MODULE_36__pages_admin_admin__["a" /* AdminPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_admin_home_admin_home__["a" /* AdminHomePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_admin_app_settings_admin_app_settings__["a" /* AdminAppSettingsPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_admin_visitor_history_admin_visitor_history__["a" /* AdminVisitorHistoryPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_graph1_graph1__["a" /* Graph1Page */],
                __WEBPACK_IMPORTED_MODULE_42__pages_graph2_graph2__["a" /* Graph2Page */],
                __WEBPACK_IMPORTED_MODULE_43__pages_graph3_graph3__["a" /* Graph3Page */],
                __WEBPACK_IMPORTED_MODULE_44__pages_graph4_graph4__["a" /* Graph4Page */],
                __WEBPACK_IMPORTED_MODULE_45__pages_graph_scatter1_graph_scatter1__["a" /* GraphScatter1Page */],
                __WEBPACK_IMPORTED_MODULE_46__pages_graph_scatter2_graph_scatter2__["a" /* GraphScatter2Page */],
                __WEBPACK_IMPORTED_MODULE_47__pages_graph_scatter3_graph_scatter3__["a" /* GraphScatter3Page */],
                __WEBPACK_IMPORTED_MODULE_48__pages_graph_scatter4_graph_scatter4__["a" /* GraphScatter4Page */],
                __WEBPACK_IMPORTED_MODULE_49__pages_graph_scatter5_graph_scatter5__["a" /* GraphScatter5Page */],
                __WEBPACK_IMPORTED_MODULE_50__pages_graph_pie2_graph_pie2__["a" /* GraphPie2Page */],
                __WEBPACK_IMPORTED_MODULE_51__pages_graph_pie3_graph_pie3__["a" /* GraphPie3Page */],
                __WEBPACK_IMPORTED_MODULE_52__pages_graph_pie4_graph_pie4__["a" /* GraphPie4Page */],
                __WEBPACK_IMPORTED_MODULE_53__pages_graph_pie5_graph_pie5__["a" /* GraphPie5Page */],
                __WEBPACK_IMPORTED_MODULE_54__pages_graph_bar1_graph_bar1__["a" /* GraphBar1Page */],
                __WEBPACK_IMPORTED_MODULE_55__pages_graph_bar2_graph_bar2__["a" /* GraphBar2Page */],
                __WEBPACK_IMPORTED_MODULE_56__pages_graph_bar3_graph_bar3__["a" /* GraphBar3Page */],
                __WEBPACK_IMPORTED_MODULE_57__pages_graph_bar4_graph_bar4__["a" /* GraphBar4Page */],
                __WEBPACK_IMPORTED_MODULE_58__pages_graph_bar5_graph_bar5__["a" /* GraphBar5Page */],
                __WEBPACK_IMPORTED_MODULE_59__pages_diversity_questionnaire0_diversity_questionnaire0__["a" /* DiversityQuestionnaire0Page */],
                __WEBPACK_IMPORTED_MODULE_60__pages_diversity_questionnaire1_diversity_questionnaire1__["a" /* DiversityQuestionnaire1Page */],
                __WEBPACK_IMPORTED_MODULE_61__pages_diversity_questionnaire2_diversity_questionnaire2__["a" /* DiversityQuestionnaire2Page */],
                __WEBPACK_IMPORTED_MODULE_62__pages_diversity_questionnaire3_diversity_questionnaire3__["a" /* DiversityQuestionnaire3Page */],
                __WEBPACK_IMPORTED_MODULE_63__pages_diversity_questionnaire4_diversity_questionnaire4__["a" /* DiversityQuestionnaire4Page */],
                __WEBPACK_IMPORTED_MODULE_64__pages_diversity_questionnaire5_diversity_questionnaire5__["a" /* DiversityQuestionnaire5Page */],
                __WEBPACK_IMPORTED_MODULE_65__pages_diversity_questionnaire6_diversity_questionnaire6__["a" /* DiversityQuestionnaire6Page */],
                __WEBPACK_IMPORTED_MODULE_66__pages_diversity_questionnaire7_diversity_questionnaire7__["a" /* DiversityQuestionnaire7Page */],
                __WEBPACK_IMPORTED_MODULE_67__pages_diversity_questionnaire8_diversity_questionnaire8__["a" /* DiversityQuestionnaire8Page */],
                __WEBPACK_IMPORTED_MODULE_68__pages_diversity_questionnaire9_diversity_questionnaire9__["a" /* DiversityQuestionnaire9Page */],
                __WEBPACK_IMPORTED_MODULE_73__pages_csv_downloads_csv_downloads__["a" /* CsvDownloadsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_24__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_26__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_28__providers_share_share__["a" /* ShareProvider */],
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_33__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
                __WEBPACK_IMPORTED_MODULE_69__providers_google_drive_google_drive__["a" /* GoogleDriveProvider */],
                __WEBPACK_IMPORTED_MODULE_30__ionic_native_file_transfer__["a" /* FileTransfer */],
                __WEBPACK_IMPORTED_MODULE_30__ionic_native_file_transfer__["b" /* FileTransferObject */],
                __WEBPACK_IMPORTED_MODULE_72__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_32__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_31__ionic_native_file_path__["a" /* FilePath */],
                __WEBPACK_IMPORTED_MODULE_70__providers_backand_backand__["a" /* BackandProvider */],
                __WEBPACK_IMPORTED_MODULE_71__providers_connection_check_connection_check__["a" /* ConnectionCheckProvider */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 455:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_homepage_homepage__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_homepage_homepage__["a" /* HomepagePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\app\app.html"*/'<ion-nav #mainContent [root]="rootPage"></ion-nav>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomepagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_login__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register0_register0__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__logout_logout__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__admin_admin__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HomepagePage = (function () {
    function HomepagePage(navCtrl, sqlitedatabase, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlitedatabase = sqlitedatabase;
        this.storage = storage;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle');
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
    }
    /**
     * This method takes the user to the LoginPage page.
     */
    HomepagePage.prototype.goToLogin = function () {
        this.logStats();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__login_login__["a" /* LoginPage */]);
    };
    /**
       * This method takes the user to the Regist0Page page.
       */
    HomepagePage.prototype.goToRegister0 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register0_register0__["a" /* Register0Page */]);
    };
    /**
     * This method takes the user to the LogoutPage page.
     */
    HomepagePage.prototype.goToLogout = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__logout_logout__["a" /* LogoutPage */]);
    };
    /**
     * This method takes the user to the AdminPage page.
     */
    HomepagePage.prototype.goToAdmin = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__admin_admin__["a" /* AdminPage */]);
    };
    /**
     * This method is used in debugging and prints out all the data contained within the local database to the console.
     */
    HomepagePage.prototype.logStats = function () {
        // listAnswerStats(question_id) returns a promise  of array of stats 
        // for all questions. To use the result wrap it inside then()
        this.sqlitedatabase.listAllStatsNoCount().then(function (stats) {
            console.log("listAllStatsNoCount");
            console.log(JSON.stringify(stats));
        });
        this.sqlitedatabase.listAllRegistration().then(function (stats) {
            console.log("list all registrations");
            console.log(JSON.stringify(stats));
        });
        this.sqlitedatabase.listAllDiversityNoCount().then(function (stats) {
            console.log("list all diversity");
            console.log(JSON.stringify(stats));
        });
        this.sqlitedatabase.listAllLog().then(function (stats) {
            console.log("list all login logout");
            console.log(JSON.stringify(stats));
        });
        this.sqlitedatabase.listLastSync().then(function (stats) {
            console.log("list last sync");
            console.log(JSON.stringify(stats));
        });
    };
    HomepagePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-homepage',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\homepage\homepage.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n\n    <a id="homepage-button4" class="admin-button" href="#" on-click="goToAdmin()" float-left>\n        <label> + </label>\n    </a>\n\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <img src="assets/img/White-logo.png" style="display:block;width:75%;height:auto;margin-left:auto;margin-right:auto;" />\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-col>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <br>\n            <br>\n        </ion-row>\n\n\n        <ion-row>\n\n            <ion-col>\n                <a id="homepage-button1" class="semi-transparent-button" href="#" on-click="goToLogin()">\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="log-in"></ion-icon>\n                        <label> &#8239; &#8239; Login</label>\n                    </div>\n\n                </a>\n\n                <br>\n                <br>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <a id="homepage-button2" class="semi-transparent-button" href="#" on-click="goToRegister0()">\n                    <label> &#8239; </label>\n                    <ion-icon name="create"></ion-icon>\n                    <label> &#8239; Register</label>\n                </a>\n                <br>\n                <br>\n\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="homepage-button3" class="semi-transparent-button" href="#" on-click="goToLogout()">\n                    <label> &#8239; </label>\n                    <ion-icon name="log-out"></ion-icon>\n                    <label> &#8200; Logout</label>\n                </a>\n\n                <br>\n                <br>\n\n            </ion-col>\n\n\n        </ion-row>\n\n    </ion-grid>\n\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\homepage\homepage.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_6__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */]])
    ], HomepagePage);
    return HomepagePage;
}());

//# sourceMappingURL=homepage.js.map

/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 269,
	"./af.js": 269,
	"./ar": 270,
	"./ar-dz": 271,
	"./ar-dz.js": 271,
	"./ar-kw": 272,
	"./ar-kw.js": 272,
	"./ar-ly": 273,
	"./ar-ly.js": 273,
	"./ar-ma": 274,
	"./ar-ma.js": 274,
	"./ar-sa": 275,
	"./ar-sa.js": 275,
	"./ar-tn": 276,
	"./ar-tn.js": 276,
	"./ar.js": 270,
	"./az": 277,
	"./az.js": 277,
	"./be": 278,
	"./be.js": 278,
	"./bg": 279,
	"./bg.js": 279,
	"./bn": 280,
	"./bn.js": 280,
	"./bo": 281,
	"./bo.js": 281,
	"./br": 282,
	"./br.js": 282,
	"./bs": 283,
	"./bs.js": 283,
	"./ca": 284,
	"./ca.js": 284,
	"./cs": 285,
	"./cs.js": 285,
	"./cv": 286,
	"./cv.js": 286,
	"./cy": 287,
	"./cy.js": 287,
	"./da": 288,
	"./da.js": 288,
	"./de": 289,
	"./de-at": 290,
	"./de-at.js": 290,
	"./de-ch": 291,
	"./de-ch.js": 291,
	"./de.js": 289,
	"./dv": 292,
	"./dv.js": 292,
	"./el": 293,
	"./el.js": 293,
	"./en-au": 294,
	"./en-au.js": 294,
	"./en-ca": 295,
	"./en-ca.js": 295,
	"./en-gb": 296,
	"./en-gb.js": 296,
	"./en-ie": 297,
	"./en-ie.js": 297,
	"./en-nz": 298,
	"./en-nz.js": 298,
	"./eo": 299,
	"./eo.js": 299,
	"./es": 300,
	"./es-do": 301,
	"./es-do.js": 301,
	"./es.js": 300,
	"./et": 302,
	"./et.js": 302,
	"./eu": 303,
	"./eu.js": 303,
	"./fa": 304,
	"./fa.js": 304,
	"./fi": 305,
	"./fi.js": 305,
	"./fo": 306,
	"./fo.js": 306,
	"./fr": 307,
	"./fr-ca": 308,
	"./fr-ca.js": 308,
	"./fr-ch": 309,
	"./fr-ch.js": 309,
	"./fr.js": 307,
	"./fy": 310,
	"./fy.js": 310,
	"./gd": 311,
	"./gd.js": 311,
	"./gl": 312,
	"./gl.js": 312,
	"./gom-latn": 313,
	"./gom-latn.js": 313,
	"./he": 314,
	"./he.js": 314,
	"./hi": 315,
	"./hi.js": 315,
	"./hr": 316,
	"./hr.js": 316,
	"./hu": 317,
	"./hu.js": 317,
	"./hy-am": 318,
	"./hy-am.js": 318,
	"./id": 319,
	"./id.js": 319,
	"./is": 320,
	"./is.js": 320,
	"./it": 321,
	"./it.js": 321,
	"./ja": 322,
	"./ja.js": 322,
	"./jv": 323,
	"./jv.js": 323,
	"./ka": 324,
	"./ka.js": 324,
	"./kk": 325,
	"./kk.js": 325,
	"./km": 326,
	"./km.js": 326,
	"./kn": 327,
	"./kn.js": 327,
	"./ko": 328,
	"./ko.js": 328,
	"./ky": 329,
	"./ky.js": 329,
	"./lb": 330,
	"./lb.js": 330,
	"./lo": 331,
	"./lo.js": 331,
	"./lt": 332,
	"./lt.js": 332,
	"./lv": 333,
	"./lv.js": 333,
	"./me": 334,
	"./me.js": 334,
	"./mi": 335,
	"./mi.js": 335,
	"./mk": 336,
	"./mk.js": 336,
	"./ml": 337,
	"./ml.js": 337,
	"./mr": 338,
	"./mr.js": 338,
	"./ms": 339,
	"./ms-my": 340,
	"./ms-my.js": 340,
	"./ms.js": 339,
	"./my": 341,
	"./my.js": 341,
	"./nb": 342,
	"./nb.js": 342,
	"./ne": 343,
	"./ne.js": 343,
	"./nl": 344,
	"./nl-be": 345,
	"./nl-be.js": 345,
	"./nl.js": 344,
	"./nn": 346,
	"./nn.js": 346,
	"./pa-in": 347,
	"./pa-in.js": 347,
	"./pl": 348,
	"./pl.js": 348,
	"./pt": 349,
	"./pt-br": 350,
	"./pt-br.js": 350,
	"./pt.js": 349,
	"./ro": 351,
	"./ro.js": 351,
	"./ru": 352,
	"./ru.js": 352,
	"./sd": 353,
	"./sd.js": 353,
	"./se": 354,
	"./se.js": 354,
	"./si": 355,
	"./si.js": 355,
	"./sk": 356,
	"./sk.js": 356,
	"./sl": 357,
	"./sl.js": 357,
	"./sq": 358,
	"./sq.js": 358,
	"./sr": 359,
	"./sr-cyrl": 360,
	"./sr-cyrl.js": 360,
	"./sr.js": 359,
	"./ss": 361,
	"./ss.js": 361,
	"./sv": 362,
	"./sv.js": 362,
	"./sw": 363,
	"./sw.js": 363,
	"./ta": 364,
	"./ta.js": 364,
	"./te": 365,
	"./te.js": 365,
	"./tet": 366,
	"./tet.js": 366,
	"./th": 367,
	"./th.js": 367,
	"./tl-ph": 368,
	"./tl-ph.js": 368,
	"./tlh": 369,
	"./tlh.js": 369,
	"./tr": 370,
	"./tr.js": 370,
	"./tzl": 371,
	"./tzl.js": 371,
	"./tzm": 372,
	"./tzm-latn": 373,
	"./tzm-latn.js": 373,
	"./tzm.js": 372,
	"./uk": 374,
	"./uk.js": 374,
	"./ur": 375,
	"./ur.js": 375,
	"./uz": 376,
	"./uz-latn": 377,
	"./uz-latn.js": 377,
	"./uz.js": 376,
	"./vi": 378,
	"./vi.js": 378,
	"./x-pseudo": 379,
	"./x-pseudo.js": 379,
	"./yo": 380,
	"./yo.js": 380,
	"./zh-cn": 381,
	"./zh-cn.js": 381,
	"./zh-hk": 382,
	"./zh-hk.js": 382,
	"./zh-tw": 383,
	"./zh-tw.js": 383
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 501;

/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminHomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__admin_admin__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__admin_app_settings_admin_app_settings__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__admin_visitor_history_admin_visitor_history__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_google_drive_google_drive__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_backand_backand__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_connection_check_connection_check__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_papaparse__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_papaparse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_papaparse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_file__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AdminHomePage = (function () {
    function AdminHomePage(navCtrl, navParams, gDrive, storage, sqlitedatabase, backandService, connectioncheck, alertController, http, File) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.gDrive = gDrive;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.backandService = backandService;
        this.connectioncheck = connectioncheck;
        this.alertController = alertController;
        this.http = http;
        this.File = File;
        this.registrations = [];
        this.loginData = [];
        this.diversityQuestionnaireData = [];
        this.registrationQuestionnaireData = [];
        this.csvData = [];
        this.headerRow = [];
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.autoLogoutUser();
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.connectioncheck.connectionStatus();
        this.clearArrays();
        this.csvFromDatabase();
    }
    /**
     * This method opens the AdminPage page.
     */
    AdminHomePage.prototype.goToAdmin = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__admin_admin__["a" /* AdminPage */]);
    };
    /**
     * This method opens the HomepagePage page.
     */
    AdminHomePage.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method opens the AdminAppSettingsPage page.
     */
    AdminHomePage.prototype.goToAdminAppSettings = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__admin_app_settings_admin_app_settings__["a" /* AdminAppSettingsPage */]);
    };
    /**
     * This method opens the AdminVistorDataPage page.
     */
    AdminHomePage.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
     * This method opens the AdminVistoryHistoryPage page.
     */
    AdminHomePage.prototype.goToAdminVisitorHistory = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__admin_visitor_history_admin_visitor_history__["a" /* AdminVisitorHistoryPage */]);
    };
    /**
     * This method is called when the "Sync" button is pressed. It retrieves data from the google sheets and stores it in the local SQLite database.
     * After a 1 second timeout to make sure that the data retrieval is complete, it sends all the data stored on the local database to the online Backand database
     * then clears the local database and redownloads all the data from the online database.
     * This method is only called when there is an internet conenction, if there isn't one and error message will appear.
     */
    AdminHomePage.prototype.sync = function () {
        var _this = this;
        this.connectioncheck.connectionStatus();
        if (this.connectioncheck.connected) {
            this.gDrive.getGoogleDocDiversityQuestionnaireData();
            this.gDrive.getGoogleDocRegistrationData();
            setTimeout(function () {
                _this.syncRegistration();
                _this.syncLoginHistory();
                _this.syncRegistrationQuestionnaire();
                _this.syncDiversityQuestionnaire();
                var addTodoAlert = _this.alertController.create({
                    title: "Sync complete",
                    message: "The data from the Google forms and the online database has been synced",
                });
                addTodoAlert.present();
            }, 7000);
        }
        else {
            var addTodoAlert = this.alertController.create({
                title: "Warning!",
                message: "No internet connection. Please try again later",
            });
            addTodoAlert.present();
        }
    };
    /**
     * This method sends all the registration data from the local database to the onine database. Clears the local table containing the registration data and reloads all the online data to the local database.
     * This clearing and reloading process ensures there are no data duplicates and that no data is corruct.
     */
    AdminHomePage.prototype.syncRegistration = function () {
        var _this = this;
        this.sendRegistrationDataLoop().then(function () {
            _this.sqlitedatabase.clearRegistrationDb().then(function () {
                _this.loadRegistrations();
                setTimeout(function () {
                    _this.populateRegistrationTable();
                }, 5000);
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
   * This method sends all the login data from the local database to the onine database. Clears the local table containing the login data and reloads all the online data to the local database.
   * This clearing and reloading process ensures there are no data duplicates and that no data is corruct.
   */
    AdminHomePage.prototype.syncLoginHistory = function () {
        var _this = this;
        this.sendLoginData().then(function () {
            _this.sqlitedatabase.clearLoginHistoryDB().then(function () {
                _this.loadLoginData();
                setTimeout(function () {
                    _this.populatLoginHistoryTable();
                }, 5000);
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
     * This method sends all the registration questionnaire data from the local database to the onine database. Clears the local table containing the registration questionnaire data and reloads all the online data to the local database.
     * This clearing and reloading process ensures there are no data duplicates and that no data is corruct.
     */
    AdminHomePage.prototype.syncRegistrationQuestionnaire = function () {
        var _this = this;
        this.sendRegistrationQuestionnaireData().then(function () {
            _this.sqlitedatabase.clearRegistrationQuestionnaireDB().then(function () {
                _this.loadRegistrationQuestionnaireData();
                setTimeout(function () {
                    _this.populateRegistrationQuestionnaireTable();
                }, 5000);
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
   * This method sends all the diversity questionnaire data from the local database to the onine database. Clears the local table containing the diversity questionnaire data and reloads all the online data to the local database.
   * This clearing and reloading process ensures there are no data duplicates and that no data is corruct.
   */
    AdminHomePage.prototype.syncDiversityQuestionnaire = function () {
        var _this = this;
        this.sendDiversityQuestionnaireData().then(function () {
            _this.sqlitedatabase.clearDiversityQuestionnaireDB().then(function () {
                _this.loadDiversityQuestionnaireData();
                setTimeout(function () {
                    _this.populateDiversityQuestionnaireTable();
                }, 5000);
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
     * This method sends registration data from the local database to the online Backand database using the Backand REST API.
     */
    AdminHomePage.prototype.sendRegistrationDataLoop = function () {
        var _this = this;
        console.log("sendRegistrationDataLoop called   ");
        return this.sqlitedatabase.listAllRegistration().then(function (stats) {
            for (var i = 0; i < stats.length; i++) {
                _this.backandService.addRegistrationData(JSON.stringify(stats[i])).subscribe(function (err) { return _this.logError(err); });
            }
        });
    };
    /**
     * This method loads all the registration data from the online Backand database to the 'registrations' array using the Backand REST API.
     */
    AdminHomePage.prototype.loadRegistrations = function () {
        var _this = this;
        console.log("load registrations called");
        this.backandService.getRegistrations()
            .subscribe(function (data) {
            _this.registrations = data.data;
        }, function (err) {
            console.log(err);
        });
    };
    /**
   * This method loads all the login data from the online Backand database to the 'loginData' array using the Backand REST API.
   */
    AdminHomePage.prototype.loadLoginData = function () {
        var _this = this;
        console.log("load login data called");
        this.backandService.getLoginData()
            .subscribe(function (data) {
            _this.loginData = data.data;
        }, function (err) {
            console.log(err);
        });
    };
    /**
   * This method loads all the registration questionnaire data from the online Backand database to the 'registrationQuestionnaireData' array using the Backand REST API.
   */
    AdminHomePage.prototype.loadRegistrationQuestionnaireData = function () {
        var _this = this;
        console.log("load registration questionnaire data called");
        this.backandService.getRegistrationQuestionnaireData()
            .subscribe(function (data) {
            _this.registrationQuestionnaireData = data.data;
        }, function (err) {
            console.log(err);
        });
    };
    /**
   * This method loads all the diversity questionnaire data from the online Backand database to the 'diversityQuestionnaireData' array using the Backand REST API.
   */
    AdminHomePage.prototype.loadDiversityQuestionnaireData = function () {
        var _this = this;
        console.log("load diversity questionnaire data called");
        this.backandService.getDiversityQuestionnaireData()
            .subscribe(function (data) {
            _this.diversityQuestionnaireData = data.data;
        }, function (err) {
            console.log(err);
        });
    };
    AdminHomePage.prototype.logError = function (err) {
        console.error('Error: ' + err);
    };
    /**
     * This method populates the local SQLite database with data from the 'registrations' array.
     */
    AdminHomePage.prototype.populateRegistrationTable = function () {
        console.log("populate registration table called");
        for (var i = 0; i < this.registrations.length; i++) {
            var inputarray = [];
            inputarray.push(this.registrations[i].user_id);
            inputarray.push(this.registrations[i].first_name);
            inputarray.push(this.registrations[i].last_name);
            inputarray.push(this.registrations[i].email_address);
            inputarray.push(this.registrations[i].phone_number);
            inputarray.push(this.registrations[i].address);
            inputarray.push(this.registrations[i].postcode);
            inputarray.push(this.registrations[i].emergency_name);
            inputarray.push(this.registrations[i].emergency_telephone);
            inputarray.push(this.registrations[i].emergency_relationship);
            this.sqlitedatabase.registerUserFromDB(inputarray);
        }
    };
    /**
     * This method sends login data from the local database to the online Backand database using the Backand REST API.
     */
    AdminHomePage.prototype.sendLoginData = function () {
        var _this = this;
        console.log("sendLoginData called   ");
        return this.sqlitedatabase.listAllLog().then(function (stats) {
            for (var i = 0; i < stats.length; i++) {
                _this.backandService.addLoginData(JSON.stringify(stats[i])).subscribe(function (err) { return _this.logError(err); });
            }
        });
    };
    /**
   * This method sends registration qeustionnaire data from the local database to the online Backand database using the Backand REST API.
   */
    AdminHomePage.prototype.sendRegistrationQuestionnaireData = function () {
        var _this = this;
        console.log("sendRegistrationQuestionnaireData called   ");
        return this.sqlitedatabase.listAllStatsNoCount().then(function (stats) {
            for (var i = 0; i < stats.length; i++) {
                _this.backandService.addRegistrationQuestionnaireData(JSON.stringify(stats[i])).subscribe(function (err) { return _this.logError(err); });
            }
        });
    };
    /**
     * This method sends diversity questionnaire data from the local database to the online Backand database using the Backand REST API.
     */
    AdminHomePage.prototype.sendDiversityQuestionnaireData = function () {
        var _this = this;
        console.log("sendDiversityQuestionnaireData called   ");
        return this.sqlitedatabase.listAllDiversityNoCount().then(function (stats) {
            for (var i = 0; i < stats.length; i++) {
                _this.backandService.addDiversityQuestionnaireData(JSON.stringify(stats[i])).subscribe(function (err) { return _this.logError(err); });
            }
        });
    };
    /**
     * This method populates the local SQLite database with data from the 'loginData' array.
     */
    AdminHomePage.prototype.populatLoginHistoryTable = function () {
        console.log("populate login history table called");
        for (var i = 0; i < this.loginData.length; i++) {
            var inputarray = [];
            inputarray.push(this.loginData[i].id);
            inputarray.push(this.loginData[i].user_id);
            inputarray.push(this.loginData[i].login_time);
            inputarray.push(this.loginData[i].logout_time);
            this.sqlitedatabase.addLoginDataToDB(inputarray);
        }
    };
    /**
      * This method populates the local SQLite database with data from the 'registrationQuestionnaireData' array.
      */
    AdminHomePage.prototype.populateRegistrationQuestionnaireTable = function () {
        console.log("populate registration questionnaire table called");
        for (var i = 0; i < this.registrationQuestionnaireData.length; i++) {
            var inputarray = [];
            inputarray.push(this.registrationQuestionnaireData[i].id);
            inputarray.push(this.registrationQuestionnaireData[i].user_id);
            inputarray.push(this.registrationQuestionnaireData[i].recorded_at);
            inputarray.push(this.registrationQuestionnaireData[i].question_id);
            inputarray.push(this.registrationQuestionnaireData[i].response);
            this.sqlitedatabase.addRegistrationQuestionnaireToDB(inputarray);
        }
    };
    /**
      * This method populates the local SQLite database with data from the 'diverisytQuestionnaireData' array.
      */
    AdminHomePage.prototype.populateDiversityQuestionnaireTable = function () {
        console.log("populate diversity questionnaire table called");
        for (var i = 0; i < this.diversityQuestionnaireData.length; i++) {
            var inputarray = [];
            inputarray.push(this.diversityQuestionnaireData[i].id);
            inputarray.push(this.diversityQuestionnaireData[i].recorded_at);
            inputarray.push(this.diversityQuestionnaireData[i].question_id);
            inputarray.push(this.diversityQuestionnaireData[i].response);
            this.sqlitedatabase.addDiversityQuestionnaireToDB(inputarray);
        }
    };
    /**
     * This method clears the 'registrations', 'loginData', 'registrationQeustionnaireData' and 'diversityQuestionnaireData' arrays.
     */
    AdminHomePage.prototype.clearArrays = function () {
        this.registrations.length = 0;
        this.loginData.length = 0;
        this.registrationQuestionnaireData.length = 0;
        this.diversityQuestionnaireData.length = 0;
    };
    /**
     * The below methods used are taken from the admin-visitor-history.ts file. They are used
     * to pre-populate the table before it is viewed by the user. This is done because there
     * is an update bug where new logins aren't displayed unless the visitor history page is
     * viewed twice.
     */
    /**
     * This method retrieves the login history from the SQLite database.
     */
    AdminHomePage.prototype.csvFromDatabase = function () {
        var _this = this;
        this.sqlitedatabase.listLoginDetailsForTable()
            .then(function (stats) {
            var arrayConverted = [];
            for (var q = 0; q < stats.length; q++) {
                var logoutTimeString = (stats[q].logout_time).toString();
                var loginTimeString = (stats[q].login_time).toString();
                var currentDateInfoArray = logoutTimeString.split(" ");
                var currentYear = currentDateInfoArray[3];
                var year = 1970;
                if (currentYear.toString() == year.toString()) {
                    var stillActiveString = 'Volunteer still active';
                    arrayConverted.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: stillActiveString
                    });
                }
                else {
                    arrayConverted.push({
                        first_name: stats[q].first_name,
                        last_name: stats[q].last_name,
                        email_address: stats[q].email_address,
                        login_time: loginTimeString,
                        logout_time: logoutTimeString
                    });
                }
            }
            _this.ConvertToCSV(arrayConverted);
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * This method converts the login history data to csv format.
     */
    AdminHomePage.prototype.ConvertToCSV = function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";
        for (var index in objArray[0]) {
            //Now convert each value to string and comma-separated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';
        for (var i = array.length - 1; i >= 0; i--) {
            var line = '';
            for (var index in array[i]) {
                if (line != '')
                    line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        this.saveFile(str);
    };
    /**
     * This method saves the csv data to a file in a local directory.
     */
    AdminHomePage.prototype.saveFile = function (body) {
        var _this = this;
        var fileName = "dummyData.csv";
        this.File.writeFile(this.File.dataDirectory, fileName, body)
            .then(function (_) {
            console.log('Success ;-)' + _this.File.dataDirectory);
        })
            .catch(function (err) {
            _this.File.writeExistingFile(_this.File.dataDirectory, fileName, body)
                .then(function (_) {
                console.log('Success ;-)2' + _this.File.dataDirectory);
            })
                .catch(function (err) {
                console.log(err + 'Failure' + _this.File.dataDirectory);
            });
        });
        this.readCsvData();
    };
    /**
     * This method extracts the csv data from the written file so that it can be parsed to a table.
     */
    AdminHomePage.prototype.readCsvData = function () {
        var _this = this;
        this.http.get(this.File.dataDirectory + 'dummyData.csv')
            .subscribe(function (data) { return _this.extractData(data); }, function (err) { return _this.handleError(err); });
    };
    AdminHomePage.prototype.handleError = function (err) {
        console.log('something went wrong: ', err);
    };
    /**
     * This method sets up a dynamic table in the HTML file and parses the login data to it.
     */
    AdminHomePage.prototype.extractData = function (res) {
        var csvData = res['_body'] || '';
        var parsedData = __WEBPACK_IMPORTED_MODULE_12_papaparse__["parse"](csvData).data;
        this.headerRow = ["First Name", "Last Name", "Email Address", "Login Time"];
        parsedData.splice(0, 1);
        this.csvData = parsedData;
    };
    /**
     * This method is activated by entering the current page, therefore needs to be two scenarios for execution:
     * 1) The auto-logout is executed on the same day as the volunteer's login but after the time
     * that the farm shuts.
     * 2) The auto-logout is executed after the day on which the volunteer logged in.
     */
    AdminHomePage.prototype.autoLogoutUser = function () {
        var _this = this;
        this.sqlitedatabase.listDetailsForAutoLogout()
            .then(function (stats) {
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
                }
                else {
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
                    _this.sqlitedatabase.autoLogout(stats[j].user_id, dateToSetMS)
                        .then(function () {
                    }, function (err) {
                        console.log('Error1: ', err);
                    });
                }
                else {
                    console.log("Already logged out");
                }
            }
        }, function (err) {
            console.log("something went wrong on auto-logging out users");
        });
    };
    AdminHomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-admin-home',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\admin-home\admin-home.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring">\n    <a id="sync-button1" class="sync-button" href="#" on-click="sync()" float-left>\n        <ion-icon name="sync"></ion-icon>\n        <label> Sync </label>\n    </a>\n    <ion-grid>\n\n        <ion-row>\n\n            <h1 id="login-heading2">\n                <img src="assets/img/Admin_Logo.png" style="display:block;width:35%;height:auto;margin-left:auto;margin-right:auto;" />\n            </h1>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdmin()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col></ion-col>\n\n\n            <ion-col>\n\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n            <br>\n            <br>\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <!-- https://www.webpagefx.com/blog/web-design/semi-transparent-buttons/ -->\n                <a id="admin-homepage-button1" class="semi-transparent-button" href="#" on-click="goToAdminVisitorHistory()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> </label>\n                        <ion-icon name="clock"></ion-icon>\n                        <label> Visitor History</label>\n                    </div>\n\n                </a>\n\n                <br>\n                <br>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <a id="admin-homepage-button2" class="semi-transparent-button" href="#" on-click="goToAdminVisitorData()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <label> </label>\n                    <ion-icon name="stats"></ion-icon>\n                    <label> Registration Data</label>\n                </a>\n                <br>\n                <br>\n\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <a id="admin-homepage-button3" class="semi-transparent-button" href="#" on-click="goToAdminAppSettings()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <label> </label>\n                    <ion-icon name="settings"></ion-icon>\n                    <label> App Settings</label>\n\n                </a>\n\n                <br>\n                <br>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n                <a id="admin-homepage-button4" class="semi-transparent-button" href="#" on-click="goToHomepage()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <label></label>\n                    <ion-icon name="log-out"></ion-icon>\n                    <label>Logout of Admin </label>\n\n                </a>\n\n                <br>\n                <br>\n            </ion-col>\n\n        </ion-row>\n\n\n    </ion-grid>\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\admin-home\admin-home.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_7__providers_google_drive_google_drive__["a" /* GoogleDriveProvider */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__providers_google_drive_google_drive__["a" /* GoogleDriveProvider */], __WEBPACK_IMPORTED_MODULE_8__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_9__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */], __WEBPACK_IMPORTED_MODULE_10__providers_backand_backand__["a" /* BackandProvider */], __WEBPACK_IMPORTED_MODULE_11__providers_connection_check_connection_check__["a" /* ConnectionCheckProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_14__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_file__["a" /* File */]])
    ], AdminHomePage);
    return AdminHomePage;
}());

//# sourceMappingURL=admin-home.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Graph1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph2_graph2__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph4_graph4__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
 *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
 * helped setup the basics of each graph.
 */
var Graph1Page = (function () {
    function Graph1Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    Graph1Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    Graph1Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
      * Methods below take user to different forms of the same graph
      */
    Graph1Page.prototype.goToGraph2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph2_graph2__["a" /* Graph2Page */]);
    };
    Graph1Page.prototype.goToGraph4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph4_graph4__["a" /* Graph4Page */]);
    };
    /**
      * Methods calculates the number of unique visitors to the farm for every year,
      * contained within the login data. Charts are all dynamic to new data.
      */
    Graph1Page.prototype.getUniqueVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var uniqueVisitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var uniqueVisitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        for (b = 0; b < uniqueVisitsArray.length; b++) {
                            if (uniqueVisitsArray[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArray.push(stats[c].user_id);
                        }
                    }
                }
                uniqueVisitsPerYearArray.push(uniqueVisitsArray.length);
            }
            for (var d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
                else if (_this.maxValue < uniqueVisitsPerYearArray[d]) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
            }
            for (d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                console.log("The number of total unique visits for " + numberOfYears[d] + " is: " + uniqueVisitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: uniqueVisitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(uniqueVisitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
    * Methods takes the data defined and creates a chart
    */
    Graph1Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Unique Visits',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], Graph1Page.prototype, "lineChart", void 0);
    Graph1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph1\graph1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 1) Number of Unique Visits Per Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" on-click="goToGraph1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph1\graph1.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], Graph1Page);
    return Graph1Page;
}());

//# sourceMappingURL=graph1.js.map

/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Graph2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph1_graph1__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph4_graph4__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var Graph2Page = (function () {
    function Graph2Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle');
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    Graph2Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    Graph2Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    Graph2Page.prototype.goToGraph1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph1_graph1__["a" /* Graph1Page */]);
    };
    Graph2Page.prototype.goToGraph4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph4_graph4__["a" /* Graph4Page */]);
    };
    /**
    * Methods calculates the number of unique visitors to the farm for every year,
    * contained within the login data. Charts are all dynamic to new data.
    */
    Graph2Page.prototype.getUniqueVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var uniqueVisitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var uniqueVisitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        for (b = 0; b < uniqueVisitsArray.length; b++) {
                            if (uniqueVisitsArray[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArray.push(stats[c].user_id);
                        }
                    }
                }
                uniqueVisitsPerYearArray.push(uniqueVisitsArray.length);
            }
            for (var d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
                else if (_this.maxValue < uniqueVisitsPerYearArray[d]) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
            }
            for (d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                console.log("The number of total unique visits for " + numberOfYears[d] + " is: " + uniqueVisitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: uniqueVisitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(uniqueVisitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
    * Methods takes the data defined and creates a chart
    */
    Graph2Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Unique Visits Per Year',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 60,
                        right: 60,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], Graph2Page.prototype, "pieChart", void 0);
    Graph2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph2\graph2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 1) Number of Unique Visits Per Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraph1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" on-click="goToGraph2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n\n\n\n\n\n\n\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph2\graph2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], Graph2Page);
    return Graph2Page;
}());

//# sourceMappingURL=graph2.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Graph4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph2_graph2__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph1_graph1__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var Graph4Page = (function () {
    function Graph4Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
         * Chart methodology starts here
         */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    Graph4Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    Graph4Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    Graph4Page.prototype.goToGraph1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph1_graph1__["a" /* Graph1Page */]);
    };
    Graph4Page.prototype.goToGraph2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph2_graph2__["a" /* Graph2Page */]);
    };
    /**
      * Methods calculates the number of unique visitors to the farm for every year,
      * contained within the login data. Charts are all dynamic to new data.
      */
    Graph4Page.prototype.getUniqueVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var uniqueVisitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var uniqueVisitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        for (b = 0; b < uniqueVisitsArray.length; b++) {
                            if (uniqueVisitsArray[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArray.push(stats[c].user_id);
                        }
                    }
                }
                uniqueVisitsPerYearArray.push(uniqueVisitsArray.length);
            }
            for (var d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
                else if (_this.maxValue < uniqueVisitsPerYearArray[d]) {
                    _this.maxValue = uniqueVisitsPerYearArray[d];
                }
            }
            for (d = 0; d < uniqueVisitsPerYearArray.length; ++d) {
                console.log("The number of total unique visits for " + numberOfYears[d] + " is: " + uniqueVisitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: uniqueVisitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(uniqueVisitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
      * Methods takes the data defined and creates a chart
      */
    Graph4Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Unique Visits Per Year',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], Graph4Page.prototype, "barChart", void 0);
    Graph4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph4\graph4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 1) Number of Unique Visits Per Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraph1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" on-click="goToGraph4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph4\graph4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], Graph4Page);
    return Graph4Page;
}());

//# sourceMappingURL=graph4.js.map

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return sqlitedatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file sqlitedabase.ts is adapted from https://devdactic.com/ionic-sqlite-queries-database/

*/
////////////////////////////////////////////////////////////////////////////////////////////////
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DATABASE_FILENAME = 'data.db';
var sqlitedatabase = (function () {
    function sqlitedatabase(platform, sqlite) {
        var _this = this;
        this.platform = platform;
        this.sqlite = sqlite;
        // The database is a variable of type SQLiteObject,
        // not a table, the file that contains the table
        this.db = null; //storage the SQLiteObject return by create method
        this.answerCache = {};
        this.diversityCache = {};
        this.platform.ready().then(function () {
            //call openDB method
            _this.openDB().then(function () {
                //call createTable method 
                _this.createTables();
            });
        });
    }
    sqlitedatabase.prototype.openDB = function () {
        var _this = this;
        return this.sqlite.create({
            name: DATABASE_FILENAME,
            location: 'default'
        })
            .then(function (db) {
            //storage object to property
            _this.db = db;
        });
    };
    /**
     * This method crates the SQLite database and calles the creatTable() method that will creat the relevant tables in the database.
     */
    sqlitedatabase.prototype.createDatabaseFile = function () {
        var _this = this;
        console.log("creating database");
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then(function (db) {
            console.log('Database created!');
            _this.db = db; //assign
            _this.createTables(); //create new tables
        }).catch(function (e) { return console.log(e); });
    };
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
    sqlitedatabase.prototype.createTables = function () {
        var _this = this;
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
            .then(function () {
            console.log("Created table[sutton_user]");
        }).catch(function (e) { return console.log(e); });
        var sql2 = "CREATE TABLE IF NOT EXISTS login_history (\
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                        user_id INTEGER NOT NULL,\
                        login_ts BIGINT DEFAULT NULL,\
                        logout_ts BIGINT DEFAULT NULL \
                      )";
        this.db
            .executeSql(sql2, {})
            .then(function () {
            console.log("Created table[login_history]");
        }).catch(function (e) { return console.log(e); });
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
            .then(function () {
            console.log("Created table[question_table]");
            _this.insertQuestions();
        }).catch(function (e) { return console.log(e); });
        this.db
            .executeSql(sql_question_response_table, {})
            .then(function () {
            console.log("Created table[question_response_table]");
        }).catch(function (e) { return console.log(e); });
        this.db
            .executeSql(sql_diversity_table, {})
            .then(function () {
            console.log("Created table[diversity_table]");
            _this.insertDiversityQuestions();
        }).catch(function (e) { return console.log(e); });
        this.db
            .executeSql(sql_diversity_response_table, {})
            .then(function () {
            console.log("Created table[diversity_response_table]");
        }).catch(function (e) { return console.log(e); });
        var last_sync_table = "CREATE TABLE IF NOT EXISTS last_sync_table (\
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                last_sync BIGINT NOT NULL)";
        this.db
            .executeSql(last_sync_table, {})
            .then(function () {
            console.log("Created table[last_sync_table]");
            var new_sql = 'SELECT max(id) as count from last_sync_table';
            _this.db.executeSql(new_sql, []).then(function (data) {
                console.log("querry output:  " + data.rows.item(0).count);
                if (parseInt(data.rows.item(0).count) > 0) {
                    console.log("last_sync_table NOT empty");
                }
                else {
                    _this.setLastSync("1");
                    console.log("last_sync_table empty, adding first value");
                }
            });
        }).catch(function (e) { return console.log(e); });
        var last_sync_table2 = "CREATE TABLE IF NOT EXISTS last_sync_table2 (\
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                last_sync BIGINT NOT NULL)";
        this.db
            .executeSql(last_sync_table2, {})
            .then(function () {
            console.log("Created table[last_sync_table2]");
            var new_sql = 'SELECT max(id) as count from last_sync_table2';
            _this.db.executeSql(new_sql, []).then(function (data) {
                console.log("querry output:  " + data.rows.item(0).count);
                if (parseInt(data.rows.item(0).count) > 0) {
                    console.log("last_sync_table2 NOT empty");
                }
                else {
                    _this.setLastSync2("1");
                    console.log("last_sync_table2 empty, adding first value");
                }
            });
        }).catch(function (e) { return console.log(e); });
    };
    /**
     * This method adds new data to the sutton_user table from an array.
     * @param data
     */
    sqlitedatabase.prototype.registerUser = function (data) {
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
    };
    /**
     * Suggestion for listing the user name based on last name
     * @param query
     */
    sqlitedatabase.prototype.suggestLastName = function (query) {
        return this.db.executeSql("select * from sutton_user where last_name like '%" + query + "%' limit 5", []);
    };
    /**
     * This method returns when the user last logged in.
     * @param user_id
     */
    sqlitedatabase.prototype.last_login = function (user_id) {
        var sql = "select * from login_history where user_id=? order by id desc limit 1";
        var parameters = [user_id];
        return this.db.executeSql(sql, parameters);
    };
    /**
     * This method adds a login entry to the login_history table in the SQLite database.
     * @param user_id
     */
    sqlitedatabase.prototype.login = function (user_id) {
        var sql = "insert into login_history(\
                        user_id, login_ts \
                    ) values (?,?)";
        var parameters = [user_id, Date.now()];
        return this.db.executeSql(sql, parameters);
    };
    /**
     * Update logout time to database
     */
    sqlitedatabase.prototype.logout = function (user_id) {
        console.log("logout user:" + user_id);
        var sql = "UPDATE login_history \
                        SET logout_ts=? \
                    WHERE user_id=?";
        var parameters = [Date.now(), user_id];
        return this.db.executeSql(sql, parameters);
    };
    /**
     * This method populates the 'diversity' table with all the questions of the diversity questionnaire.
     */
    sqlitedatabase.prototype.insertDiversityQuestions = function () {
        var question1 = "Age category";
        var question2 = "Sex";
        var question3 = "Sexual orientation. Are you...";
        var question4 = "Ethnicity. Are you...";
        var question5 = "Disability: are your day-to-day activities limited because of\
                a health problem or disability which has lasted,\
                or is expected to last, at least 12 months?";
        var question6 = "Caring responsibilities: do you regularly provide unpaid\
             support caring for someone? [A carer is someone who spends a\
                significant proportion of their time providing unpaid support\
                to a family member, partner or friend who is ill, frail,\
                disabled or has mental health or substance misuse problems]";
        var question7 = "Religion or belief: are you or do you have...";
        var question8 = "Current employment status";
        var question9 = "Which London borough do you live in?";
        var sql = "INSERT INTO diversity ( id, question_text, position, enabled ) \
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
    };
    // login history
    sqlitedatabase.prototype.loginHistory = function () {
        var sql = "SELECT sutton_user.id as id, first_name, last_name, email_address, login_ts\
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id limit 20";
        return this.db.executeSql(sql, []);
    };
    // total attendance
    sqlitedatabase.prototype.totalAttendance = function () {
        var sql = "SELECT age_group, count(login_history.user_id) as count \
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id group by age_group";
        return this.db.executeSql(sql, []);
    };
    // Total Number of visiters per year
    sqlitedatabase.prototype.totalVisitorsYear = function () {
        var sql = "SELECT age_group, count(login_history.user_id) as count \
                       FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id";
        return this.db.executeSql(sql, []);
    };
    // total registered
    sqlitedatabase.prototype.totalRegistered = function () {
        var sql = "SELECT age_group, count(*) as count \
                       FROM sutton_user";
        return this.db.executeSql(sql, []);
    };
    // Admin login credentials
    sqlitedatabase.prototype.adminCredentials = function (username) {
        var sql = "select * from admin where username=?";
        return this.db.executeSql(sql, [username]);
    };
    /**
 * This method populates the 'question' table with all the questions of the registration questionnaire.
 */
    sqlitedatabase.prototype.insertQuestions = function () {
        var question1 = "Please tick the volunteering activities you are interested in.*\
        Tick all that apply.";
        var question2 = "Please tell us why you would like to volunteer at Sutton Community Farm.*\
         Tick all that apply.";
        var question3 = "Please tick the statements applicable to you.* This helps us \
        understand how much support you might require with activities.";
        var question4 = "Please add any further information about the support you\
          require. Include whether you are coming with a support\
          worker.";
        var question5 = "Do you have any medical conditions, allergies, disabilities\
          or existing injuries that may affect participation? Our staff\
          will discuss this with you in a sensitive and\
          confidential manner.*";
        var question6 = "Do you have a particular interest in supporting other\
          volunteers at the farm as a Buddy Volunteer?\
          This would require additional training";
        var question7 = "To help keep in touch with the farm community, would you like\
          to be added to our Google Group? You can leave anytime.";
        var question8 = "Where did you hear about Sutton Community Farm?*";
        var question9 = "Please tick which days you are able to volunteer.*";
        var sql = "INSERT INTO question ( id, question_text, position, enabled ) \
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
    };
    /**
     * This method querries the question table for a certain row based  on the input position.
     * @param position
     */
    sqlitedatabase.prototype.getQuestion = function (position) {
        var sql = "select * from question where position = ? order by id desc limit 1";
        var params = [position];
        return this.db.executeSql(sql, params);
    };
    /**
     * This method querries the last_sync table for the last time stamp.
     */
    sqlitedatabase.prototype.getLastSync = function () {
        var sql = "SELECT * FROM last_sync_table ORDER BY id DESC LIMIT 1";
        return this.db.executeSql(sql, []);
    };
    /**
        * This method querries the last_sync2 table for the last time stamp.
        */
    sqlitedatabase.prototype.getLastSync2 = function () {
        var sql = "SELECT * FROM last_sync_table2 ORDER BY id DESC LIMIT 1";
        return this.db.executeSql(sql, []);
    };
    /**
    * This method adds a new data row to the last_sync table.
    */
    sqlitedatabase.prototype.setLastSync = function (lastSync) {
        console.log("last sync set");
        var sql = "insert into last_sync_table(last_sync) values (?);";
        return this.db.executeSql(sql, [lastSync]);
    };
    /**
    * This method adds a new data row to the last_sync2 table.
    */
    sqlitedatabase.prototype.setLastSync2 = function (lastSync) {
        console.log("last sync2 set");
        var sql = "insert into last_sync_table2(last_sync) values (?);";
        return this.db.executeSql(sql, [lastSync]);
    };
    /**
         * This method querries the diversity table for a certain row based  on the input position.
         * @param position
         */
    sqlitedatabase.prototype.getDiversityQuestion = function (position) {
        var sql = "select * from diversity where position = ? order by id desc limit 1";
        var params = [position];
        return this.db.executeSql(sql, params);
    };
    /**
     * This method inserts all the data stored inside the registration questionnaire cache object for a specific user_id.
     * @param user_id
     */
    sqlitedatabase.prototype.insertCachedAnswers = function (user_id) {
        console.log("Inserting cached answers for user:" + user_id);
        var insert_sql = "INSERT INTO question_response (\
    						user_id, question_id, option_text )\
							VALUES (?, ?, ?)";
        var _loop_1 = function (question_key) {
            console.log("question_key:" + question_key);
            var answers = this_1.answerCache[question_key];
            console.log(answers);
            var _loop_2 = function (index) {
                var answer = answers[index];
                console.log("answer:" + answer);
                var params = [user_id, question_key, answer];
                this_1.db.executeSql(insert_sql, params).then(function () {
                    console.log("inserted question response:" + question_key + ":" + answer);
                });
            };
            for (var index in answers) {
                _loop_2(index);
            }
        };
        var this_1 = this;
        for (var question_key in this.answerCache) {
            _loop_1(question_key);
        }
    };
    /**
        * This method inserts all the data stored inside the diversity questionnaire cache object.
        * @param user_id
        */
    sqlitedatabase.prototype.insertDiversityCache = function () {
        console.log("Inserting cached diversity answers");
        var insert_sql = "INSERT INTO diversity_response (\
                              question_id, option_text )\
                              VALUES (?, ?)";
        var _loop_3 = function (question_key) {
            console.log("question_key:" + question_key);
            var answers = this_2.diversityCache[question_key];
            console.log(answers);
            var _loop_4 = function (index) {
                var answer = answers[index];
                console.log("answer:" + answer);
                var params = [question_key, answer];
                this_2.db.executeSql(insert_sql, params).then(function () {
                    console.log("inserted question response:" + question_key + ":" + answer);
                });
            };
            for (var index in answers) {
                _loop_4(index);
            }
        };
        var this_2 = this;
        for (var question_key in this.diversityCache) {
            _loop_3(question_key);
        }
    };
    /**
     * This method is used to in testing. It querries all the elements in the question_reponse table and counts the number of identical entries.
     */
    sqlitedatabase.prototype.listAllStats = function () {
        var sql = "select user_id, recorded_at, question_id, option_text, count(*) as count  \
                from question_response \
                group by question_id, option_text";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method is used to in producing a csv of the questionnaire data.
     */
    sqlitedatabase.prototype.listAllStats2 = function () {
        var sql = "select user_id, recorded_at, question_id, option_text, count(*) as count  \
                  from question_response \
                  group by question_id, option_text";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method adds a key:value pair to the asnwerCache object.
     * @param question_id
     * @param answerList
     */
    sqlitedatabase.prototype.addToAnswerCache = function (question_id, answerList) {
        this.answerCache[question_id] = answerList;
    };
    /**
     * This method deletes a specific key:value pair from the answerCache object.
     * @param question_id
     */
    sqlitedatabase.prototype.clearAnswerCache = function (question_id) {
        delete this.answerCache[question_id];
    };
    /**
     * This method is used in testing. It outputs the contents of the answerCache object to the console.
     */
    sqlitedatabase.prototype.logAnswerCache = function () {
        console.log(JSON.stringify(this.answerCache));
    };
    /**
     * This method adds a key:value pair to the diveristyCache object.
     * @param question_id
     * @param answerList
     */
    sqlitedatabase.prototype.addToDiversityCache = function (question_id, answerList) {
        this.diversityCache[question_id] = answerList;
    };
    /**
    * This method deletes a specific key:value pair from the diversityCache object.
    * @param question_id
    */
    sqlitedatabase.prototype.clearDiversityCache = function (question_id) {
        delete this.diversityCache[question_id];
    };
    /**
    * This method is used in testing. It outputs the contents of the diversityCache object to the console.
    */
    sqlitedatabase.prototype.logDiversityCache = function () {
        console.log(JSON.stringify(this.diversityCache));
    };
    /**
     * This method is used in  testing. It querries all the elements from the diveristy_response table and groups them by identical entries.
     */
    sqlitedatabase.prototype.listAllDiversity = function () {
        var sql = "select recorded_at, question_id, option_text, count(*) as count  \
        from diversity_response \
        group by question_id, option_text";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method is used in producing a csv of all diversity questionnaire data responses.
     */
    sqlitedatabase.prototype.listAllDiversity2 = function () {
        var sql = "select recorded_at, question_id, option_text, count(*) as count  \
        from diversity_response \
        group by question_id, option_text";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * Method provides the grpahs with the entire catalogue of login data,
     * so that graphs can be made dating as far back as records go.
     */
    sqlitedatabase.prototype.listLoginDetailsForGraphs = function () {
        var sql = "select user_id, login_ts\
        from login_history\
        ";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * Method provides the table with the entire catalogue of login data.
     * Data is to be visualised tabularly and an option is also provided
     * to download the data onto the device.
     */
    sqlitedatabase.prototype.listLoginDetailsForTable = function () {
        var sql = "SELECT sutton_user.id as id, first_name, last_name, email_address, login_ts, logout_ts\
        FROM sutton_user INNER JOIN login_history ON sutton_user.id=login_history.user_id\
        ";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * Method to provide function with login and logout data to determine whether a
     * volunteer has forgotten to logout and, thus, needs to be logged out
     * automatically
     */
    sqlitedatabase.prototype.listDetailsForAutoLogout = function () {
        var sql = "select user_id, login_ts, logout_ts\
        from login_history\
        ";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * Update logout time to database if the user forgets to logout and the day ends
     */
    sqlitedatabase.prototype.autoLogout = function (user_id, dateToSetMS) {
        console.log("Auto logout user: " + user_id + " at time: " + dateToSetMS);
        var sql = "UPDATE login_history \
                        SET logout_ts=? \
                    WHERE user_id=?";
        var parameters = [dateToSetMS, user_id];
        console.log(parameters);
        return this.db.executeSql(sql, parameters);
    };
    /**
     * This method is used for testing. It querries all data entries from the login_history table.
     */
    sqlitedatabase.prototype.listAllLog = function () {
        var sql = "select user_id, login_ts, logout_ts\
        from login_history\
        group by user_id";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method is used for testing. It querries all data entries from the sutton_user table.
     */
    sqlitedatabase.prototype.listAllRegistration = function () {
        var sql = "select * from sutton_user";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method clears the sutton_user table including the auto-incrementing field.
     */
    sqlitedatabase.prototype.clearRegistrationDb = function () {
        var _this = this;
        console.log("clearRegistrationDB function called");
        var sql = "delete from sutton_user";
        var sql2 = "delete from sqlite_sequence where name='sutton_user'";
        return this.db.executeSql(sql, {})
            .then(function () {
            console.log("sutton_user  table reset to zero");
            return _this.db.executeSql(sql2, {})
                .then(function () {
                console.log("sutton_user autoincrement reset to zero");
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
     * This method adds data from an array to the sutton_user table.
     * @param data
     */
    sqlitedatabase.prototype.registerUserFromDB = function (data) {
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
        return this.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
     * This method querries all the rows from the question_response table. It is used in the admin-home.ts file and for testing purposes.
     */
    sqlitedatabase.prototype.listAllStatsNoCount = function () {
        var sql = "select id, user_id, recorded_at, question_id, option_text  \
                  from question_response\
                  order by user_id, question_id";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
    * This method clears the question_response table including the auto-incrementing field.
    */
    sqlitedatabase.prototype.clearRegistrationQuestionnaireDB = function () {
        var _this = this;
        console.log("clearRegistrationQuestionnaireDB function called");
        var sql = "delete from question_response";
        var sql2 = "delete from sqlite_sequence where name='question_response'";
        return this.db.executeSql(sql, {})
            .then(function () {
            console.log("question_response  table reset to zero");
            return _this.db.executeSql(sql2, {})
                .then(function () {
                console.log("question_response autoincrement reset to zero");
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
    * This method clears the login_history table including the auto-incrementing field.
    */
    sqlitedatabase.prototype.clearLoginHistoryDB = function () {
        var _this = this;
        console.log("clearLoginHistoryDB function called");
        var sql = "delete from login_history";
        var sql2 = "delete from sqlite_sequence where name='login_history'";
        return this.db.executeSql(sql, {})
            .then(function () {
            console.log("login_history  table reset to zero");
            return _this.db.executeSql(sql2, {})
                .then(function () {
                console.log("login_history autoincrement reset to zero");
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
    * This method clears the diversity_response table including the auto-incrementing field.
    */
    sqlitedatabase.prototype.clearDiversityQuestionnaireDB = function () {
        var _this = this;
        console.log("clearDiversityQuestionnaireDB function called");
        var sql = "delete from diversity_response";
        var sql2 = "delete from sqlite_sequence where name='diversity_response'";
        return this.db.executeSql(sql, {})
            .then(function () {
            console.log("diversity_response  table reset to zero");
            return _this.db.executeSql(sql2, {})
                .then(function () {
                console.log("diversity_response autoincrement reset to zero");
            }).catch(function (e) { return console.log(e); });
        }).catch(function (e) { return console.log(e); });
    };
    /**
  * This method querries all the rows from the diversity_response table. It is used in the admin-home.ts file and for testing purposes.
  */
    sqlitedatabase.prototype.listAllDiversityNoCount = function () {
        var sql = "select id, recorded_at, question_id, option_text\
        from diversity_response\
        order by recorded_at, question_id";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * Thie method querries all the data entries from the last_sync table. It is used for testing purposes.
     */
    sqlitedatabase.prototype.listLastSync = function () {
        var sql = "select * from last_sync_table";
        var stats = [];
        return this.db.executeSql(sql, [])
            .then(function (data) {
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
        }, function (err) {
            console.log('Error: ', err);
            return [];
        });
    };
    /**
     * This method adds data from an array to the login_history table.
     * @param data
     */
    sqlitedatabase.prototype.addLoginDataToDB = function (data) {
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
        return this.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
       * This method adds data from an array to the question_response table.
       * @param data
       */
    sqlitedatabase.prototype.addRegistrationQuestionnaireToDB = function (data) {
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
        return this.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
       * This method adds data from an array to the diversity_response table.
       * @param data
       */
    sqlitedatabase.prototype.addDiversityQuestionnaireToDB = function (data) {
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
        return this.db.executeSql(sql, values).catch(function (e) { return console.log(e); });
    };
    /**
     * This method resets the answerCache object.
     */
    sqlitedatabase.prototype.resetAnswerCache = function () {
        this.answerCache = {};
    };
    /**
     * This method resets the diversityCache object.
     */
    sqlitedatabase.prototype.resetDiversityCache = function () {
        this.diversityCache = {};
    };
    sqlitedatabase = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__["a" /* SQLite */]])
    ], sqlitedatabase);
    return sqlitedatabase;
}());

//# sourceMappingURL=sqlitedatabase.js.map

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Graph3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_scatter1_graph_scatter1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_bar1_graph_bar1__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var Graph3Page = (function () {
    function Graph3Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    Graph3Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    Graph3Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    Graph3Page.prototype.goToGraphScatter1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_scatter1_graph_scatter1__["a" /* GraphScatter1Page */]);
    };
    Graph3Page.prototype.goToGraphBar1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_bar1_graph_bar1__["a" /* GraphBar1Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for every year,
      * contained within the login data. Charts are all dynamic to new data.
      */
    Graph3Page.prototype.getTotalVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var visitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var visitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        visitsArray.push(currentUserID);
                    }
                }
                visitsPerYearArray.push(visitsArray.length);
            }
            for (var d = 0; d < visitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsPerYearArray[d];
                }
                else if (_this.maxValue < visitsPerYearArray[d]) {
                    _this.maxValue = visitsPerYearArray[d];
                }
            }
            for (d = 0; d < visitsPerYearArray.length; ++d) {
                console.log("The total number of visits for " + numberOfYears[d] + " is: " + +visitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: visitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(visitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
      * Methods takes the data defined and creates a chart
      */
    Graph3Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Visits Per Year',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 50,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], Graph3Page.prototype, "pieChart", void 0);
    Graph3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph3\graph3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 2) Total Number of Visits for Each Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph3\graph3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], Graph3Page);
    return Graph3Page;
}());

//# sourceMappingURL=graph3.js.map

/***/ }),

/***/ 71:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphScatter1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph3_graph3__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_bar1_graph_bar1__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphScatter1Page = (function () {
    function GraphScatter1Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    GraphScatter1Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
      * This method takes user back to list of all graphs
      */
    GraphScatter1Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphScatter1Page.prototype.goToGraphBar1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_bar1_graph_bar1__["a" /* GraphBar1Page */]);
    };
    GraphScatter1Page.prototype.goToGraph3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph3_graph3__["a" /* Graph3Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for every year,
      * contained within the login data. Charts are all dynamic to new data.
      */
    GraphScatter1Page.prototype.getTotalVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var visitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var visitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        visitsArray.push(currentUserID);
                    }
                }
                visitsPerYearArray.push(visitsArray.length);
            }
            for (var d = 0; d < visitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsPerYearArray[d];
                }
                else if (_this.maxValue < visitsPerYearArray[d]) {
                    _this.maxValue = visitsPerYearArray[d];
                }
            }
            for (d = 0; d < visitsPerYearArray.length; ++d) {
                console.log("The total number of visits for " + numberOfYears[d] + " is: " + +visitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: visitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(visitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
      * Methods takes the data defined and creates a chart
      */
    GraphScatter1Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Visits Per Year',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphScatter1Page.prototype, "lineChart", void 0);
    GraphScatter1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-scatter1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter1\graph-scatter1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 2) Total Number of Visits for Each Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter1\graph-scatter1.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphScatter1Page);
    return GraphScatter1Page;
}());

//# sourceMappingURL=graph-scatter1.js.map

/***/ }),

/***/ 72:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphBar1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph3_graph3__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter1_graph_scatter1__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphBar1Page = (function () {
    function GraphBar1Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalVisitsPerYear();
    }
    /**
     * This method opens the homepage.
     */
    GraphBar1Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphBar1Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphBar1Page.prototype.goToGraphScatter1 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter1_graph_scatter1__["a" /* GraphScatter1Page */]);
    };
    GraphBar1Page.prototype.goToGraph3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph3_graph3__["a" /* Graph3Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for every year,
      * contained within the login data. Charts are all dynamic to new data.
      */
    GraphBar1Page.prototype.getTotalVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of visits per year");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var numberOfYears = []; //this is the array to contain the unique user ID's
            var visitsPerYearArray = [];
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                var currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                for (var b = 0; b < numberOfYears.length; b++) {
                    if (numberOfYears[b] === currentYear) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    numberOfYears.push(currentYear); //Adds the year if it isn't already contained
                }
            }
            //Step 2
            for (var a = 0; a < numberOfYears.length; ++a) {
                var currentYearFromArray = numberOfYears[a];
                var visitsArray = [];
                for (var c = 0; c < stats.length; ++c) {
                    currentDateHandled = new Date(stats[c].login_time);
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    booleanCheck = 0;
                    if (currentYear === currentYearFromArray) {
                        var currentUserID = stats[c].user_id;
                        visitsArray.push(currentUserID);
                    }
                }
                visitsPerYearArray.push(visitsArray.length);
            }
            for (var d = 0; d < visitsPerYearArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsPerYearArray[d];
                }
                else if (_this.maxValue < visitsPerYearArray[d]) {
                    _this.maxValue = visitsPerYearArray[d];
                }
            }
            for (d = 0; d < visitsPerYearArray.length; ++d) {
                console.log("The total number of visits for " + numberOfYears[d] + " is: " + +visitsPerYearArray[d]);
                var answers = {
                    answer: numberOfYears[d],
                    value: visitsPerYearArray[d],
                    color: _this.chart_colors[d],
                    hover: _this.hover_colors[d]
                };
                _this.chartLabels.push(numberOfYears[d]);
                _this.chartValues.push(visitsPerYearArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
                _this.answers.push(answers);
                console.log(_this.answers);
            }
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
    * Methods takes the data defined and creates a chart
    */
    GraphBar1Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Visits Per Year',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], GraphBar1Page.prototype, "pieChart", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], GraphBar1Page.prototype, "barChart", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphBar1Page.prototype, "lineChart", void 0);
    GraphBar1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-bar1',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-bar1\graph-bar1.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 2) Total Number of Visits for Each Year </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter1()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraph3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-bar1\graph-bar1.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphBar1Page);
    return GraphBar1Page;
}());

//# sourceMappingURL=graph-bar1.js.map

/***/ }),

/***/ 73:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphScatter2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie2_graph_pie2__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_bar2_graph_bar2__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphScatter2Page = (function () {
    function GraphScatter2Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalUniqueVisits();
    }
    /**
     * This method opens the homepage.
     */
    GraphScatter2Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphScatter2Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphScatter2Page.prototype.goToGraphPie2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie2_graph_pie2__["a" /* GraphPie2Page */]);
    };
    GraphScatter2Page.prototype.goToGraphBar2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_bar2_graph_bar2__["a" /* GraphBar2Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm,
      * contained within the login data. Charts are all dynamic to new data.
      */
    GraphScatter2Page.prototype.getTotalUniqueVisits = function () {
        var _this = this;
        console.log("Getting total number of unique visits");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var uniqueVisits = []; //this is the array to contain the unique user ID's
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                for (var b = 0; b < uniqueVisits.length; b++) {
                    if (uniqueVisits[b] === stats[j].user_id) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    uniqueVisits.push(stats[j].user_id);
                }
            }
            console.log(uniqueVisits.length);
            _this.maxValue = uniqueVisits.length;
            _this.chartLabels.push('Total Number of Unique Visits');
            _this.chartValues.push(uniqueVisits.length);
            _this.chartColours.push(_this.chart_colors[0]);
            _this.chartHoverColours.push(_this.hover_colors[0]);
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
   * Methods takes the data defined and creates a chart
   */
    GraphScatter2Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Unique Visits',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphScatter2Page.prototype, "lineChart", void 0);
    GraphScatter2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-scatter2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter2\graph-scatter2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 3) Number of Visits Per Annum </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie2()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar2()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter2\graph-scatter2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphScatter2Page);
    return GraphScatter2Page;
}());

//# sourceMappingURL=graph-scatter2.js.map

/***/ }),

/***/ 74:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphPie2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_bar2_graph_bar2__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter2_graph_scatter2__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphPie2Page = (function () {
    function GraphPie2Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalUniqueVisits();
    }
    /**
     * This method opens the homepage.
     */
    GraphPie2Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphPie2Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphPie2Page.prototype.goToGraphScatter2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter2_graph_scatter2__["a" /* GraphScatter2Page */]);
    };
    GraphPie2Page.prototype.goToGraphBar2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_bar2_graph_bar2__["a" /* GraphBar2Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm,
      * contained within the login data. Charts are all dynamic to new data.
      */
    GraphPie2Page.prototype.getTotalUniqueVisits = function () {
        var _this = this;
        console.log("Getting total number of unique visits");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var uniqueVisits = []; //this is the array to contain the unique user ID's
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                for (var b = 0; b < uniqueVisits.length; b++) {
                    if (uniqueVisits[b] === stats[j].user_id) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    uniqueVisits.push(stats[j].user_id);
                }
            }
            console.log(uniqueVisits.length);
            _this.chartLabels.push('Total Number of Unique Visits');
            _this.chartValues.push(uniqueVisits.length);
            _this.chartColours.push(_this.chart_colors[0]);
            _this.chartHoverColours.push(_this.hover_colors[0]);
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphPie2Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Unique Visits',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 60,
                        right: 60,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], GraphPie2Page.prototype, "pieChart", void 0);
    GraphPie2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-pie2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-pie2\graph-pie2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 3) Total Number of Unique Visits </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter2()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar2()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n\n\n\n\n\n\n\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-pie2\graph-pie2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphPie2Page);
    return GraphPie2Page;
}());

//# sourceMappingURL=graph-pie2.js.map

/***/ }),

/***/ 75:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphBar2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie2_graph_pie2__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter2_graph_scatter2__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphBar2Page = (function () {
    function GraphBar2Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getTotalUniqueVisits();
    }
    /**
     * This method opens the homepage.
     */
    GraphBar2Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphBar2Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphBar2Page.prototype.goToGraphScatter2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter2_graph_scatter2__["a" /* GraphScatter2Page */]);
    };
    GraphBar2Page.prototype.goToGraphPie2 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie2_graph_pie2__["a" /* GraphPie2Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm,
      * contained within the login data. Charts are all dynamic to new data.
      */
    GraphBar2Page.prototype.getTotalUniqueVisits = function () {
        var _this = this;
        console.log("Getting total number of unique visits");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            var uniqueVisits = []; //this is the array to contain the unique user ID's
            console.log("Number of visits (total): " + stats.length);
            for (var j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                for (var b = 0; b < uniqueVisits.length; b++) {
                    if (uniqueVisits[b] === stats[j].user_id) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    uniqueVisits.push(stats[j].user_id);
                }
            }
            console.log(uniqueVisits.length);
            _this.maxValue = uniqueVisits.length;
            _this.chartLabels.push('Total Number of Unique Visits');
            _this.chartValues.push(uniqueVisits.length);
            _this.chartColours.push(_this.chart_colors[0]);
            _this.chartHoverColours.push(_this.hover_colors[0]);
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
  * Methods takes the data defined and creates a chart
  */
    GraphBar2Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Unique Visits',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], GraphBar2Page.prototype, "barChart", void 0);
    GraphBar2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-bar2',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-bar2\graph-bar2.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 3) Total Number of Unique Visits </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter2()">\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie2()">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#">\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-bar2\graph-bar2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphBar2Page);
    return GraphBar2Page;
}());

//# sourceMappingURL=graph-bar2.js.map

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphScatter3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie3_graph_pie3__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_bar3_graph_bar3__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphScatter3Page = (function () {
    function GraphScatter3Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * Chart methodology starts here
          */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerMonth();
    }
    /**
       * This method opens the homepage.
       */
    GraphScatter3Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
       * This method takes user back to list of all graphs
       */
    GraphScatter3Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
      * Methods below take user to different forms of the same graph
      */
    GraphScatter3Page.prototype.goToGraphPie3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie3_graph_pie3__["a" /* GraphPie3Page */]);
    };
    GraphScatter3Page.prototype.goToGraphBar3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_bar3_graph_bar3__["a" /* GraphBar3Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm for each of the last 12 months.
      * Charts are all dynamic to new data.
      */
    GraphScatter3Page.prototype.getUniqueVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var uniqueVisitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var uniqueVisitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster); //This gives the string of the correct date for the given number
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        for (var b = 0; b < uniqueVisitsArrayPerMonth.length; b++) {
                            if (uniqueVisitsArrayPerMonth[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                        }
                    }
                }
                //This is where we push the chart data
                console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                uniqueVisitsMonthsArray.push(uniqueVisitsArrayPerMonth.length);
            }
            for (var d = 0; d < uniqueVisitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
                else if (_this.maxValue < uniqueVisitsMonthsArray[d]) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
            }
            for (d = uniqueVisitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(uniqueVisitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
  * Methods takes the data defined and creates a chart
  */
    GraphScatter3Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Unique Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphScatter3Page.prototype, "lineChart", void 0);
    GraphScatter3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-scatter3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter3\graph-scatter3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 4) Number of Unique Visitors Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter3\graph-scatter3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphScatter3Page);
    return GraphScatter3Page;
}());

//# sourceMappingURL=graph-scatter3.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphPie3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_bar3_graph_bar3__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter3_graph_scatter3__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphPie3Page = (function () {
    function GraphPie3Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * Chart methodology starts here
          */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(0, 102, 0, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(0, 102, 0, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerMonth();
    }
    /**
     * This method opens the homepage.
     */
    GraphPie3Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphPie3Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphPie3Page.prototype.goToGraphScatter3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter3_graph_scatter3__["a" /* GraphScatter3Page */]);
    };
    GraphPie3Page.prototype.goToGraphBar3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_bar3_graph_bar3__["a" /* GraphBar3Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm for each of the last 12 months.
      * Charts are all dynamic to new data.
      */
    GraphPie3Page.prototype.getUniqueVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var uniqueVisitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var uniqueVisitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster); //This gives the string of the correct date for the given number
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        for (var b = 0; b < uniqueVisitsArrayPerMonth.length; b++) {
                            if (uniqueVisitsArrayPerMonth[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                        }
                    }
                }
                //This is where we push the chart data
                console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                uniqueVisitsMonthsArray.push(uniqueVisitsArrayPerMonth.length);
            }
            for (var d = 0; d < uniqueVisitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
                else if (_this.maxValue < uniqueVisitsMonthsArray[d]) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
            }
            for (d = uniqueVisitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(uniqueVisitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphPie3Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Unique Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 60,
                        right: 60,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], GraphPie3Page.prototype, "pieChart", void 0);
    GraphPie3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-pie3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-pie3\graph-pie3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 4) Number of Unique Visitors Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-pie3\graph-pie3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphPie3Page);
    return GraphPie3Page;
}());

//# sourceMappingURL=graph-pie3.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphBar3Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie3_graph_pie3__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter3_graph_scatter3__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphBar3Page = (function () {
    function GraphBar3Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * Chart methodology starts here
          */
        this.chart_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)'
        ];
        this.hover_colors = ['rgba(102, 204, 0, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getUniqueVisitsPerMonth();
    }
    /**
     * This method opens the homepage.
     */
    GraphBar3Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphBar3Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphBar3Page.prototype.goToGraphScatter3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter3_graph_scatter3__["a" /* GraphScatter3Page */]);
    };
    GraphBar3Page.prototype.goToGraphPie3 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie3_graph_pie3__["a" /* GraphPie3Page */]);
    };
    /**
      * Methods calculates the total number of unique visitors to the farm for each of the last 12 months.
      * Charts are all dynamic to new data.
      */
    GraphBar3Page.prototype.getUniqueVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var uniqueVisitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var uniqueVisitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster); //This gives the string of the correct date for the given number
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        for (var b = 0; b < uniqueVisitsArrayPerMonth.length; b++) {
                            if (uniqueVisitsArrayPerMonth[b] === currentUserID) {
                                booleanCheck = 1;
                                break;
                            }
                        }
                        if (booleanCheck === 0) {
                            uniqueVisitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                        }
                    }
                }
                //This is where we push the chart data
                console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                uniqueVisitsMonthsArray.push(uniqueVisitsArrayPerMonth.length);
            }
            for (var d = 0; d < uniqueVisitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
                else if (_this.maxValue < uniqueVisitsMonthsArray[d]) {
                    _this.maxValue = uniqueVisitsMonthsArray[d];
                }
            }
            for (d = uniqueVisitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(uniqueVisitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphBar3Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Unique Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], GraphBar3Page.prototype, "barChart", void 0);
    GraphBar3Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-bar3',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-bar3\graph-bar3.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 4) Number of Unique Visitors Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter3()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie3()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-bar3\graph-bar3.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphBar3Page);
    return GraphBar3Page;
}());

//# sourceMappingURL=graph-bar3.js.map

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphScatter4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie4_graph_pie4__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_bar4_graph_bar4__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphScatter4Page = (function () {
    function GraphScatter4Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * Chart methodology starts here
          */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
         * This is the logic that assigns the desired background, chosen in
         * admin-app-settings.ts, to the background of the current page.
         */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getVisitsPerMonth();
    }
    /**
       * This method opens the homepage.
       */
    GraphScatter4Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphScatter4Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
      * Methods below take user to different forms of the same graph
      */
    GraphScatter4Page.prototype.goToGraphPie4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie4_graph_pie4__["a" /* GraphPie4Page */]);
    };
    GraphScatter4Page.prototype.goToGraphBar4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_bar4_graph_bar4__["a" /* GraphBar4Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for each of the last 12 months.
      * Charts are all dynamic to new data.
      */
    GraphScatter4Page.prototype.getVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var visitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var visitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    var currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
                //This is where we push the chart data
                // console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                visitsMonthsArray.push(visitsArrayPerMonth.length);
            }
            for (var d = 0; d < visitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsMonthsArray[d];
                }
                else if (_this.maxValue < visitsMonthsArray[d]) {
                    _this.maxValue = visitsMonthsArray[d];
                }
            }
            for (d = visitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(visitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphScatter4Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Number of Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphScatter4Page.prototype, "lineChart", void 0);
    GraphScatter4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-scatter4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter4\graph-scatter4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 5) Total Number of Visits Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie4()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter4\graph-scatter4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphScatter4Page);
    return GraphScatter4Page;
}());

//# sourceMappingURL=graph-scatter4.js.map

/***/ }),

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphPie4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_bar4_graph_bar4__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter4_graph_scatter4__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphPie4Page = (function () {
    function GraphPie4Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
         * This is the logic that assigns the desired background, chosen in
         * admin-app-settings.ts, to the background of the current page.
         */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getVisitsPerMonth();
    }
    /**
     * This method opens the homepage.
     */
    GraphPie4Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
    * This method takes user back to list of all graphs
    */
    GraphPie4Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphPie4Page.prototype.goToGraphScatter4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter4_graph_scatter4__["a" /* GraphScatter4Page */]);
    };
    GraphPie4Page.prototype.goToGraphBar4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_bar4_graph_bar4__["a" /* GraphBar4Page */]);
    };
    /**
     * Methods calculates the total number of visitors to the farm for each of the last 12 months.
     * Charts are all dynamic to new data.
     */
    GraphPie4Page.prototype.getVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var visitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var visitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    var currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
                //This is where we push the chart data
                // console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                visitsMonthsArray.push(visitsArrayPerMonth.length);
            }
            for (var d = 0; d < visitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsMonthsArray[d];
                }
                else if (_this.maxValue < visitsMonthsArray[d]) {
                    _this.maxValue = visitsMonthsArray[d];
                }
            }
            for (d = visitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(visitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
      * Methods takes the data defined and creates a chart
      */
    GraphPie4Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Number of Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 60,
                        right: 60,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], GraphPie4Page.prototype, "pieChart", void 0);
    GraphPie4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-pie4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-pie4\graph-pie4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 5) Total Number of Visits Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n\n\n\n\n\n\n\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-pie4\graph-pie4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphPie4Page);
    return GraphPie4Page;
}());

//# sourceMappingURL=graph-pie4.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphBar4Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie4_graph_pie4__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter4_graph_scatter4__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphBar4Page = (function () {
    function GraphBar4Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
          * Chart methodology starts here
          */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
         * This is the logic that assigns the desired background, chosen in
         * admin-app-settings.ts, to the background of the current page.
         */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getVisitsPerMonth();
    }
    /**
     * This method opens the homepage.
     */
    GraphBar4Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
       * This method takes user back to list of all graphs
       */
    GraphBar4Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphBar4Page.prototype.goToGraphScatter4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter4_graph_scatter4__["a" /* GraphScatter4Page */]);
    };
    GraphBar4Page.prototype.goToGraphPie4 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie4_graph_pie4__["a" /* GraphPie4Page */]);
    };
    /**
    * Methods calculates the total number of visitors to the farm for each of the last 12 months.
    * Charts are all dynamic to new data.
    */
    GraphBar4Page.prototype.getVisitsPerMonth = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                //Need to do a logic check here to see if the current userId is contained
                var booleanCheck = 0;
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var visitsMonthsArray = []; //This will always have a length of 12
            var monthMatchingArray = []; //This will also have a length of 12
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                var visitsArrayPerMonth = [];
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    booleanCheck = 0; //Resets to 0 after each iteration
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    var currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Checking the userID contained in the first element of each new line to see if it is already contained in the arraylist
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
                //This is where we push the chart data
                // console.log("For: " + currentMonthMaster + "/" + currentYearMaster + ", the number of unique visitors is: " + uniqueVisitsArrayPerMonth.length);
                visitsMonthsArray.push(visitsArrayPerMonth.length);
            }
            for (var d = 0; d < visitsMonthsArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = visitsMonthsArray[d];
                }
                else if (_this.maxValue < visitsMonthsArray[d]) {
                    _this.maxValue = visitsMonthsArray[d];
                }
            }
            for (d = visitsMonthsArray.length - 1; d >= 0; --d) {
                _this.chartLabels.push(monthMatchingArray[d]);
                _this.chartValues.push(visitsMonthsArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphBar4Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Total Number of Visitors Per Month',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], GraphBar4Page.prototype, "barChart", void 0);
    GraphBar4Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-bar4',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-bar4\graph-bar4.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 5) Total Number of Visits Per Month </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter4()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie4()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-bar4\graph-bar4.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphBar4Page);
    return GraphBar4Page;
}());

//# sourceMappingURL=graph-bar4.js.map

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphScatter5Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_bar5_graph_bar5__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_pie5_graph_pie5__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphScatter5Page = (function () {
    function GraphScatter5Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getDiffNumberOfVisitsPerYear();
    }
    GraphScatter5Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad GraphScatter5Page');
    };
    /**
     * This method opens the homepage.
     */
    GraphScatter5Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphScatter5Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphScatter5Page.prototype.goToGraphPie5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_pie5_graph_pie5__["a" /* GraphPie5Page */]);
    };
    GraphScatter5Page.prototype.goToGraphBar5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_bar5_graph_bar5__["a" /* GraphBar5Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for each of the last 12 months
      * and gives a breakdown of the frequency of returning visitors. There are 7 categories:
      * "1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits" , "21-24 visits", "25+ visits"
      * Charts are all dynamic to new data.
      */
    GraphScatter5Page.prototype.getDiffNumberOfVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var monthMatchingArray = []; //This will also have a length of 12
            var visitsArrayPerMonth = []; //holds every user ID for the last 12 months
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Gives a list of all the userIDs that have logged in for the given month
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
            }
            var numberOfVisitsArray = ["1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits", "21-24 visits", "25+ visits"];
            var previouslyCountedIDs = [];
            var counter14 = 0;
            var counter58 = 0;
            var counter912 = 0;
            var counter1316 = 0;
            var counter1720 = 0;
            var counter2124 = 0;
            var counter25 = 0;
            // Here is where we determine the tallys for each strata
            for (i = 0; i < visitsArrayPerMonth.length; i++) {
                var counter = 0;
                var currentIDForCounting = visitsArrayPerMonth[i];
                var booleanCheck = 0; //Resets to 0 after each iteration
                console.log("Flag");
                for (var b = 0; b < previouslyCountedIDs.length; b++) {
                    if (previouslyCountedIDs[b] === currentIDForCounting) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    for (j = 0; j < visitsArrayPerMonth.length; j++) {
                        console.log("currentIDForCounting: " + currentIDForCounting + ", visitsArrayPerMonth[j]: " + visitsArrayPerMonth[j]);
                        if (currentIDForCounting === visitsArrayPerMonth[j]) {
                            counter++;
                        }
                    }
                    console.log("currentIDForCounting: " + currentIDForCounting + "Visited:" + counter + "times");
                    //Then works out which category the userID belongs to
                    if (counter < 5) {
                        counter14++;
                    }
                    else if (counter < 9 && counter > 4) {
                        counter58++;
                    }
                    else if (counter < 13 && counter > 8) {
                        counter912++;
                    }
                    else if (counter < 17 && counter > 12) {
                        counter1316++;
                    }
                    else if (counter < 21 && counter > 16) {
                        counter1720++;
                    }
                    else if (counter < 25 && counter > 20) {
                        counter2124++;
                    }
                    else if (counter > 24) {
                        counter25++;
                    }
                    previouslyCountedIDs.push(currentIDForCounting); // adds the id to an array so that it isn't counted more than once
                }
            }
            var tallyArray = [counter14, counter58, counter912, counter1316, counter1720, counter2124, counter25]; //This will have a length of 7
            //Determining the max y-axis limits for the graph
            for (var d = 0; d < tallyArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = tallyArray[d];
                }
                else if (_this.maxValue < tallyArray[d]) {
                    _this.maxValue = tallyArray[d];
                }
            }
            //Pushing the values and labels required to the graph
            for (d = 0; d < tallyArray.length; d++) {
                _this.chartLabels.push(numberOfVisitsArray[d]);
                _this.chartValues.push(tallyArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createLineChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphScatter5Page.prototype.createLineChart = function () {
        this.lineChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Individuals That Visited',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours,
                        fill: false
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineChart'),
        __metadata("design:type", Object)
    ], GraphScatter5Page.prototype, "lineChart", void 0);
    GraphScatter5Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-scatter5',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter5\graph-scatter5.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 6) Categorised Visits Over Last 12 Months </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie5()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #lineChart></canvas>\n        </section>\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-scatter5\graph-scatter5.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphScatter5Page);
    return GraphScatter5Page;
}());

//# sourceMappingURL=graph-scatter5.js.map

/***/ }),

/***/ 83:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphBar5Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_pie5_graph_pie5__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter5_graph_scatter5__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphBar5Page = (function () {
    function GraphBar5Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getDiffNumberOfVisitsPerYear();
    }
    GraphBar5Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad GraphBar5Page');
    };
    /**
     * This method opens the homepage.
     */
    GraphBar5Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphBar5Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphBar5Page.prototype.goToGraphScatter5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter5_graph_scatter5__["a" /* GraphScatter5Page */]);
    };
    GraphBar5Page.prototype.goToGraphPie5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_pie5_graph_pie5__["a" /* GraphPie5Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for each of the last 12 months
      * and gives a breakdown of the frequency of returning visitors. There are 7 categories:
      * "1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits" , "21-24 visits", "25+ visits"
      * Charts are all dynamic to new data.
      */
    GraphBar5Page.prototype.getDiffNumberOfVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                var currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var monthMatchingArray = []; //This will also have a length of 12
            var visitsArrayPerMonth = []; //holds every user ID for the last 12 months
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Gives a list of all the userIDs that have logged in for the given month
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
            }
            var numberOfVisitsArray = ["1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits", "21-24 visits", "25+ visits"];
            var previouslyCountedIDs = [];
            var counter14 = 0;
            var counter58 = 0;
            var counter912 = 0;
            var counter1316 = 0;
            var counter1720 = 0;
            var counter2124 = 0;
            var counter25 = 0;
            // Here is where we determine the tallys for each strata
            for (i = 0; i < visitsArrayPerMonth.length; i++) {
                var counter = 0;
                var currentIDForCounting = visitsArrayPerMonth[i];
                var booleanCheck = 0; //Resets to 0 after each iteration
                console.log("Flag");
                for (var b = 0; b < previouslyCountedIDs.length; b++) {
                    if (previouslyCountedIDs[b] === currentIDForCounting) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    for (j = 0; j < visitsArrayPerMonth.length; j++) {
                        console.log("currentIDForCounting: " + currentIDForCounting + ", visitsArrayPerMonth[j]: " + visitsArrayPerMonth[j]);
                        if (currentIDForCounting === visitsArrayPerMonth[j]) {
                            counter++;
                        }
                    }
                    console.log("currentIDForCounting: " + currentIDForCounting + " Visited: " + counter + "times");
                    //Then works out which category the userID belongs to
                    if (counter < 5) {
                        counter14++;
                    }
                    else if (counter < 9 && counter > 4) {
                        counter58++;
                    }
                    else if (counter < 13 && counter > 8) {
                        counter912++;
                    }
                    else if (counter < 17 && counter > 12) {
                        counter1316++;
                    }
                    else if (counter < 21 && counter > 16) {
                        counter1720++;
                    }
                    else if (counter < 25 && counter > 20) {
                        counter2124++;
                    }
                    else if (counter > 24) {
                        counter25++;
                    }
                    previouslyCountedIDs.push(currentIDForCounting); // adds the id to an array so that it isn't counted more than once
                }
            }
            var tallyArray = [counter14, counter58, counter912, counter1316, counter1720, counter2124, counter25]; //This will have a length of 7
            //Determining the max y-axis limits for the graph
            for (var d = 0; d < tallyArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = tallyArray[d];
                }
                else if (_this.maxValue < tallyArray[d]) {
                    _this.maxValue = tallyArray[d];
                }
            }
            //Pushing the values and labels required to the graph
            for (d = 0; d < tallyArray.length; d++) {
                console.log("Tally array: " + tallyArray[d]);
                _this.chartLabels.push(numberOfVisitsArray[d]);
                _this.chartValues.push(tallyArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            console.log(_this.chartValues);
            _this.createBarChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphBar5Page.prototype.createBarChart = function () {
        this.barChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Individuals That Visited',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    boxWidth: 80,
                    fontSize: 15,
                    padding: 0
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: Math.floor(this.maxValue / 10),
                                max: this.maxValue + 2
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barChart'),
        __metadata("design:type", Object)
    ], GraphBar5Page.prototype, "barChart", void 0);
    GraphBar5Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-bar5',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-bar5\graph-bar5.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 6) Categorised Visits Over Last 12 Months </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphPie5()" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <section class="chart-wrapper">\n            <canvas #barChart></canvas>\n        </section>\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-bar5\graph-bar5.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphBar5Page);
    return GraphBar5Page;
}());

//# sourceMappingURL=graph-bar5.js.map

/***/ }),

/***/ 84:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GraphPie5Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__homepage_homepage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__graph_bar5_graph_bar5__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__graph_scatter5_graph_scatter5__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
  *'Chart.js' tutorial from https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
  * helped setup the basics of each graph.
  */
var GraphPie5Page = (function () {
    function GraphPie5Page(navCtrl, navParams, storage, sqlitedatabase) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.sqlitedatabase = sqlitedatabase;
        this.winter = true; //default
        this.summer = false;
        this.autumn = false;
        this.spring = false;
        /**
        * Chart methodology starts here
        */
        this.chart_colors = [
            'rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.hover_colors = ['rgba(255, 255, 0, 0.5)',
            'rgba(0, 153, 0, 0.5)',
            'rgba(153, 255, 51, 0.5)',
            'rgba(204, 102, 0, 0.5)',
            'rgba(102, 51, 0, 0.5)',
            'rgba(255, 102, 178, 0.5)',
            'rgba(0, 0, 204, 0.5)',
            'rgba(204, 153, 255, 0.5)',
            'rgba(153, 204, 255, 0.5)',
            'rgba(255, 204, 204, 0.5)',
            'rgba(255, 51, 51, 0.5)',
            'rgba(102, 204, 0, 0.5)'
        ];
        this.answers = [];
        this.chartLabels = [];
        this.chartValues = [];
        this.chartColours = [];
        this.chartHoverColours = [];
        /**
          * This is the logic that assigns the desired background, chosen in
          * admin-app-settings.ts, to the background of the current page.
          */
        var promise1 = this.storage.get('wallpaperToggle'); //
        promise1.then(function (wallpaperID) {
            console.log(wallpaperID);
            if (wallpaperID == "autumn") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = true;
                _this.spring = false;
            }
            else if (wallpaperID == "summer") {
                _this.winter = false;
                _this.summer = true;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "winter") {
                _this.winter = true;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = false;
            }
            else if (wallpaperID == "spring") {
                _this.winter = false;
                _this.summer = false;
                _this.autumn = false;
                _this.spring = true;
            }
        });
        this.getDiffNumberOfVisitsPerYear();
    }
    GraphPie5Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad GraphPie5Page');
    };
    /**
     * This method opens the homepage.
     */
    GraphPie5Page.prototype.goToHomepage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__homepage_homepage__["a" /* HomepagePage */]);
    };
    /**
     * This method takes user back to list of all graphs
     */
    GraphPie5Page.prototype.goToAdminVisitorData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__admin_visitor_data_admin_visitor_data__["a" /* AdminVisitorDataPage */]);
    };
    /**
    * Methods below take user to different forms of the same graph
    */
    GraphPie5Page.prototype.goToGraphScatter5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__graph_scatter5_graph_scatter5__["a" /* GraphScatter5Page */]);
    };
    GraphPie5Page.prototype.goToGraphBar5 = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__graph_bar5_graph_bar5__["a" /* GraphBar5Page */]);
    };
    /**
      * Methods calculates the total number of visitors to the farm for each of the last 12 months
      * and gives a breakdown of the frequency of returning visitors. There are 7 categories:
      * "1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits" , "21-24 visits", "25+ visits"
      * Charts are all dynamic to new data.
      */
    GraphPie5Page.prototype.getDiffNumberOfVisitsPerYear = function () {
        var _this = this;
        console.log("Getting total number of unique visits per month");
        this.sqlitedatabase.listLoginDetailsForGraphs()
            .then(function (stats) {
            console.log("Number of visits (total): " + stats.length);
            var maxYear = 0;
            var maxMonth = 0;
            for (var j = 0; j < stats.length; j++) {
                var currentDateHandled = new Date(stats[j].login_time);
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                var currentYear = currentDateInfoArray[3];
                if (maxYear < parseInt(currentYear)) {
                    maxYear = parseInt(currentYear); //Finds the most recent year	
                }
            }
            for (j = 0; j < stats.length; j++) {
                currentDateHandled = new Date(stats[j].login_time);
                //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                currentDateInfoArray = currentDateHandled.toString().split(" ");
                currentYear = currentDateInfoArray[3];
                var currentMonth = currentDateInfoArray[1];
                var currentMonthInt = 0;
                if (currentMonth == 'Jan') {
                    currentMonthInt = 1;
                }
                else if (currentMonth == 'Feb') {
                    currentMonthInt = 2;
                }
                else if (currentMonth == 'Mar') {
                    currentMonthInt = 3;
                }
                else if (currentMonth == 'Apr') {
                    currentMonthInt = 4;
                }
                else if (currentMonth == 'May') {
                    currentMonthInt = 5;
                }
                else if (currentMonth == 'Jun') {
                    currentMonthInt = 6;
                }
                else if (currentMonth == 'Jul') {
                    currentMonthInt = 7;
                }
                else if (currentMonth == 'Aug') {
                    currentMonthInt = 8;
                }
                else if (currentMonth == 'Sep') {
                    currentMonthInt = 9;
                }
                else if (currentMonth == 'Oct') {
                    currentMonthInt = 10;
                }
                else if (currentMonth == 'Nov') {
                    currentMonthInt = 11;
                }
                else if (currentMonth == 'Dec') {
                    currentMonthInt = 12;
                }
                if (parseInt(currentYear) === maxYear && maxMonth < currentMonthInt) {
                    maxMonth = currentMonthInt;
                }
            } //Here ends the first for loop
            var monthMatchingArray = []; //This will also have a length of 12
            var visitsArrayPerMonth = []; //holds every user ID for the last 12 months
            var currentMonthMaster = maxMonth + 1;
            var currentYearMaster = maxYear;
            for (var a = 0; a < 12; ++a) {
                currentMonthMaster = currentMonthMaster - 1;
                if (currentMonthMaster === 0) {
                    currentMonthMaster = 12;
                    currentYearMaster = maxYear - 1;
                }
                monthMatchingArray.push(currentMonthMaster + "/" + currentYearMaster);
                //Now the unique visit logic starts here
                for (var i = 0; i < stats.length; ++i) {
                    currentDateHandled = new Date(stats[i].login_time);
                    //Tue Dec 26 2017 14:33:19 GMT+0000 (GMT) (Day, Month, Date, Year, Time, Summat)
                    var currentDateInfoArray = currentDateHandled.toString().split(" ");
                    currentYear = currentDateInfoArray[3];
                    currentMonth = currentDateInfoArray[1];
                    currentMonthInt = 0;
                    if (currentMonth == 'Jan') {
                        currentMonthInt = 1;
                    }
                    else if (currentMonth == 'Feb') {
                        currentMonthInt = 2;
                    }
                    else if (currentMonth == 'Mar') {
                        currentMonthInt = 3;
                    }
                    else if (currentMonth == 'Apr') {
                        currentMonthInt = 4;
                    }
                    else if (currentMonth == 'May') {
                        currentMonthInt = 5;
                    }
                    else if (currentMonth == 'Jun') {
                        currentMonthInt = 6;
                    }
                    else if (currentMonth == 'Jul') {
                        currentMonthInt = 7;
                    }
                    else if (currentMonth == 'Aug') {
                        currentMonthInt = 8;
                    }
                    else if (currentMonth == 'Sep') {
                        currentMonthInt = 9;
                    }
                    else if (currentMonth == 'Oct') {
                        currentMonthInt = 10;
                    }
                    else if (currentMonth == 'Nov') {
                        currentMonthInt = 11;
                    }
                    else if (currentMonth == 'Dec') {
                        currentMonthInt = 12;
                    }
                    if (parseInt(currentYear) === currentYearMaster && currentMonthInt === currentMonthMaster) {
                        //Gives a list of all the userIDs that have logged in for the given month
                        var currentUserID = stats[i].user_id;
                        visitsArrayPerMonth.push(currentUserID); //Adds the year if it isn't already contained
                    }
                }
            }
            var numberOfVisitsArray = ["1-4 visits", "5-8 visits", "9-12 visits", "13-16 visits", "17-20 visits", "21-24 visits", "25+ visits"];
            var previouslyCountedIDs = [];
            var counter14 = 0;
            var counter58 = 0;
            var counter912 = 0;
            var counter1316 = 0;
            var counter1720 = 0;
            var counter2124 = 0;
            var counter25 = 0;
            // Here is where we determine the tallys for each strata
            for (i = 0; i < visitsArrayPerMonth.length; i++) {
                var counter = 0;
                var currentIDForCounting = visitsArrayPerMonth[i];
                var booleanCheck = 0; //Resets to 0 after each iteration
                console.log("Flag");
                for (var b = 0; b < previouslyCountedIDs.length; b++) {
                    if (previouslyCountedIDs[b] === currentIDForCounting) {
                        booleanCheck = 1;
                        break;
                    }
                }
                if (booleanCheck === 0) {
                    for (j = 0; j < visitsArrayPerMonth.length; j++) {
                        console.log("currentIDForCounting: " + currentIDForCounting + ", visitsArrayPerMonth[j]: " + visitsArrayPerMonth[j]);
                        if (currentIDForCounting === visitsArrayPerMonth[j]) {
                            counter++;
                        }
                    }
                    console.log("currentIDForCounting: " + currentIDForCounting + "Visited:" + counter + "times");
                    //Then works out which category the userID belongs to
                    if (counter < 5) {
                        counter14++;
                    }
                    else if (counter < 9 && counter > 4) {
                        counter58++;
                    }
                    else if (counter < 13 && counter > 8) {
                        counter912++;
                    }
                    else if (counter < 17 && counter > 12) {
                        counter1316++;
                    }
                    else if (counter < 21 && counter > 16) {
                        counter1720++;
                    }
                    else if (counter < 25 && counter > 20) {
                        counter2124++;
                    }
                    else if (counter > 24) {
                        counter25++;
                    }
                    previouslyCountedIDs.push(currentIDForCounting); // adds the id to an array so that it isn't counted more than once
                }
            }
            var tallyArray = [counter14, counter58, counter912, counter1316, counter1720, counter2124, counter25]; //This will have a length of 7
            //Determining the max y-axis limits for the graph
            for (var d = 0; d < tallyArray.length; ++d) {
                if (d === 0) {
                    _this.maxValue = tallyArray[d];
                }
                else if (_this.maxValue < tallyArray[d]) {
                    _this.maxValue = tallyArray[d];
                }
            }
            //Pushing the values and labels required to the graph
            for (d = 0; d < tallyArray.length; d++) {
                _this.chartLabels.push(numberOfVisitsArray[d]);
                _this.chartValues.push(tallyArray[d]);
                _this.chartColours.push(_this.chart_colors[d]);
                _this.chartHoverColours.push(_this.hover_colors[d]);
            }
            _this.createPieChart();
        }, function (err) {
            console.log("something went wrong on retrieving login history");
        });
    };
    /**
     * Methods takes the data defined and creates a chart
     */
    GraphPie5Page.prototype.createPieChart = function () {
        this.pieChartEl = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.pieChart.nativeElement, {
            type: 'pie',
            data: {
                labels: this.chartLabels,
                datasets: [{
                        label: 'Number of Individuals That Visited',
                        data: this.chartValues,
                        duration: 2000,
                        easing: 'easeInQuart',
                        backgroundColor: this.chartColours,
                        hoverBackgroundColor: this.chartHoverColours
                    }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 60,
                        right: 60,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 5000
                }
            }
        });
        this.chartLoadingEl = this.pieChartEl.generateLegend();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('pieChart'),
        __metadata("design:type", Object)
    ], GraphPie5Page.prototype, "pieChart", void 0);
    GraphPie5Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-graph-pie5',template:/*ion-inline-start:"C:\Users\David\Desktop\scf2\src\pages\graph-pie5\graph-pie5.html"*/'<ion-content padding [class.winterBackground]="winter" [class.summerBackground]="summer" [class.autumnBackground]="autumn"\n    [class.springBackground]="spring" [class.customBackground]="custom">\n    <ion-grid>\n        <ion-row>\n            <ion-col>\n                <h1 id="login-heading2">\n                    <img src="assets/img/Registration_Data_Logo.png" style="display:block;width:65%;height:auto;margin-left:auto;margin-right:auto;"\n                        on-click="goToAdminVisitorData()" />\n                </h1>\n            </ion-col>\n\n\n        </ion-row>\n\n        <ion-row>\n            <ion-col>\n                <a id="admin-home-back-button" class="nav-button" href="#" on-click="goToAdminVisitorData()" float-left>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="arrow-round-back"></ion-icon>\n                        <label> &#8239; Back</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n            <ion-col>\n\n\n\n            </ion-col>\n\n\n            <ion-col>\n                <!-- Home button, to homepage -->\n                <a id="admin-home-home-button" class="nav-button" href="#" on-click="goToHomepage()" float-right>\n                    <div>\n                        <label> &#8239; </label>\n                        <ion-icon name="home"></ion-icon>\n                        <label> &#8239; Home</label>\n                    </div>\n\n                </a>\n            </ion-col>\n\n\n        </ion-row>\n\n\n        <ion-row>\n\n\n            <ion-col>\n                <a id="visitor-data-button1" class="semi-transparent-button" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n                        <label> 6) Categorised Visits Over Last 12 Months </label>\n\n\n                    </div>\n\n                </a>\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row>\n\n            <ion-col>\n\n                <a id="visitor-data-button1" class="chart-type-button" href="#" on-click="goToGraphScatter5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-right>\n                    <div>\n                        <label> Scatter </label>\n                    </div>\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n\n                <a id="visitor-data-button2" class="chart-type-button-underline" href="#" style="display:block;margin-left:auto;margin-right:auto;">\n                    <div>\n\n                        <label> Pie </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n            <ion-col>\n                <a id="visitor-data-button2" class="chart-type-button" href="#" on-click="goToGraphBar5()" style="display:block;margin-left:auto;margin-right:auto;"\n                    float-left>\n                    <div>\n\n                        <label> Bar </label>\n                    </div>\n\n                </a>\n\n            </ion-col>\n\n\n        </ion-row>\n\n\n\n        <section class="chart-wrapper">\n            <canvas #pieChart></canvas>\n        </section>\n\n\n\n\n\n\n\n\n\n\n\n\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"C:\Users\David\Desktop\scf2\src\pages\graph-pie5\graph-pie5.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_8__providers_sqlitedatabase_sqlitedatabase__["a" /* sqlitedatabase */]])
    ], GraphPie5Page);
    return GraphPie5Page;
}());

//# sourceMappingURL=graph-pie5.js.map

/***/ })

},[392]);
//# sourceMappingURL=main.js.map