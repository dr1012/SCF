import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register5Page } from '../register5/register5';
import { ShareProvider } from '../../providers/share/share';



@Component({
  selector: 'page-register4',
  templateUrl: 'register4.html'
})
export class Register4Page {
  telInput = '';


  constructor(public navCtrl: NavController, private alertController: AlertController, private shareprovider: ShareProvider)  {
    
  }

  goToHomepage(){
    this.navCtrl.push(HomepagePage);
    this.shareprovider.clear();
  }
  goBack(){
    this.navCtrl.pop();
  }

  public goRegister5(){
    if(this.telInput){
      if(this.telInput.length==11){
  
   this.shareprovider.addElements(this.telInput); //this push function apends values. Does not delete what is already  there
   console.log(this.shareprovider.getElements()); //testing the array
    this.navCtrl.push(Register5Page);
      }
      else{
        let addTodoAlert=this.alertController.create({
          title: "Warning!!", 
          message: "Please enter a telephone number, for example: 07123456789",
        });
        addTodoAlert.present();

      }
      
      

    }
    else{
      let addTodoAlert=this.alertController.create({
        title: "Warning!!", 
        message: "Please enter your telephone number",
      });
      addTodoAlert.present();
    }
    
  
  }

  
}

