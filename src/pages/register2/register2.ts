import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register3Page } from '../register3/register3';
import { ShareProvider } from '../../providers/share/share';



@Component({
  selector: 'page-register2',
  templateUrl: 'register2.html'
})
export class Register2Page {
  lastNameInput = '';


  constructor(public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }

  public goRegister3(){
    if(this.lastNameInput){
  
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

