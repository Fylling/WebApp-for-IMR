import React, {Component} from 'react';
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
                localStorage.removeItem('report.id');
                FlowRouter.go('/');
            }
        });
    },

    unValidatedReportCategory(category){
        console.log("Category under");
        console.log(category.toString());
        FlowRouter.setParams({category: category});
        FlowRouter.go('/unvalidatedreports/' + category);
    },

    unValidatedFishReports(){
        this.unValidatedReportCategory("Fiske art");
    },
    unValidatedCoralReports(){
        this.unValidatedReportCategory("Koral");
    },
    unValidatedUnknownReports(){
        this.unValidatedReportCategory("Fremmed art");
    },

    render() {
        let loginButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.handleLogout}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>;
        let reportButton = IsLoggedIn() ?
            <NavItem eventKey={1} href="/reports">Reports</NavItem>
            : "";

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

                    {
                        IsLoggedIn() ? <NavDropdown title="Uvaliderte Rapporter" id="report-category-dropdown">
                        <MenuItem onClick={this.unValidatedFishReports}>Fiske art rapporter</MenuItem>
                        <MenuItem onClick={this.unValidatedCoralReports}>Koral rapporter</MenuItem>
                        <MenuItem onClick={this.unValidatedUnknownReports}>Fremmed art rapporter</MenuItem>
                            <MenuItem href="/reports">Se alle rapporter</MenuItem>
                                        </NavDropdown> : null
                    }
                </Nav>

            </Navbar>

        )
    }
});

export default Header;