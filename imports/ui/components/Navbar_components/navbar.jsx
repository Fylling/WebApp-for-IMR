import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import {IsLoggedIn} from '../../../../lib/helpers.jsx';

import ValidatedReportsDropDown from './validatedReportsDropDown.jsx';

export default class header extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: IsLoggedIn()
        };
    }

    handleLogout() {
        Meteor.logout((error) => {
            if(error) {
                console.log(error.reason);
            } else {
                this.setState({isLoggedIn: false});
                localStorage.removeItem('userMail');
                localStorage.removeItem('report.id');
                localStorage.removeItem('validated');
                FlowRouter.go('/login');
            }
        });
    }

    unValidatedReportCategory(category){
        localStorage.setItem('validated', false);
        FlowRouter.setParams({category: category});
        FlowRouter.go('/unvalidatedreports/' + category);
    }

    unValidatedFishReports(e){
        e.preventDefault();
        this.unValidatedReportCategory("Fiske art");
    }
    unValidatedCoralReports(e){
        e.preventDefault();
        this.unValidatedReportCategory("Koral");
    }
    unValidatedUnknownReports(e){
        e.preventDefault();
        this.unValidatedReportCategory("Fremmed art");
    }
    unValidatedAllReports(e){
        e.preventDefault();
        this.unValidatedReportCategory("Alle");
    }

    render(){
        return(
            <Navbar>
                <Navbar.Header>
                    <NavbarBrand>
                        <a href="/">IMR</a>
                    </NavbarBrand>
                </Navbar.Header>
                <Nav>
                    {IsLoggedIn() ? <NavItem onClick={this.handleLogout.bind(this)}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>}
                    {
                        IsLoggedIn() ? <NavDropdown title="Uvaliderte Rapporter" id="report-category-dropdown">
                            <MenuItem onClick={this.unValidatedFishReports.bind(this)}>Fiske art rapporter</MenuItem>
                            <MenuItem onClick={this.unValidatedCoralReports.bind(this)}>Koral rapporter</MenuItem>
                            <MenuItem onClick={this.unValidatedUnknownReports.bind(this)}>Fremmed art rapporter</MenuItem>
                            <MenuItem onClick={this.unValidatedAllReports.bind(this)}>Se alle rapporter</MenuItem>
                        </NavDropdown> : null
                    }

                    {IsLoggedIn() ? <ValidatedReportsDropDown/> : null}
                </Nav>

            </Navbar>
        )
    }
}