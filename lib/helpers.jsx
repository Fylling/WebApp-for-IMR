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
    console.log(Accounts.onLogin);
}

export function setPageHelper(total){

    console.log('setPageHelper');

    let page = parseInt(localStorage.getItem('page'));
    
    let sessionLimit = Session.get('limit');
    let localLimit = parseInt(localStorage.getItem('limit'));
    let limit = sessionLimit < localLimit ? localLimit : sessionLimit;

    let previousLimit = page === 0 ? 0 : limit*page-1;
    let nextLimit = (page+1)*limit;

    return total > nextLimit;
}