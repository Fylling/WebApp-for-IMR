import React, { Component } from 'react';
import { PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';

import ReportListing from '../components/ReportListing.jsx';
import {Reports, remote} from '../../api/reports.js';
import {Loading_feedback} from '../components/Loading_feedback.jsx';

//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            showReport: false,
        }
    }
    renderReports() {
            let reportlistings = this.props.reports.map((report) => (
                <ReportListing key={report._id} report={report} remote={remote}/>
            ));
        if(typeof reportlistings !== 'undefined' && reportlistings.length > 0){
            return reportlistings;
        }else {
            return <p>Fant ingen rapporter</p>;
        }
    }

    isValidated(){
        return localStorage.getItem('validated') === 'true' ? "validerte" : "uvaliderte";
    }

    headerText(){
        if(FlowRouter.getParam('category') === "Alle"){
            return ("alle " + this.isValidated());
        } else {
            return (this.isValidated() + " " + FlowRouter.getParam('category').toLowerCase())
        }
    }

    render() {
        if(this.props.reports) {
            return (
                <Grid className="pageContainer">
                    <Row>
                        <PageHeader>
                            Liste av {this.headerText()} rapporter
                        </PageHeader>

                        {this.renderReports()}

                    </Row>
                </Grid>
            );
        } else {
            return <Loading_feedback/>
        }
    }
}


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    let category = FlowRouter.getParam('category');
    let validated = localStorage.getItem('validated') !== 'false';
    let selector;
    let options;
    let fields = {"text": 1, "user": 1, "isValidated": 1, "checkedOut": 1, "scientist": 1, "category": 1};

    if(category === "Alle"){
        selector = {isValidated: validated};
        options = {sort: {createdAt: -1}, fields: fields};
        remote.subscribe('reports.adminPageList', validated, fields);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    } else {
        selector = {isValidated: validated, category: category};
        options = {sort: {createdAt: -1}, fields: fields};
        remote.subscribe('reports.adminPageListWithCategory', category, validated, fields);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    }
}, List);