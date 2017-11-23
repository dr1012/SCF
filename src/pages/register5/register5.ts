import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { ShareProvider } from '../../providers/share/share';
import { Questionnaire0Page } from '../questionnaire0/questionnaire0';
import { File } from '@ionic-native/file';


@Component({
  selector: 'page-register5',
  templateUrl: 'register5.html'
})
export class Register5Page {

  addressInput='';
  postcodeInput='';




  constructor(public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {}
    

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }

  public goRegister6(){
    if(this.addressInput && this.postcodeInput){

      this.shareprovider.addElements(this.addressInput); //this push function apends values. Does not delete what is already  there
      this.shareprovider.addElements(this.postcodeInput);
      console.log(this.shareprovider.getElements()); 
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

  
}

