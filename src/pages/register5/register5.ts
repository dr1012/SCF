import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { Register6Page } from '../register6/register6';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';


@Component({
    selector: 'page-register5',
    templateUrl: 'register5.html'
})
export class Register5Page {
    addressInput = '';
    postcodeInput = '';

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    constructor(public http: Http,
        public navCtrl: NavController,
        private alertController: AlertController,
        private shareprovider: ShareProvider,
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
        this.shareprovider.deleteItemFromRegistration('phone_number');
        this.navCtrl.pop();
    }




    /**
         * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page. 
         */
    public goRegister6() {
        if (this.addressInput && this.postcodeInput) {
            this.shareprovider.updateRegistrationInfo('address', this.addressInput);
            this.shareprovider.updateRegistrationInfo('postcode', this.postcodeInput);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account

            this.navCtrl.push(Register6Page);
        } else {
            let addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter both address and postcode",
            });
            addTodoAlert.present();
        }


    }




}

