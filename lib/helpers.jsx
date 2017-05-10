/**
 * Created by Danie on 09.05.2017.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';


//Hjelpefunksjoner

export function IsLoggedIn() {
    return !! Meteor.userId();
    }



