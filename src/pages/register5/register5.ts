import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';
import { Register6Page } from '../register6/register6';

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

   

    

    public goRegister6(){
        if(this.addressInput && this.postcodeInput){
            this.shareprovider.updateRegistrationInfo('address',this.addressInput);
            this.shareprovider.updateRegistrationInfo('postcode',this.postcodeInput);
            console.log(this.shareprovider.getRegistrationInfo());
            // register account
      
            this.navCtrl.push(Register6Page);
        } else {
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please enter both address and postcode",
            });
            addTodoAlert.present();
        }


    }
    
  


}

