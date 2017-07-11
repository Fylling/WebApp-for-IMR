import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import  { check } from 'meteor/check';
import {DDP} from 'meteor/ddp-client';
import { Email } from 'meteor/email';
import { IsLoggedIn, loggedIn } from '../../lib/helpers.jsx';

//Representerer vår server som vi ikke har fått tid til å sette opp enda
export const Tasks = new Mongo.Collection('tasks');
export const remote = DDP.connect('http://172.16.251.212:3000/');
export const Reports = new Meteor.Collection('reports', remote);


if(Meteor.isServer) {
    Meteor.publish('reports.list', function reportsPublication(){
        return Reports.find({isValidated: false}, {sort: {createdAt: -1}});
    });

    /*
    Meteor.publish('reports.findOne', function reportPublication(rId){
        return Reports.find({_id: rId});
    });
    */

    Meteor.publish('tasks', function taskPublication() {
        return Tasks.find();
    });

    Meteor.publish('findTask', function findOneTask(taskId) {
        let data = Tasks.find({_id: taskId}, { fields: { 'user': 1 }});

        if(data) {
            return data;
        }

        return this.ready();
    });

    Meteor.startup( function() {
        let username = encodeURIComponent("sebastianfroyen@gmail.com");
        let pass = encodeURIComponent("Rhkwxexty69");
        let domain = "smtp.gmail.com";
        let port = 587;
        process.env.MAIL_URL="smtp://" + username + ":" + pass + "@" + domain + ":" + port;
    })
}


Meteor.methods({

    'getReports'(){
        remote.subscribe('reports.adminPage', function () {
            let reports = Reports.find({isValidated: false}, {sort: {createdAt: -1}});
            console.log("Antall reports: " + reports.count());
        });
    },

    /*'sendAEmail'(userEmail, reportName){
        console.log(userEmail);
        //this.unblock();
        if(Meteor.isServer) {
            console.log("Sending email");
            Email.send({
                from: "sebastianfroyen@gmail.com",
                to: userEmail,
                subject: reportName + " har blitt validert av forskerne hos IMR.",
                text: "Tilbakemelding for " + reportName + " er tilgjengelig.",
            });
        }
    },*/

    'check.reports'(){
        let rep = Reports.find();
        rep.forEach(function(r){
            console.log(r.text + " Sjekk");
        })
    },

    'tasks.remove'(taskId) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }

        Tasks.remove(taskId);
    },

    'tasks.findTask'(taskId) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(taskId, String);

       return Tasks.findOne({_id: taskId});

    },

    //Endres når en forsker sjekker ut en rapport
    'tasks.setCheckedOut' (taskId, setCheckedOut) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(taskId, String);
        check(setCheckedOut, Boolean);

        Tasks.update(taskId, { $set: { checkedOut: setCheckedOut } });
    },

    /*'reports.setCheckedOut'(id, checkedOut, scientistEmail){
        check(id, String);
        check(checkedOut, Boolean);
        Reports.update(id, {
                $set: {checkedOut: checkedOut, scientist: scientistEmail}
            });

    },*/

    /*'reports.updateFeedback'(reportId, feedback){
        Reports.update(reportId, {
            $set: {reportFeedback: feedback, isValidated: true}
        });
        /*Reports.update(reportId, {
            $set: {isValidated: true}
        });
    },*/

    /*'reports.insert'(r){
        Tasks.insert({
            text: r.text,
            length: r.length,
            photo: r.photo,
            user: r.user,
            latitude: r.latitude,
            longitude: r.longitude,
            depth: r.depth,
            amount: r.amount,
            markerId: r.markerId,
            createdAt: r.createdAt,
            taken: r.date,
            category: r.category,
            //substrart: substrartInput,
            owner: r.owner,
            isValidated: r.isValidated,
            checkedOut: r.checkedOut,
            reportFeedback: '',
        });

        console.log("Antall reports: " + Tasks.find().count());
    },*/

    //Legger feedback inn i rapporten og setter validert til true
    'tasks.sendFeedback' (taskId, reportFeedback) {
        if (!IsLoggedIn) {
            throw new Meteor.error('not-authorized');
        }
        check(reportFeedback, String);

        Tasks.update(taskId, {$set: {reportFeedback: reportFeedback, isValidated: true}});

    },

    // Sender email til den som har sendt inn rapporten
    'tasks.sendEmail' (to, from, subject, text) {

        check([to, from, subject, text], [String]);
        // La andre metodekall fra klien kjøre, uten å måtte vente på at emailen skal bli sendt
        this.unblock();
        Email.send({ to, from, subject, text });
    },


});