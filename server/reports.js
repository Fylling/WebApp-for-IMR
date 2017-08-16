/**
 * Created by sebastian on 10.07.17.
 */
/**
 * Created by sebas on 03.05.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import {Email} from 'meteor/email';
import {DDP} from 'meteor/ddp-client';
import SimpleSchema from 'simpl-schema';
import {Schemas} from './schemaValidator.js';

import Markers from '../imports/ui/components/GoogleMaps/markers.jsx';

//Reports komponent - her ligger alle rapportene lagret
export const remote = DDP.connect('http://hi-07586.imr.no:3030/');
export const Reports = new Mongo.Collection('reports');
export const Images = new Mongo.Collection('images');

export const AmountOfReports = new Mongo.Collection('amountOfReports');

export const validReports = {total: 0, fish: 0, coral: 0, unknown: 0};
export const invalidReports = {total: 0, fish: 0, coral: 0, unknown: 0};


export const adminPageFields = {
    'text': 1, 'user': 1, 'isValidated': 1,
    'checkedOut': 1, 'scientist': 1, 'category': 1, 'createdAt': 1,
    'longitude': 1, 'latitude': 1, 'validSpecie': 1
};

const reportingToolListFields = {
    text: 1, user: 1,
    isValidated: 1, createdAt: 1,
    scientist: 1, category: 1, owner: 1,
    markerId: 1, taken: 1, validSpecie: 1
};

Meteor.startup(function () {
    Reports.attachSchema(Schemas.Reports);

    let reportlist = Reports.find({}, {fields: {isValidated: 1, category: 1}});
    AmountOfReports.remove({});
    reportlist.forEach((r) => {
        if (r.isValidated) {
            validReports.total = validReports.total + 1;
            if (r.category === "Fiske art") {
                validReports.fish = validReports.fish + 1;
            } else if (r.category === "Koral") {
                validReports.coral = validReports.coral + 1;
            } else {
                validReports.unknown = validReports.unknown + 1;
            }
        } else {
            invalidReports.total = invalidReports.total + 1;
            if (r.category === "Fiske art") {
                invalidReports.fish = invalidReports.fish + 1;
            } else if (r.category === "Koral") {
                invalidReports.coral = invalidReports.coral + 1;
            } else {
                invalidReports.unknown = invalidReports.unknown + 1;
            }
        }
    });

    AmountOfReports.insert({
        valid: true,
        total: validReports.total,
        fish: validReports.fish,
        coral: validReports.coral,
        unknown: validReports.unknown

    });
    AmountOfReports.insert({
        valid: false,
        total: invalidReports.total,
        fish: invalidReports.fish,
        coral: invalidReports.coral,
        unknown: invalidReports.unknown
    });
    console.log(validReports);
    console.log(invalidReports);
});

Reports.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
});

if (Meteor.isServer) {
    //This code only runs on the server

    Meteor.publish('reports.amount', function (valid) {
        return AmountOfReports.find({valid: valid}, {fields: {valid: 1, total: 1, fish: 1, coral: 1, unknown: 1}});
    });

    Meteor.publish('user.sendEmail', () => {
        return Meteor.users.findOne(this.userId);
    });

    Meteor.publish('reports', function reportsPublication(limit, fields) {
        limit = limit < 0 || !limit ? 10 : limit;
        return Reports.find({owner: this.userId}, {
            sort: {createdAt: -1}, fields: fields,
            limit: limit
        });
    });

    Meteor.publish('reports.reportingToolList', function reportsPublication(userId, limit) {
        limit = limit < 0 || !limit ? 10 : limit;
        return Reports.find({owner: userId}, {sort: {createdAt: -1}, limit: limit, fields: reportingToolListFields});
    });

    Meteor.publish('reports.adminMap', function reportsPublication(validated) {
        return Reports.find({isValidated: validated}, {
            sort: {createdAt: -1},
            fields: adminPageFields
        });
    });

    Meteor.publish('reports.adminMapWithCategory', function reportsPublication(category, validated, fields, limit) {
        limit = limit < 0 || !limit ? 10 : limit;
        return Reports.find({isValidated: validated, category: category}, {
            limit: limit,
            fields: adminPageFields
        });
    });

    Meteor.publish('reports.adminPageList', function reportsPublication(validated, fields, limit, sort, page) {
        limit = limit < 0 || !limit ? 10 : limit;
        page = page < 0 || !page ? 0 : page * limit;
        console.log('reports.adminPageList');
        console.log(page);
        return Reports.find({isValidated: validated}, {
            skip: page,
            limit: limit, sort: sort,
            fields: adminPageFields
        });
    });

    Meteor.publish('reports.adminPageListWithCategory', function reportsPublication(category, validated, fields, limit, sort, page) {
        limit = limit < 0 || !limit ? 10 : limit;
        page = page < 0 || !page ? 0 : page * limit;
        console.log('reports.adminPageListWithCategory');
        console.log(page);
        return Reports.find({isValidated: validated, category: category}, {
            skip: page, limit: limit,
            fields: adminPageFields
        });
    });

    Meteor.publish('reports.all', (fields) => {
        if (this.userId()) {
            return Reports.find({isValidated: true}, {fields: fields});
        }
    });

    Meteor.publish('reports.findOne', function reportsPublication(rId, fields) {
        return Reports.find({_id: rId}, {fields: fields});
    });

    Meteor.startup(function () {
        let username = encodeURIComponent("sebastianfroyen@gmail.com");
        let pass = encodeURIComponent("Rhkwxexty69");
        let domain = "smtp.gmail.com";
        let port = 587;
        process.env.MAIL_URL = "smtp://" + username + ":" + pass + "@" + domain + ":" + port;
    })

}

//Metoder for å legge til, slette og oppdateres
Meteor.methods({


    'sendVerificationEmail'(user) {
        let userId = user ? user : Meteor.userId();

        if (userId) {
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'sendPassRecoveryLink'(email) {
        let user = Meteor.users.findOne({address: email});
        if (user) {
            Accounts.forgotPassword({email: email}, function (err) {
                if (err) {
                    console.log(err.reason);
                } else {
                    console.log("It worked");
                }
            });
        }
    },

    'sendAEmail'(userEmail, reportName) {
        let emailText;
        let emailSubject;
        if (reportName) {
            emailText = "Tilbakemelding for " + reportName + " er tilgjengelig.";
            emailSubject = reportName + " har blitt validert av forskerne hos IMR.";
        } else {
            emailText = "En ny rapport har blitt sendt inn";
            emailSubject = "Ny rapport"
        }

        console.log(userEmail);
        if (Meteor.isServer) {
            console.log("Sending email");
            Email.send({
                from: "sebastianfroyen@gmail.com",
                to: userEmail,
                subject: emailSubject,
                text: emailText,
            });
        }
    },

    'sendEmailToAll'() {
        if (Meteor.isServer) {
            let userList = Meteor.users.find();
            userList.forEach((user) => {
                if (user.profile.sendEmail) {
                    Meteor.call('sendAEmail', user.emails[0].address);
                }
            })
        }
    },

    'reports.insert'(titelText, lengdeNr, img, posLat, posLong,
                     depthInput, amountInput, useCurrPos, category, date, mail, brukerId) {

        console.log("brukeriden som ble sendt fra klient");
        console.log(brukerId);

        console.log(typeof titelText + " titel");
        check(titelText, String);
        check(img, [String]);
        check(posLat, Number);
        check(posLong, Number);
        //check(useCurrPos, Boolean);
        console.log(typeof category + " category");
        check(category, String);
        console.log(typeof mail + " email");
        check(mail, String);

        titelText = titelText.charAt(0).toUpperCase() + titelText.slice(1).toLowerCase();

        if (lengdeNr) {
            check(lengdeNr, Number);
        }
        if (depthInput) {
            check(depthInput, Number);
        }
        if (amountInput) {
            check(amountInput, Number);
        }

        if (!date) {
            date = new Date();
        } else {
            date = new Date(date);
            check(date, Date);
        }

        //Make sure user is logged in before inserting a report
        if (!brukerId) {
            throw new Meteor.Error('not-authorized');
        }

        Reports.insert({
            text: titelText,
            length: lengdeNr,
            photo: img,
            user: mail,
            latitude: posLat,
            longitude: posLong,
            depth: depthInput,
            amount: amountInput,
            createdAt: new Date(),
            taken: date,
            category: category,
            owner: brukerId,
            isValidated: false,
            checkedOut: false,
            reportFeedback: '',
            scientist: '',
            validSpecie: ''
        }, function (err, res) {
            if (err) {
                console.log("error");
                console.log(err);
            } else if (res) {
                console.log("success");
                console.log(res);
                Meteor.call('sendEmailToAll');
            }
        });
    },

    'reports.validateSpecies'(rId, species) {
        check(rId, String);
        check(species, String);
        Reports.update(rId, {
            $set: {validSpecie: species}
        });

    },

    'reports.changeValidateSpecies'(rId, species) {
        check(rId, String);
        check(species, String);
        Reports.update(rId, {
            $set: {validSpecie: species}
        });
    },

    'reports.setCheckedOut'(id, checkedOut, scientistEmail) {
        check(id, String);
        check(checkedOut, Boolean);
        Reports.update(id, {
            $set: {checkedOut: checkedOut, scientist: scientistEmail}
        });
    },

    'reports.updateFeedback'(reportId, feedback) {
        check(feedback, String);
        Reports.update(reportId, {
            $set: {reportFeedback: feedback}
        });
    },

    'reports.validateReport'(id) {
        Reports.update(id, {
            $set: {isValidated: true, checkedOut: true}
        });
    },

    'setSendEmail'() {
        console.log("setsendemail");
        try {
            let user = Meteor.users.findOne(Meteor.userId());

            let setObject = {};
            let sendEmail = "sendEmail";
            setObject[sendEmail] = user.profile.sendEmail ? !user.profile.sendEmail : true;

            Meteor.users.update(Meteor.userId(), {
                $set: {profile: setObject}
            })
        } catch (e) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: {sendEmail: false}}});
            console.log(e.message);
        }
    },

    'checkSendEmail'() {
        if (Meteor.userId()) {
            try {
                console.log("in try");
                let user = Meteor.users.findOne(Meteor.userId());
                if (user.profile === undefined) {
                    Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: {sendEmail: false}}});
                }
                console.log("Finished try");

            } catch (e) {
                console.log(e.message);
            }
        }
    }
});