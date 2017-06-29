import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import  { check } from 'meteor/check';
import {DDP} from 'meteor/ddp-client';
import { IsLoggedIn } from '../../lib/helpers.jsx';
import { Email } from 'meteor/email'

//Representerer vår server som vi ikke har fått tid til å sette opp enda
export const Tasks = new Mongo.Collection('tasks');
let remote = DDP.connect('http://localhost:3000/');
export const Reports = new Meteor.Collection('reports', remote);

remote.subscribe('reports', function() {
    console.log("subscribing");
    let reports = Reports.find();
    console.log("Antall reports: " + reports.count());
    reports.forEach(function(r){
        //console.log(r.text);
        //Meteor.call('reports.insert', r);
        //Meteor.call('check.reports');
    });

});

if(Meteor.isServer) {

    Meteor.publish('reports', function reportsPublication(){
        return Reports.find();
    });

    Meteor.publish('tasks', function taskPublication() {
        return Tasks.find();
    });

    Meteor.publish('findTask', function findOneTask(taskId) {
        let data = Tasks.find({_id: taskId}, { fields: { 'user': 1 }});

        if(data) {
            return data;
        }

        return this.ready();
    })
}


Meteor.methods({

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

    'reports.setCheckedOut'(id, checkedOut){
        check(id, String);
        check(checkedOut, Boolean);
        let r = Reports.findOne({_id: id});
        console.log("HHHHHHHHHH");
        console.log(r.checkedOut);
        Reports.update(id, {
            $set: {checkedOut: checkedOut}
        });
        console.log(r.checkedOut);
    },

    'reports.updateFeedback'(reportId, feedback){
        Reports.update(reportId, {
            $set: {reportFeedback: feedback}
        });
        Reports.update(reportId, {
            $set: {isValidated: true}
        });
    },

    'reports.insert'(r){
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
        Tasks.find().forEach(function(r){
            console.log(r.text);
        });
    },

    //Kun brukt her for testing av databasen
    'tasks.insert'(text, geoTag, amount, depth, reportFeedback, checkedOut=false, isValidated=false,) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(text, String);
        check(amount, Number);
        check(depth, String);
        check(checkedOut, Boolean);
        check(isValidated, Boolean);

        let date = new Date();

        Tasks.insert({
            text,
            user: Meteor.user().emails[0].address,
            submitDate: moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            geoTag,
            amount,
            depth,
            reportFeedback: '',
            checkedOut: false,
            isValidated: false,

        });

    },

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