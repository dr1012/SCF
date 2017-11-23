import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register2Page } from '../register2/register2';
import { ShareProvider } from '../../providers/share/share';




@Component({
  selector: 'page-register1',
  templateUrl: 'register1.html'
})
export class Register1Page {
  firstNameInput = '';
 
 


  constructor(public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    
  }

  

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  public goRegister2(){
   
    if(this.firstNameInput){

   this.shareprovider.addElements(this.firstNameInput); //this push function apends values. Does not delete what is already  there
console.log(this.shareprovider.getElements()); //testing the array

    this.navCtrl.push(Register2Page);
    }
    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your First Name",
      });
      addTodoAlert.present();
    }
    

  }

  
}
