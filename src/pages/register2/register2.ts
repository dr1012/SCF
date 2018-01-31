import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register3Page } from '../register3/register3';
import { ShareProvider } from '../../providers/share/share';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';



@Component({
    selector: 'page-register2',
    templateUrl: 'register2.html'
})
export class Register2Page {
    lastNameInput = '';

    wallpaperID: string;
    winter: boolean = true; //default
    summer: boolean = false;
    autumn: boolean = false;
    spring: boolean = false;

    showList: boolean = false;
    items: string[];

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


    onEnter() {
        this.setName(this.items[0]);
    }

    setName(item: string) {
        console.log(item);
        this.lastNameInput = item;
        this.showList = false;
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
        this.shareprovider.deleteItemFromRegistration('first_name');
        this.navCtrl.pop();
    }

    /**
     * This method registers the user input in the registration_info object in the share.ts file and takes the user to the next page. 
     */
    public goRegister3() {
        if (this.lastNameInput) {
            this.shareprovider.updateRegistrationInfo('last_name', this.lastNameInput);
            console.log(this.shareprovider.getRegistrationInfo());


            this.navCtrl.push(Register3Page);
        }
        else {
            let addTodoAlert = this.alertController.create({
                title: "Warning",
                message: "Please enter your Last Name",
            });
            addTodoAlert.present();
        }


    }


}

