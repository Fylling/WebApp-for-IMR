import React from 'react';
import { Meteor } from 'meteor/meteor';

import {Navbar, Nav, NavItem } from 'react-bootstrap';
import { IsLoggedIn } from '../../../lib/helpers.jsx';

//Denne komponenter representerer Headeren på siden
Header = React.createClass({
    getInitialState() {
        return {
            isLoggedIn: IsLoggedIn()
        };
    },

    handleLogout() {
        Meteor.logout((error) => {
            if(error) {
                console.log(error.reason);
            } else {
                this.setState({isLoggedIn: !this.state.isLoggedIn});
                FlowRouter.go('/');
            }
        });
    },

    insertMethod() {
        Meteor.call('tasks.insert', "Abbor", "Denne jobbes på nå av en annen forsker" , 1, "7 meter", "");
    },

    render() {
        let loginButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.handleLogout}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>;
        let reportButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports">Reports</NavItem> : "";
        /*let button = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.insertMethod}>legg til</NavItem> : "";*/

        return(
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">IMR</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    {loginButton}
                </Nav>
                <Nav>
                    {reportButton}
                </Nav>
            </Navbar>

        )
    }
});

export default Header;