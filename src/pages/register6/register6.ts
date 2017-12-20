import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Questionnaire1Page } from '../questionnaire1/questionnaire1';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-register6',
    templateUrl: 'register6.html'
})
export class Register6Page {
    emergency_name = '';
    emergency_telephone = '';
    emergency_relationship = '';

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
            .then((data) => {
                console.log("registered output data:"+JSON.stringify(data));
                console.log("id: "+ data.insertId);
                this.showAlert("Success", "Registration is successful. Id:"+data.insertId);
                this.shareprovider.setUserId(data.insertId);
            }).catch(e => {
                this.showAlert("Failure", "Something went wrong on registering user");
                console.log(e)
            });;
    }

    public goRegister7(){
        if(this.emergency_name && this.emergency_telephone && this.emergency_relationship){
            this.shareprovider.updateRegistrationInfo('emergency_name',this.emergency_name);
            this.shareprovider.updateRegistrationInfo('emergency_telephone',this.emergency_telephone);
            this.shareprovider.updateRegistrationInfo('emergency_relationship',this.emergency_relationship);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
            this.registerAccount();

            
            this.navCtrl.push(Questionnaire1Page);
        } else {
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please complete all three fields",
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

