/**
 * Created by sebastian on 10.07.17.
 */
/**
 * Created by sebas on 03.05.2017.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { DDP } from 'meteor/ddp-client';

import Markers from '../imports/ui/components/GoogleMaps/markers.jsx';

//Reports komponent - her ligger alle rapportene lagret
export const remote = DDP.connect('http://172.16.251.182:3030/');
export const Reports = new Mongo.Collection('reports');

export const adminPageFields = {"text": 1, "user": 1, "isValidated": 1,
    "checkedOut": 1, "scientist": 1, "category": 1, "createdAt": 1};

Reports.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

if (Meteor.isServer) {
    //This code only runs on the server

    Meteor.publish('reports', function reportsPublication(limit, fields) {
        if(limit < 0){
            limit = 10;
        }
        return Reports.find({ owner: this.userId }, {sort: {createdAt: -1}, fields: fields,
            limit: limit });
    });

    Meteor.publish('reports.test', function reportsPublication() {
        return Reports.find({ owner: this.userId }, {sort: {createdAt: -1} });
    });

    Meteor.publish('reports.reportingToolList', function reportsPublication( fields, userId, limit ){
        if(limit < 0){
            limit = 10;
        }
        return Reports.find({owner: userId}, {sort: { createdAt: -1}, limit: limit, fields: fields});
    });

    Meteor.publish('reports.adminPageList', function reportsPublication(validated, fields, limit){
        if(limit < 0){
            limit = 10;
        }
        return Reports.find({isValidated: validated}, { limit: limit, sort: { createdAt: -1},
            fields: adminPageFields});
    });

    Meteor.publish('reports.adminPageListWithCategory', function reportsPublication(category, validated, fields, limit){
        if(limit < 0){
            limit = 10;
        }
        return Reports.find({isValidated: validated, category: category}, { limit: limit, sort: { createdAt: -1},
            fields: adminPageFields});
    });

    Meteor.publish('reports.findOne', function reportsPublication(rId, fields){
        return Reports.find({_id: rId}, {fields: fields});
    });

    Meteor.startup( function() {
        let username = encodeURIComponent("sebastianfroyen@gmail.com");
        let pass = encodeURIComponent("Rhkwxexty69");
        let domain = "smtp.gmail.com";
        let port = 587;
        process.env.MAIL_URL="smtp://" + username + ":" + pass + "@" + domain + ":" + port;
    })

}

//Metoder for å legge til, slette og oppdateres
Meteor.methods({
    'sendVerificationLink'(user){
        let userId = user ? user : Meteor.userId();

        if(userId){
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'sendPassRecoveryLink'(email){
        let user = Meteor.users.findOne({address: email});
        if(user){
            Accounts.forgotPassword({email: email},function(err){
                if(err){
                    console.log(err.reason);
                } else {
                    console.log("It worked");
                }
            });
        }
    },

    'sendAEmail'(userEmail, reportName){
        console.log(userEmail);
        if(Meteor.isServer) {
            console.log("Sending email");
            Email.send({
                from: "sebastianfroyen@gmail.com",
                to: userEmail,
                subject: reportName + " har blitt validert av forskerne hos IMR.",
                text: "Tilbakemelding for " + reportName + " er tilgjengelig.",
            });
        }
    },

    'reports.insert'(titelText, /*substrartInput,*/ lengdeNr, img, posLat, posLong,
                     depthInput, amountInput, markerId, useCurrPos, category, date, mail, brukerId){
        check(titelText, String);
        check(img, [String]);
        //check(lengdeNr, Number);
        check(posLat, Number);
        check(posLong, Number);
        //check(depthInput, Number);
        //check(amountInput, Number);
        //check(markerId, String);
        check(useCurrPos, Boolean);
        check(category, String);
        check(mail, String);
        check(brukerId, String);

        if(lengdeNr){ check(lengdeNr, Number); }
        if(depthInput){ check(depthInput, Number); }
        if(amountInput){ check(amountInput, Number); }
        if(markerId){ check(markerId, String); }

        if(!date){
            date = new Date();
            console.log(date);
        } else {
            check(date, String);
        }

        //Make sure user is logged in before inserting a report
        if(!brukerId){
            throw new Meteor.Error('not-authorized');
        }
        if(useCurrPos) {
            Markers.insert({lat: posLong, lng: posLat, markerCreated: false});
            markerId = Markers.findOne({markerCreated: false})._id;
            Markers.update(markerId, {
                $set: {markerCreated: true}
            });
        }

        console.log(brukerId);
        Reports.insert({
            text: titelText,
            length: lengdeNr,
            photo: img,
            user: mail,
            latitude: posLat,
            longitude: posLong,
            depth: depthInput,
            amount: amountInput,
            markerId: markerId,
            createdAt: new Date(),
            taken: date,
            category: category,
            owner: brukerId,
            isValidated: false,
            checkedOut: false,
            reportFeedback: '',
            scientist: ''
        }, function(err, res){
            if(err){
                console.log(err.reason);
            }
        });
        console.log(brukerId);
    },


    'reports.setCheckedOut'(id, checkedOut, scientistEmail){
        check(id, String);
        check(checkedOut, Boolean);
        Reports.update(id, {
            $set: {checkedOut: checkedOut, scientist: scientistEmail}
        });
    },

    'reports.updateFeedback'(reportId, feedback){
        check(feedback, String);
        Reports.update(reportId, {
            $set: {reportFeedback: feedback, isValidated: true, checkedOut: true}
        });
        /*Reports.update(reportId, {
         $set: {isValidated: true}
         });*/
    },
});