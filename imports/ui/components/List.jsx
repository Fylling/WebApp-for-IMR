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
        if(!Session.get('report.id')) {
            return this.props.reports.map((report) => (
                <ReportListing key={report._id} report={report}/>
            ))
        } else {
            console.log("Viss rapport");
            return this.props.reports.map((report) => (
                <ViewReport key={report._id} report={report}/>
            ))
        }
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

                    {/*this.renderTasks()*/}

                </Row>
                <ul>
                    {this.renderReports()}
                </ul>
            </Grid>
        );
    }
}

List.propTypes = {
    tasks: PropTypes.array.isRequired,
    reports: PropTypes.array.isRequired
};


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    Meteor.subscribe('tasks');
    Meteor.subscribe('reports');
    let id = Session.get('report.id');//FlowRouter.getParam('_id');
    console.log("Session id kommer under");
    console.log(id);

    //Om Id ikke er satt hentes alle rapporter som ikke er validert
    if(!id) {
        return {
            tasks: Tasks.find({}, { sort: { submitDate: -1}, isValidated: false }).fetch(),
            reports: Reports.find({}, {sort: {createdAt: -1}, isValidated: true}).fetch(),
        }
    } else {
        return {
            tasks: Tasks.find({_id: id }).fetch(),
            reports: Reports.find({_id: id}).fetch(),
        }
    }
}, List);