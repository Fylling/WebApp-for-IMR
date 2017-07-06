import React, { Component, PropTypes } from 'react';
import { ListGroup, PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import TaskList from './TaskList.jsx';
import ReportListing from './ReportListing.jsx';
import {Tasks, Reports, remote} from '../../api/tasks.js';
import SimpleTask from "./SimpleTask.jsx";
import ViewReport from "./viewReport";

class ValidReportList extends Component {
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

export default ListContainer = createContainer(() => {
    let category = FlowRouter.getParam('category');
    let validated = FlowRouter.getParam('validatedReport');

        console.log("It's validated");
        if(category === undefined){
            remote.subscribe('reports.adminPageList', true);
            return {
                reports: Reports.find({isValidated: true}, {sort: {createdAt: -1}}).fetch(),
            }
        } else {
            remote.subscribe('reports.adminPageListWithCategory', category, true);
            return {
                reports: Reports.find({isValidated: true, category: category}, {sort: {createdAt: -1}}).fetch(),
            }
        }

}, ValidReportList);