import React from 'react';
import { Meteor } from 'meteor/meteor';

import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
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
        Meteor.call('tasks.insert', "Torsk", "Denne jobbes på nå av en annen forsker" , 1, "7 meter", "");
        Meteor.call('tasks.insert', "Sild", "Denne jobbes på nå av en annen forsker" , 1, "7 meter", "");
        Meteor.call('tasks.insert', "Hai", "Denne jobbes på nå av en annen forsker" , 1, "7 meter", "");
        Meteor.call('tasks.insert', "Kveite", "Denne jobbes på nå av en annen forsker" , 1, "7 meter", "");

    },

    reportDropDown(){
        return IsLoggedIn() ? <NavDropdown eventKey={3} title="Reports">
            <MenuItem eventKey={3.1}>Fiske art rapporter</MenuItem>
            <MenuItem eventKey={3.2}>Koral rapporter</MenuItem>
            <MenuItem eventKey={3.3}>Fremmed art rapporter</MenuItem>
        </NavDropdown> : null;
    },

    render() {
        let loginButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.handleLogout}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>;
        let reportButton = IsLoggedIn() ?
            <NavItem eventKey={1} href="/reports">Reports</NavItem>
            : "";
        let button = IsLoggedIn() ?  <NavItem eventKey={2} href="/reports" onClick={this.insertMethod}>legg til</NavItem> : "";
        let googleMapBtn = (
            <NavItem eventKey={1} href="/map" >
                Google map
            </NavItem>
        );
        return(
            <Navbar>
                <Navbar.Header>
                    <NavbarBrand>
                        <a href="/">IMR</a>
                    </NavbarBrand>
                </Navbar.Header>
                <Nav>
                    {loginButton}

                    {reportButton}

                    {button}
                    {this.reportDropDown()}
                </Nav>

            </Navbar>

        )
    }
});

export default Header;