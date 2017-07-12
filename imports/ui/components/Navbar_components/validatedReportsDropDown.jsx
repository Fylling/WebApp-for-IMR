import React, {Component} from 'react';
import i18n from 'meteor/universe:i18n';

import { NavDropdown, MenuItem } from 'react-bootstrap';
import {IsLoggedIn} from '../../../../lib/helpers.jsx';

const T = i18n.createComponent();

export default class ValidatedReportsDropDown extends Component {
    constructor(props) {
        super(props);
    }

    validatedReportCategory(category) {
        localStorage.setItem('validated', true);
        FlowRouter.setParams({category: category});
        FlowRouter.go('/validatedreports/' + category);
    }

    validatedFishReports(e) {
        e.preventDefault();
        this.validatedReportCategory("Fiske art");
    }

    validatedCoralReports(e) {
        e.preventDefault();
        this.validatedReportCategory("Koral");
    }

    validatedUnknownReports(e) {
        e.preventDefault();
        this.validatedReportCategory("Fremmed art");
    }

    validatedAllReports(e) {
        e.preventDefault();
        this.validatedReportCategory("Alle");
    }

    render() {
        return (
                <NavDropdown title={<T>common.navbar.valid</T>} id="report-category-dropdown">
                        <MenuItem onClick={this.validatedFishReports.bind(this)}><T>common.navbar.fishSpecies</T></MenuItem>
                        <MenuItem onClick={this.validatedCoralReports.bind(this)}><T>common.navbar.coralSpecies</T></MenuItem>
                        <MenuItem onClick={this.validatedUnknownReports.bind(this)}><T>common.navbar.unknownSpecies</T></MenuItem>
                        <MenuItem onClick={this.validatedAllReports.bind(this)}><T>common.navbar.seeReports</T></MenuItem>
                </NavDropdown>
        )
    }
}