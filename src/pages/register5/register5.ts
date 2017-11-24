import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { Questionnaire0Page } from '../questionnaire0/questionnaire0';
import { File } from '@ionic-native/file';
import { WebService } from '../../providers/web-service';

@Component({
  selector: 'page-register5',
  templateUrl: 'register5.html'
})
export class Register5Page {

  addressInput='';
  postcodeInput='';
  items = [];
  database: any;
  itemcount: number = 0;



  constructor(public webSrv: WebService,public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    this.webSrv.getDataFromSQLlite().then(data => {
      this.itemcount = data.rows.length;
    });
  }
    

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }

  add_volunteer(){
    this.webSrv.InsertData(this.shareprovider.getElements());
  }

  syncFromWeb() {
    this.webSrv.getData().subscribe(data => {
      this.items = getRandom(data, 10);
      this.webSrv.InsertData(this.items).then(data => {
        this.webSrv.getDataFromSQLlite().then(data => {
          this.itemcount = data.rows.length;
        });
        console.log(data);
      })
    });
  }

  syncFromDb() {
    this.items = [];
    this.webSrv.getDataFromSQLlite().then(data => {
      var count = data.rows.length;
      this.itemcount = count;
      for (var i = 0; i < count; i++) {
        this.items.push(data.rows.item(i));
      }
      console.log(data);
    });
    
  }

  clearDB() {
    this.webSrv.ClearDB().then(data => {
      console.log(data);
      this.webSrv.getDataFromSQLlite().then(data => {
        this.itemcount = data.rows.length;
      });
    });
  }
  clearList() {
    this.items = [];
    this.webSrv.getDataFromSQLlite().then(data => {
      this.itemcount = data.rows.length;
    });
  }

  public goRegister6(){
    if(this.addressInput && this.postcodeInput){

      this.shareprovider.addElements(this.addressInput); //this push function apends values. Does not delete what is already  there
      this.shareprovider.addElements(this.postcodeInput);
      console.log(this.shareprovider.getElements()); 
     //this.navCtrl.push(Questionnaire0Page);
   
    }

    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your address and postcode",
      });
      addTodoAlert.present();
    }
    
  
  }

  public Test(){
    console.log(JSON.stringify(this.items));
    
  }

  
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len;
  }
  return result;
}

