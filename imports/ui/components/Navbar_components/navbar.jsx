import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem } from 'react-bootstrap';
import {IsLoggedIn} from '../../../../lib/helpers.jsx';

import ValidatedReportsDropDown from './validatedReportsDropDown.jsx';
import FlagBtn from './flagbtn.jsx';

const T = i18n.createComponent();

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

    goToMap(category){
        FlowRouter.setParams({category: category});
        if (FlowRouter.current().route.name === "Map") {
            console.log("I map");
            localStorage.setItem('map', true);
            FlowRouter.reload();
        } else {
            localStorage.setItem('map', false);
            FlowRouter.go('/map/' + category);
        }
    }

    viewAllReportsOnMap(e){
        e.preventDefault();
        this.goToMap('Alle');
    }

    viewFishReportsOnMap(e){
        e.preventDefault();
        this.goToMap('Fiske art');
    }

    viewCoralReportsOnMap(e){
        e.preventDefault();
        this.goToMap('Koral');
    }

    viewUnknownReportsOnMap(e){
        e.preventDefault();
        this.goToMap('Fremmed art');
    }

    goToProfile(e){
        FlowRouter.go('/profile');
    }


    render(){
        return(
            <Navbar>
                <Navbar.Header>
                    <NavbarBrand>
                        <a>
                            <img src="/imrlogo.png" height={20} width={200} alt=""/>
                        </a>
                    </NavbarBrand>
                </Navbar.Header>
                <Nav>
                    {IsLoggedIn() ? <NavItem onClick={this.handleLogout.bind(this)}><T>common.navbar.logout</T></NavItem> :
                        <NavItem eventKey={1} href="/login"><T>common.loginform.Login</T></NavItem>}
                    {
                        IsLoggedIn() ? <NavDropdown title={<T>common.navbar.inValid</T>} id="report-category-dropdown">
                            <MenuItem onClick={this.unValidatedFishReports.bind(this)}><T>common.navbar.fishSpecies</T></MenuItem>
                            <MenuItem onClick={this.unValidatedCoralReports.bind(this)}><T>common.navbar.coralSpecies</T></MenuItem>
                            <MenuItem onClick={this.unValidatedUnknownReports.bind(this)}><T>common.navbar.unknownSpecies</T></MenuItem>
                            <MenuItem onClick={this.unValidatedAllReports.bind(this)}><T>common.navbar.seeReports</T></MenuItem>
                        </NavDropdown> : null
                    }

                    {IsLoggedIn() ? <ValidatedReportsDropDown/> : null}

                    {IsLoggedIn() ? <NavDropdown title={<T>common.navbar.map</T>} id="report-category-dropdown">
                        <MenuItem onClick={this.viewFishReportsOnMap.bind(this)}><T>common.navbar.fishSpecies</T></MenuItem>
                        <MenuItem onClick={this.viewCoralReportsOnMap.bind(this)}><T>common.navbar.coralSpecies</T></MenuItem>
                        <MenuItem onClick={this.viewUnknownReportsOnMap.bind(this)}><T>common.navbar.unknownSpecies</T></MenuItem>
                        <MenuItem onClick={this.viewAllReportsOnMap.bind(this)}><T>common.navbar.allReports</T></MenuItem>
                    </NavDropdown> : null}

                    {IsLoggedIn() ? <FlagBtn/> : null}

                    {IsLoggedIn() ? <NavItem onClick={this.goToProfile.bind(this)}>Profile</NavItem> : null}

                </Nav>

            </Navbar>
        )
    }
}