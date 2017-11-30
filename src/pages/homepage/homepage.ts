import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Register0Page } from '../register0/register0';
import { LogoutPage } from '../logout/logout';

import * as papa from 'papaparse';
import { Http } from '@angular/http'

import { File } from '@ionic-native/file';

import { sqlitedatabase } from '../../providers/sqlitedatabase/sqlitedatabase'

@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomepagePage {

  volunteers: string[] = [];
  

  constructor(public file: File, private sqlitedatabase :sqlitedatabase, public navCtrl: NavController, private http: Http){}
  
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }goToRegister0(){
    this.navCtrl.push(Register0Page);
  }goToLogout(){
    this.navCtrl.push(LogoutPage);
  }

test(){
  
  //console.log("test without Json.stringify:  " + this.retrieveVolunteers);
  //console.log("test with .toStrig method:   "  + this.retrieveVolunteers.toString);
  //console.log("test with Json.stringify:   "  + JSON.stringify(this.retrieveVolunteers));
  console.log(JSON.stringify(this.volunteers));
  console.log(this.volunteers.toString);
  console.log(this.volunteers[0].toString);
}


data_to_CSV(){
  
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


retrieveVolunteers(){
  this.volunteers = [];
  this.sqlitedatabase.db.executeSql('select *  From volunteers;',{})
  .then((data) => {

    if(data==null){
      console.log("no data in table");
    }

    if(data.rows){
      if(data.rows.length>0){
        for(var i=0; i<data.rows.length; i++){
          this.volunteers.push(data.rows.item(i));
        }
        
      }
    }
  });
}


}
