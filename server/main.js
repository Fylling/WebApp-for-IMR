/**
 * Created by Danie on 03.05.2017.
 */
import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';


//Sjekk om det finst en adminbruker, opprett en visst ikke.
Meteor.startup(() => {
   if(Meteor.users.find().count() === 0) {
       Accounts.createUser({
           email: "example@mail.com",
           password: "fisk123"
       });
   }
});