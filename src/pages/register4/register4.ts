import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register5Page } from '../register5/register5';
import { ShareProvider } from '../../providers/share/share';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-register4',
    templateUrl: 'register4.html'
})
export class Register4Page {
    telInput = '';


    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    constructor(public navCtrl: NavController,
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
        this.shareprovider.deleteItemFromRegistration('email_address');

        this.navCtrl.pop();
    }

    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page. 
     */
    public goRegister5() {
        if (this.telInput) {
            if (this.telInput.length > 0) {
                this.shareprovider.updateRegistrationInfo('phone_number', this.telInput);
                console.log(this.shareprovider.getRegistrationInfo());


                this.navCtrl.push(Register5Page);
            }
            else {
                let addTodoAlert = this.alertController.create({
                    title: "Warning!!",
                    message: "Please enter a telephone number, for example: 07123456789",
                });
                addTodoAlert.present();

            }
        } else {
            let addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your telephone number",
            });
            addTodoAlert.present();
        }


    }


}

