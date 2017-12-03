import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the ShareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShareProvider {
  private new_registration =  []; 
  private registration_info = {};
  private user_id=0;

  constructor(public http: HttpClient) {
    
  }

getFirstName(){
  return this.new_registration[0];
} 

getLastName(){
  return this.new_registration[1];
}   

getElements(){
 return this.new_registration;
}

clear(){
  this.new_registration = [];
}

addElements(element){
  this.new_registration.push(element);
}

updateREgistrationInfo(key, value){
  this.registration_info[key]=value;
}

getRegistrationInfo(){
  return this.registration_info;
}

getRegistrationInfoElemet(key){
  return this.registration_info[key];
}
getUserid(){
  return this.user_id;
}
setUserId(user_id){
  this.user_id=user_id;
}
}
