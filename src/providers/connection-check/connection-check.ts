import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';


@Injectable()
export class ConnectionCheckProvider {

  connected : boolean;
  
  constructor(public http: HttpClient, private network: Network) {
this.connectionStatus();
  }

public connectionStatus(){
  if (this.network.type == 'unknown' || this.network.type == 'none'){
    this.connected = false;
    console.log("no network connection")
  }
  else{
    this.connected = true;
    console.log("network connection established")
  }
  
}









}
