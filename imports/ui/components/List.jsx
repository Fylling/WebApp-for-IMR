import React, { Component, PropTypes } from 'react';
import { ListGroup, PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';


import TaskList from './TaskList.jsx';
import ReportListing from './ReportListing.jsx';
import {Tasks, Reports} from '../../api/tasks.js';
import SimpleTask from "./SimpleTask.jsx";
import ViewReport from "./viewReport";

//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            showReport: false,
        }
    }

    renderTasks() {
        let id = FlowRouter.getParam('_id');

        if(!id) {
        return this.props.tasks.map((task) => (
            <TaskList key={task._id} task={task}/>
        ))} else {
            return this.props.tasks.map((task) => (
                <SimpleTask key={task._id} task={task}/>
            ))}
    }
    renderReports() {
            return this.props.reports.map((report) => (
                <ReportListing key={report._id} report={report}/>
            ))

    }

    render() {
        let id = FlowRouter.getParam('_id');
        let title = "Liste av rapporter";
        if(id) {
            title = "Rapport";
        }

        return (
            <Grid className="pageContainer">
                <Row>
                <PageHeader>
                    {title}
                </PageHeader>

                    {this.renderReports()}

                </Row>
            </Grid>
        );
    }
}

List.propTypes = {
    reports: PropTypes.array.isRequired,
};


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    Meteor.subscribe('reports.list');
    let id = Session.get('report.id');//FlowRouter.getParam('_id');

    //Om Id ikke er satt hentes alle rapporter som ikke er validert
        return {
            reports: Reports.find({}, {sort: {createdAt: -1}, isValidated: false}).fetch(),
        }

}, List);