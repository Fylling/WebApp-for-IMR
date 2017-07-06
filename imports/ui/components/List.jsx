import React, { Component } from 'react';
import { PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';

import ReportListing from './ReportListing.jsx';
import {Reports, remote} from '../../api/tasks.js';

//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            showReport: false,
        }
    }
    renderReports() {
            return this.props.reports.map((report) => (
                <ReportListing key={report._id} report={report} remote={remote}/>
            ))

    }

    render() {
        return (
            <Grid className="pageContainer">
                <Row>
                <PageHeader>
                    Liste av rapporter
                </PageHeader>

                    {this.renderReports()}

                </Row>
            </Grid>
        );
    }
}


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    let category = FlowRouter.getParam('category');
    let validated = localStorage.getItem('validated') !== 'false';
    console.log(validated);
    let selector;
    let options;

    if(category === "Alle rapporter"){
        selector = {isValidated: validated};
        options = {sort: {createdAt: -1}};
        remote.subscribe('reports.adminPageList', validated);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    } else {
        console.log("Hallo");
        selector = {isValidated: validated, category: category};
        options = {sort: {createdAt: -1}};
        remote.subscribe('reports.adminPageListWithCategory', category, validated);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    }
}, List);