import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';

import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {


   
    loginText = 'Login';
    lastNameInput = '';

    showList: boolean = false;
    items: any;
    selectedItem: any;

    constructor(public http   : Http, 
        public navCtrl: NavController,
        private alertController: AlertController, 
        private shareprovider: ShareProvider, 
        private sqlitedatabase :sqlitedatabase  ) {
    }
    
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
    
    onEnter(){
        console.log("on enter")
        this.setSelection(this.items[0]);
    }

    setSelection(item: any){
        console.log("selected item:" + JSON.stringify(item));
        this.selectedItem = item;
        this.lastNameInput = item.last_name;
        this.showList = false;
        this.loginText = "Login ("+item.first_name+" "+item.last_name+")";
    }
    
    
    
    
    loginToApp(){
        if(this.selectedItem == undefined || this.selectedItem.id == undefined){
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please select your name to login",
            });
            addTodoAlert.present();
        }else{
            this.sqlitedatabase.last_login(this.selectedItem.id)
                .then((data) => {
                    console.log("Last Login: "+JSON.stringify(data.rows.item(0)));
                    if(data.rows.length==0 || data.rows.item(0).logout_ts != undefined){
                        this.sqlitedatabase.login(this.selectedItem.id)
                            .then(()=>{
                                this.showLoginResponse("Login successful");
                                // clear lastname
                                this.clearLogin();
                            }, err => {
                                this.showLoginResponse("Login failed");
                                console.log('Error1: ', err);
                            });
                    }else{
                        this.showLoginResponse("Already logged in.");
                    }
                }).catch(e => {
                    console.log('Error2: ', e);
                    this.showLoginResponse("Login failed");
                });
        }
    }

    showLoginResponse(response){
        let loginResultAlert=this.alertController.create({
            title: "Login Response", 
            message: response,
        });
        loginResultAlert.present(); 
    }
    
    clearLogin(){
        this.lastNameInput = '';
        this.selectedItem = undefined;
        this.loginText = 'Login';
    }

    goToHomepage(params){
        if (!params) params = {};
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }
    
    /* Old code below */
  
    
    
}
