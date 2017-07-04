/**
 * Created by Danie on 09.05.2017.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


//Hjelpefunksjoner

export function IsLoggedIn() {
    return !! Meteor.userId();
    }

export function loggedIn() {
    console.log("loggedIn fungerer");
    console.log("loggedIn fungerer");
    console.log("loggedIn fungerer");
    console.log("loggedIn fungerer");
    console.log(Accounts.onLogin);
}



