import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { Questionnaire0Page } from '../questionnaire0/questionnaire0';
import { WebService } from '../../providers/web-service';

@Component({
  selector: 'page-register5',
  templateUrl: 'register5.html'
})
export class Register5Page {

  addressInput='';
  postcodeInput='';
  itemcount: number = 0;
  items: any[] = [];



  constructor(public webSrv: WebService,public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
   this.webSrv.getDataFromSQLlite().then(data => {
     this.itemcount = data.rows.length;       
      // Here i get the total row count from the SQLite DB
      //we have to have that in otherwise it doesn't work
    });
  }
    

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
    this.shareprovider.clear();
  }
  goBack(){
    this.navCtrl.pop();
  }

  add_volunteer(){
    this.webSrv.InsertData(this.shareprovider.getElements());
  }

  public goRegister6(){
    if(this.addressInput && this.postcodeInput){
      this.syncFromDb();
      this.shareprovider.addElements(this.addressInput); 
      this.shareprovider.addElements(this.postcodeInput);
      console.log(this.shareprovider.getElements());
     // this.navCtrl.push(Questionnaire0Page);
   
    }

    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your address and postcode",
      });
      addTodoAlert.present();
    }
    
  
  }

  public addToDb(){
    this.syncFromDb();
    this.add_volunteer();
  }

  syncFromDb() {
    this.items = [];
    this.webSrv.getDataFromSQLlite().then(data => {
      var count = data.rows.length;
      this.itemcount = count;
      for (var i = 0; i < count; i++) {
        this.items.push(data.rows.item(i));
      }
    });
  }

 public Test(){
    //this.syncFromDb(); this seems to completely arrays anything in items[] so can't add it in
    console.log("first row: " + this.items);
    console.log("second row:  "+ JSON.stringify(this.items)); //this has been checked, this gives out an array (because items is an array) and inside seem to be JSON arrays, each row is a single JSON array
    
  }

  
}



