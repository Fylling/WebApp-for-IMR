import React from 'react';
import {mount} from 'react-mounter';
import {Meteor} from 'meteor/meteor';

import { MainLayout } from '../imports/ui/pages/MainLayout.jsx';
import Header from '../imports/ui/components/Header.jsx';
import ListContainer from '../imports/ui/components/List.jsx';
import Login from '../imports/ui/pages/Login.jsx';
import Home from '../imports/ui/pages/Home.jsx';
import { IsLoggedIn } from '../lib/helpers.jsx';
import ViewReport from "../imports/ui/components/viewReport";
import MyMap from '../imports/ui/components/GoogleMaps/MyMap.jsx';

if(Meteor.isClient) {
    Meteor.startup(function () {
        console.log("GoogleMaps loading");
        GoogleMaps.load({key: 'AIzaSyD1qlkvidSHsU8eqUTUjQ-KVD_nPI8uCRg'});
        console.log("Googlemaps loaded");
    });
}

//Hjelpe funksjoner
function checkLoggedIn(context, doRidirect) {
    if(!IsLoggedIn()) {
        doRidirect('/login');
    }
}

function checkLoggedInAndReportId(context, doRedirect) {
    if(!IsLoggedIn()) {
        doRedirect('/login');
    }
    if(Session.get('report.id') === false || Session.get('report.id') === undefined) {
        doRedirect('/reports')
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
    triggersEnter: checkLoggedIn,
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
        //Meteor.call('getReports');
        renderMainLayoutWith(<ListContainer/>)
    }
});

FlowRouter.route('/report/', {
    name: "viewReport",
    triggersEnter: checkLoggedInAndReportId,
    action() {
        renderMainLayoutWith(<ViewReport reportId={Session.get('report.id')}/>)
    }
});

FlowRouter.route('/reports/:category', {
    name: "Report",
    triggersEnter: checkLoggedIn,
    action: function(params) {
        console.log("Param: ", params.category);

        mount(MainLayout, {
            header: <Header/>,
            content: (<ListContainer category={params.category}/>)
        })
    }
});

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('Home');
    }
};

