/**
 * Created by Danie on 03.05.2017.
 */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


//Sjekk om det finst en adminbruker, opprett en visst ikke.
Meteor.startup(() => {

    AdminConfig = {
        name: 'My App',
        adminEmails: ['sebastianfroyen@gmail.com'],
        collections: {
            reports: {}
        }
    };

    //process.env.UNIVERSE_I18N_LOCALES = 'nb-NO';

   if(Meteor.users.find().count() === 0) {
       Accounts.createUser({
           email: "example@mail.com",
           password: "fisk123",
           profile : {
               sendEmail: false
           }
       });
       Accounts.createUser({
           email: "sebastianfroyen@gmail.com",
           password: "v95ooa",
           profile : {
               sendEmail: false
           }
       });
       Accounts.createUser({
           email: "sebastian17pepp@gmail.com",
           password: "v95ooa",
           profile : {
               sendEmail: false
           }
       })
   }
});