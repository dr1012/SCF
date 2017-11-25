import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register4Page } from '../register4/register4';
import { ShareProvider } from '../../providers/share/share';



@Component({
  selector: 'page-register3',
  templateUrl: 'register3.html'
})
export class Register3Page {
  emailInput = '';


  constructor(public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
    this.shareprovider.clear();
  }
  goBack(){
    this.navCtrl.pop();
  }

  public goRegister4(){
    if(this.emailInput){
      if(this.emailInput.includes("@")){
  
   this.shareprovider.addElements(this.emailInput); //this push function apends values. Does not delete what is already  there
   console.log(this.shareprovider.getElements()); //testing the array
    this.navCtrl.push(Register4Page);
      }
      else{
        let addTodoAlert=this.alertController.create({
          title: "Warning!!", 
          message: "Please a valid email address",
        });
        addTodoAlert.present();
      }

    }
    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your email address",
      });
      addTodoAlert.present();
    }
    
  
  }

  
}

