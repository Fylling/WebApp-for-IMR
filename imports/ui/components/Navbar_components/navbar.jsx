import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import { IsLoggedIn } from '../../../../lib/helpers.jsx';

export default class header extends Component{
    constructor(props){
        super(props);
        this.setState = {
            isLoggedIn: IsLoggedIn()
        };
    }

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
    }

    unValidatedReportCategory(category){
        console.log("Category under");
        console.log(category.toString());
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

    render(){
        return(
            <Navbar>
                <Navbar.Header>
                    <NavbarBrand>
                        <a href="/">IMR</a>
                    </NavbarBrand>
                </Navbar.Header>
                <Nav>
                    {IsLoggedIn() ? <NavItem onClick={this.handleLogout}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>}
                    {
                        IsLoggedIn() ? <NavDropdown title="Uvaliderte Rapporter" id="report-category-dropdown">
                            <MenuItem onClick={this.unValidatedFishReports.bind(this)}>Fiske art rapporter</MenuItem>
                            <MenuItem onClick={this.unValidatedCoralReports.bind(this)}>Koral rapporter</MenuItem>
                            <MenuItem onClick={this.unValidatedUnknownReports.bind(this)}>Fremmed art rapporter</MenuItem>
                            <MenuItem href="/reports">Se alle rapporter</MenuItem>
                        </NavDropdown> : null
                    }
                </Nav>

            </Navbar>
        )
    }
}