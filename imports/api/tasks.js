import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import  { check } from 'meteor/check';
import { IsLoggedIn } from '../../lib/helpers.jsx';

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

    'tasks.setCheckedOut' (taskId, setCheckedOut) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(taskId, String);
        check(setCheckedOut, Boolean);

        Tasks.update(taskId, { $set: { checkedOut: setCheckedOut } });
    },

    'tasks.insert'(text, geoTag, amount, depth, reportFeedback, checkedOut=false) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(text, String);
        check(amount, Number);
        check(depth, String);
        check(checkedOut, Boolean)

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

        });
    },

    'tasks.sendFeedback' (taskId, reportFeedback) {
        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }
        check(reportFeedback, String);

        Tasks.update(taskId, { $set: { reportFeedback: reportFeedback}});

    },

});