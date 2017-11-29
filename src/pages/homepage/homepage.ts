import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';

import * as papa from 'papaparse';
import { Http } from '@angular/http'

import { WebService } from '../../providers/web-service';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

  items = [];
  atabase: any;
  itemcount: number = 0;

  constructor(public file: File, public webSrv: WebService, public navCtrl: NavController, private http: Http){}
  
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }goToRegister0(){
    this.navCtrl.push(Register0Page);
  }goToLogout(){
    this.navCtrl.push(LogoutPage);
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

data_to_CSV(){
  this.webSrv.ClearDB;
  //this.syncFromDb();
 //let  string_function = this.items.toString;
 //let stringify_function = JSON.stringify(this.items);
 // let csv_data = papa.unparse(this.items);
  // let csv_data_data = papa.unparse(stringify_function)
 // console.log("this.items  = " + this.items);
  //console.log("unparase this.items" + csv_data);
  //console.log("string function" + string_function);
  //console.log("stringify function" + stringify_function);
  //console.log("unparse stringify" + csv_data_data);


  /*this.file.writeFile(this.file.externalRootDirectory, 'volunteers2.txt', csv_data,{replace: true}).then(function(result){
    alert('Success! Export created!');
    console.log(csv_data);
  }, function(err) {
    console.log("ERROR"+err);
  })*/


}


}
