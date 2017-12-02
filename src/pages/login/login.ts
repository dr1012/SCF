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
    selectedItem: any;
   public items= [];
   public items2= [];
   public items3= [];
   public bufferList: Array<any>;
   showList: boolean = false;

    constructor(public http   : Http, 
        public navCtrl: NavController,
        private alertController: AlertController, 
        private shareprovider: ShareProvider, private sqlitedatabase :sqlitedatabase  ) {

    }


      
    initializeItems(): void{
        this.sqlitedatabase.retrieveLastName().then(data => {
            this.items = data;
          })
          
       
    }
    
    initialize2(): void{
        this.sqlitedatabase.retrieveFirstName().then(data => {
            this.items2 = data;
          })
    }


    combine(): void{
        this.initializeItems();
        this.initialize2();
        for(var i =1; i<this.items.length; i++){
            this.items3.push({FirstName: this.items2[i], LastName: this.items[i]});
        }
    }

    getItems(searchbar) {
        // Reset items back to all of the items
        this.combine();
        
        // set q to the value of the searchbar
        var q = searchbar.srcElement.value;
      
      
        // if the value is an empty string don't filter the items
        if (!q) {
          return;
        }
      
        this.items = this.items.filter((v) => {
          if(v.LastName && q) {
            if (v.LastName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      
        console.log(q, this.items3[0]);
      
      }

      onEnter(){
        this.setSelection(this.items3[0]);
    }

     setSelection(item: any){
 
        this.selectedItem = item;
        this.lastNameInput = item.LastName;
        this.showList = false;
        this.loginText = "Login ("+item.FirstName+" "+item.LastName+")";
    }
    
    

    goToHomepage(params){
        console.log(this.items[0].LastName);
        if (!params) params = {};
        this.navCtrl.push(HomepagePage);
    }

    goBack(){
        this.navCtrl.pop();
    }




}
