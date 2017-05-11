import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import  { check } from 'meteor/check';
import { IsLoggedIn } from '../../lib/helpers.jsx';

export const Tasks = new Mongo.Collection('tasks');

globalTaskId = "";

Meteor.methods({
    'tasks.remove'(taskId) {
        check(taskId, Object);

        if(!IsLoggedIn) {
            throw new  Meteor.error('not-authorized');
        }

        Tasks.remove(taskId);
    },

    'tasks.findTask'(taskId) {
        return Tasks.findOne({_id: taskId});
    },

    'tasks.setCheckedOut' (taskId, setCheckedOut) {
        check(taskId, String);
        check(setCheckedOut, Boolean);

        Tasks.update(taskId, { $set: { checkedOut: setCheckedOut } });
    },

    'tasks.insert'(text) {
        check(text, String);

        Tasks.insert({
            text,
            user: Meteor.user().emails[0].address,
            createdAt: new Date()
        });
    }

});