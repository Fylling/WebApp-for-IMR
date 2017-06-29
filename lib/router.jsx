import React from 'react';
import {mount} from 'react-mounter';

import { MainLayout } from '../imports/ui/pages/MainLayout.jsx';
import Header from '../imports/ui/components/Header.jsx';
import ListContainer from '../imports/ui/components/List.jsx';
import Login from '../imports/ui/pages/Login.jsx';
import Home from '../imports/ui/pages/Home.jsx';
import { IsLoggedIn } from '../lib/helpers.jsx';


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

FlowRouter.route('/reports/', {
    name: "Reports",
    triggersEnter: checkLoggedIn,
    action() {

        renderMainLayoutWith(<ListContainer/>)
    }
});






FlowRouter.route('/reports/:_id', {
    name: "Report",
    triggersEnter: checkLoggedIn,
    action: function(params) {
        console.log("Param: ", params);

        mount(MainLayout, {
            header: <Header/>,
            content: (<ListContainer _id={params}/>)
        })
    }
});

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('Home');
    }
};

