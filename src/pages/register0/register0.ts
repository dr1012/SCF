import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomepagePage } from '../homepage/homepage';
import { Register1Page } from '../register1/register1';


@Component({
  selector: 'page-register0',
  templateUrl: 'register0.html'
})
export class Register0Page {


  constructor(public navCtrl: NavController,  private alertController: AlertController) {
  }
  
  goToHomepage(){
    this.navCtrl.push(HomepagePage);
  }
  goBack(){
    this.navCtrl.pop();
  }
  goRegister1(){

    this.navCtrl.push(Register1Page);

  }
  Not16(){
    let addTodoAlert=this.alertController.create({
      title: "Warning!!", 
      message: "You have to be at least 16 years old to register. Please contact a member of staff",
    });
    addTodoAlert.present();
  }


}
