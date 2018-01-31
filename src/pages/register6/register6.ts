import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Questionnaire1Page } from '../questionnaire1/questionnaire1';
import { Http } from '@angular/http';


import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-register6',
    templateUrl: 'register6.html'
})
export class Register6Page {
    emergency_name = '';
    emergency_telephone = '';
    emergency_relationship = '';

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    constructor(public http: Http,
        public navCtrl: NavController,
        private alertController: AlertController,
        private shareprovider: ShareProvider,
        private dbProvider: sqlitedatabase
        , private storage: Storage) {

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
    }

    /**
     * This method resets the registration_info object in the share.ts file and takes the user to the HomepagePage page. 
     */
    goToHomepage() {
        this.shareprovider.resetRegistration();
        this.navCtrl.push(HomepagePage);
    }

    /**
 * This method deletes the last user entry and takes the user to the previous page.
 */
    goBack() {
        this.shareprovider.deleteItemFromRegistration('address');
        this.shareprovider.deleteItemFromRegistration('postcode');
        this.navCtrl.pop();

    }

    /**
     * This method adds the elements of the registration_info object in the share.ts file where the registration data is temporarly stored to the sutton_user SQLite table.
     */
    private registerAccount() {
        console.log(this.shareprovider.getRegistrationInfo());

        this.dbProvider.registerUser(this.shareprovider.getRegistrationInfo())
            .then((data) => {
                console.log("registered output data:" + JSON.stringify(data));
                console.log("id: " + data.insertId);
                this.showAlert("Success", "Registration is successful. Id:" + data.insertId);
                this.shareprovider.setUserId(data.insertId);
            }).catch(e => {
                this.showAlert("Failure", "Something went wrong on registering user");
                console.log(e)
            });;
    }

    /**
     * This method registers the user input in the registration_info object in the share.ts file adds all the elements of the object to the sutton_user SQLite table (through the registerAccount() method) and takes the user to the next page. 
     */
    public goRegister7() {
        if (this.emergency_name && this.emergency_telephone && this.emergency_relationship) {
            this.shareprovider.updateRegistrationInfo('emergency_name', this.emergency_name);
            this.shareprovider.updateRegistrationInfo('emergency_telephone', this.emergency_telephone);
            this.shareprovider.updateRegistrationInfo('emergency_relationship', this.emergency_relationship);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
            this.registerAccount();


            this.navCtrl.push(Questionnaire1Page);
        } else {
            let addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please complete all three fields",
            });
            addTodoAlert.present();
        }


    }

    showAlert(title, message) {
        let alert = this.alertController.create({
            title: title,
            message: message,
        });
        alert.present();
    }


}

