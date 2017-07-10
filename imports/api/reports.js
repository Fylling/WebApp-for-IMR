/**
 * Created by sebastian on 10.07.17.
 */
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';


//export const Reports = new Mongo.Collection('reports');
export const remote = DDP.connect('http://172.16.251.182:3030/');
export const Reports = new Meteor.Collection('reports', remote);