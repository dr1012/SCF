import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register2Page } from '../register2/register2';
import { ShareProvider } from '../../providers/share/share';
import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'page-register1',
    templateUrl: 'register1.html'
})
export class Register1Page {
    firstNameInput = '';

    showList: boolean = false;
    items: string[];


    constructor(public http   : Http, 
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

    public goRegister2(){

        if(this.firstNameInput){
            this.shareprovider.updateRegistrationInfo('first_name',this.firstNameInput);
            console.log(this.shareprovider.getRegistrationInfo());


            this.navCtrl.push(Register2Page);

        }else{
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please enter your First Name",
            });
            addTodoAlert.present();
        }

    }



}
