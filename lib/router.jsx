import React from 'react';
import {mount} from 'react-mounter';
import {Meteor} from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

import { MainLayout } from '../imports/ui/pages/MainLayout.jsx';
import Header from '../imports/ui/components/Navbar_components/navbar.jsx'
import ListContainer from '../imports/ui/pages/List.jsx';
import Login from '../imports/ui/pages/Login.jsx';
import Home from '../imports/ui/pages/Home.jsx';
import { IsLoggedIn } from '../lib/helpers.jsx';
import ViewReport from "../imports/ui/pages/viewReport";
import MyMap from '../imports/ui/components/GoogleMaps/MyMap.jsx';

if(Meteor.isClient) {
    Meteor.startup(function () {


        process.UNIVERSE_I18N_LOCALES='all';
        //process.env.UNIVERSE_I18N_LOCALES = 'nb-NO';
        if(localStorage.getItem('language')){
            i18n.setLocale(localStorage.getItem('language'))
        } else {
            i18n.setLocale('nb-NO')
        }
        console.log("Here are all languages");
        console.log(i18n.getLanguages());

        GoogleMaps.load({key: 'AIzaSyD1qlkvidSHsU8eqUTUjQ-KVD_nPI8uCRg'});

        AdminConfig = {
            name: 'My App',
            adminEmails: ['sebastianfroyen@gmail.com'],
            collections: {
                reports: {}
            }
        };

    });
}

//Hjelpe funksjoner
function checkLoggedIn(context, doRidirect) {
    if(!IsLoggedIn()) {
        doRidirect('/login');
    }
}

function alreadyLoggedIn(context, doRidirect) {
    if(IsLoggedIn()) {
        doRidirect('/reports')
    }
}

function renderMainLayoutWith(component) {
    mount(MainLayout, {
        header: <Header />,
        content: component,
    });
}

//Routing

FlowRouter.route('/', {
    name: "Home",
    action() {
        renderMainLayoutWith(<Home/>)
    }
});


FlowRouter.route('/login', {
    name: "Login",
    triggersEnter: alreadyLoggedIn,
    action() {
        renderMainLayoutWith(<Login />)
    }
});

FlowRouter.route('/map/', {
    name: "GoogleMap",
    triggersEnter: checkLoggedIn,
    action() {
        renderMainLayoutWith(<MyMap/>)
    }
});

FlowRouter.route('/reports/', {
    name: "Reports",
    triggersEnter: checkLoggedIn,
    action() {
        renderMainLayoutWith(<ListContainer/>)
    }
});

FlowRouter.route('/report/', {
    name: "viewReport",
    triggersEnter: checkLoggedIn,
    action() {
        renderMainLayoutWith(<ViewReport/>)
    }
});

FlowRouter.route('/unvalidatedreports/:category/', {
    name: "ReportsListUnValidated",
    triggersEnter: checkLoggedIn,
    action: function(params) {
        renderMainLayoutWith(<ListContainer category={params.category}/>)
    }
});

FlowRouter.route('/validatedreports/:category/', {
    name: "ReportsListValidated",
    triggersEnter: checkLoggedIn,
    action: function(params) {
        renderMainLayoutWith(<ListContainer category={params.category}/>)
    }
});

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('Home');
    }
};

