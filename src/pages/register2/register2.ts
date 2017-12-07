import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register3Page } from '../register3/register3';
import { ShareProvider } from '../../providers/share/share';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'page-register2',
    templateUrl: 'register2.html'
})
export class Register2Page {
    lastNameInput = '';

    showList: boolean = false;
    items: string[];

    constructor(public http   : Http,  
        public navCtrl: NavController, 
        private alertController: AlertController, 
        private shareprovider: ShareProvider)  {
    }

    getItems(ev: any) {
        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = [];
            /*
            this.http.get(this.shareprovider.getBackendRootUrl() + '/suggestLastname/'+val)
            .map(res => res.json())
            .subscribe(response => {
                // add the query to the top of results
                response.data.unshift(val);
                this.items = response.data;
                console.log("data:"+response.data);
            });

            // Show the results
            this.showList = true;
            */
        } else {

            // hide the results when the query is empty
            this.showList = false;
        }
    }

    onEnter(){
        this.setName(this.items[0]);
    }

    setName(item: string){
        console.log(item);
        this.lastNameInput = item;
        this.showList = false;
    }


    goToHomepage(){
        this.navCtrl.push(HomepagePage);
    }
    goBack(){
        this.navCtrl.pop();
    }

    public goRegister3(){
        if(this.lastNameInput){
            this.shareprovider.updateRegistrationInfo('last_name',this.lastNameInput);
            console.log(this.shareprovider.getRegistrationInfo());

            this.shareprovider.addElements(this.lastNameInput); //this push function apends values. Does not delete what is already  there
            console.log(this.shareprovider.getElements()); //testing the array
            this.navCtrl.push(Register3Page);
        }
        else{
            let addTodoAlert=this.alertController.create({
                title: "Warning!!", 
                message: "Please enter your Last Name",
            });
            addTodoAlert.present();
        }


    }


}

