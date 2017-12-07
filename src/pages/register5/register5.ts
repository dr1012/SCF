import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Questionnaire0Page } from '../questionnaire0/questionnaire0';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-register5',
    templateUrl: 'register5.html'
})
export class Register5Page {
    addressInput = '';
    postcodeInput = '';

    constructor( public http   : Http,
        public navCtrl: NavController, 
        private alertController: AlertController, 
        private shareprovider: ShareProvider,
        private dbProvider: sqlitedatabase)  {
    }

    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }

    private registerAccount(){
        console.log(this.shareprovider.getRegistrationInfo());
//        this.http.post(this.shareprovider.getBackendRootUrl() + '/register',
//            this.shareprovider.getRegistrationInfo())
//            .map(res => res.json())
//            .subscribe(response => {
//                console.log("response:");
//                console.log(response);
//                this.shareprovider.setUserId(response.user_id);
//            });
        this.dbProvider.registerUser(this.shareprovider.getRegistrationInfo())
            .then(() => {
                this.showAlert("Success", "Registration is successful")
            }).catch(e => {
                this.showAlert("Failure", "Something went wrong on registering user");
                console.log(e)
            });;
    }

    public goRegister6(){
        if(this.addressInput && this.postcodeInput){
            this.shareprovider.updateRegistrationInfo('address',this.addressInput);
            this.shareprovider.updateRegistrationInfo('postcode',this.postcodeInput);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
            this.registerAccount();

            this.shareprovider.addElements(this.addressInput); //this push function apends values. Does not delete what is already  there
            this.shareprovider.addElements(this.postcodeInput)
            console.log(this.shareprovider.getElements()); //testing the array
            this.navCtrl.push(Questionnaire0Page);
        } else {
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please enter both address and postcode",
            });
            addTodoAlert.present();
        }


    }
    
    showAlert(title, message){
        let alert=this.alertController.create({
            title: title, 
            message: message,
        });
        alert.present();
    }


}

