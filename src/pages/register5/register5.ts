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
  itemcount: number = 0;



  constructor(public webSrv: WebService,public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    
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

      this.shareprovider.addElements(this.addressInput); 
      this.shareprovider.addElements(this.postcodeInput);
      this.add_volunteer();
      this.navCtrl.push(Questionnaire0Page);
   
    }

    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your address and postcode",
      });
      addTodoAlert.present();
    }
    
  
  }

 /* public Test(){
    console.log(JSON.stringify(this.items));
    
  }*/

  
}



