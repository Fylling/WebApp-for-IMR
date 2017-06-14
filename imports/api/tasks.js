import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import  { check } from 'meteor/check';
import { IsLoggedIn } from '../../lib/helpers.jsx';
import { Email } from 'meteor/email'

//Representerer vår server som vi ikke har fått tid til å sette opp enda
export const Tasks = new Mongo.Collection('tasks');


if(Meteor.isServer) {
    Meteor.publish('tasks', function taskPublication() {
        return Tasks.find();
    }),

    Meteor.publish('findTask', function findOneTask(taskId) {
        var data = Tasks.find({_id: taskId}, { fields: { 'user': 1 }});

        if(data) {
            return data;
        }

        return this.ready();
    })
}


Meteor.methods({

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

    //Kun brukt her for testing av databasen
    'tasks.insert'(text, geoTag, amount, depth, reportFeedback, checkedOut=false, isValidated=false,) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(text, String);
        check(amount, Number);
        check(depth, String);
        check(checkedOut, Boolean);
        check(isValidated, Boolean)

        let date = new Date();

        Tasks.insert({
            text,
            user: Meteor.user().emails[0].address,
            submitDate: moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            geoTag,
            amount,
            depth,
            reportFeedback,
            checkedOut,
            isValidated,

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