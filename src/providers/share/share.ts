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

  constructor(public http: HttpClient) {
    console.log('Hello ShareProvider Provider');
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

getElement(i){
  return this.new_registration[i];
 }


}
