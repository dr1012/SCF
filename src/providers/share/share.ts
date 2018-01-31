
////////////////////////////////////////////////////////////////////////////////////////////////
/*
This file share.ts is adapted from https://www.lynda.com/Ionic-tutorials/Ionic-3-0-Mobile-App-Developers/562260-2.html?srchtrk=index%3A1%0Alinktypeid%3A2%0Aq%3AIonic+3.0+for+Mobile+App+Developers%0Apage%3A1%0As%3Arelevance%0Asa%3Atrue%0Aproducttypeid%3A2


*/
////////////////////////////////////////////////////////////////////////////////////////////////
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ShareProvider {

    private registration_info = {};
    private user_id = 0;




    constructor(public http: HttpClient) {
        console.log('Hello ShareProvider Provider');
    }


    /**
     * This method adds a key:value pair to the registration_info object. 
     * @param key 
     * @param value 
     */
    updateRegistrationInfo(key, value) {
        this.registration_info[key] = value;
    }
    /**
     * This method returns the registrion_info object. 
     */
    getRegistrationInfo() {
        return this.registration_info;
    }

    /**
     * This method returns the value of the user_id variable. 
     */
    getUserId() {
        return this.user_id;
    }
    /**
     * This method sets the value of the user_id variable.
     * @param user_id 
     */
    setUserId(user_id) {
        this.user_id = user_id;
    }



    /**
     * This method deletes the elemet with key 'key' from the registration_info object
     * @param key 
     */
    deleteItemFromRegistration(key) {
        delete this.registration_info[key];
    }

    /**
     * This method resets the registrion_info object. 
     */
    resetRegistration() {
        this.registration_info = {};
    }



}
