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
                localStorage.removeItem('userMail');
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

    reportCategory(category){
        console.log("Category under");
        console.log(category.toString());
        FlowRouter.setParams({category: category});
        FlowRouter.go('/reports/' + category);
    },

    fishReports(){
        this.reportCategory("Fiske art");
    },
    coralReports(){
        this.reportCategory("Koral");
    },
    unknownReports(){
        this.reportCategory("Fremmed art");
    },

    render() {
        let loginButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.handleLogout}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>;
        let reportButton = IsLoggedIn() ?
            <NavItem eventKey={1} href="/reports">Reports</NavItem>
            : "";
        let button = IsLoggedIn() ?  <NavItem eventKey={2} href="/reports" onClick={this.insertMethod}>legg til</NavItem> : "";

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
                    {
                        IsLoggedIn() ? <NavDropdown title="Reports" id="report-category-dropdown">
                        <MenuItem onClick={this.fishReports}>Fiske art rapporter</MenuItem>
                        <MenuItem onClick={this.coralReports}>Koral rapporter</MenuItem>
                        <MenuItem onClick={this.unknownReports}>Fremmed art rapporter</MenuItem>
                            <MenuItem href="/reports">Se alle rapporter</MenuItem>
                                        </NavDropdown> : null
                    }
                </Nav>

            </Navbar>

        )
    }
});

export default Header;