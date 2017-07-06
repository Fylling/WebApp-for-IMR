import React, {Component} from 'react';

import { NavDropdown, MenuItem } from 'react-bootstrap';
import {IsLoggedIn} from '../../../../lib/helpers.jsx';

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

    render() {
        return (
                <NavDropdown title="Validerte Rapporter" id="report-category-dropdown">
                        <MenuItem onClick={this.validatedFishReports.bind(this)}>Fiske art rapporter</MenuItem>
                        <MenuItem onClick={this.validatedCoralReports.bind(this)}>Koral rapporter</MenuItem>
                        <MenuItem onClick={this.validatedUnknownReports.bind(this)}>Fremmed art rapporter</MenuItem>
                        <MenuItem href="/validatedreports">Se alle rapporter</MenuItem>
                </NavDropdown>
        )
    }
}