import React, { Component, PropTypes } from 'react';
import { ListGroup, PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';


import TaskList from './TaskList.jsx';
import ReportListing from './ReportListing.jsx';
import {Tasks, Reports, remote} from '../../api/tasks.js';
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
    category: PropTypes.string
};


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    let category = FlowRouter.getParam('category');
    if(category === undefined){
        remote.subscribe('reports.adminPageList');
        return {
            reports: Reports.find({isValidated: false}, {sort: {createdAt: -1}}).fetch(),
        }
    } else {
        remote.subscribe('reports.adminPageListWithCategory', category);
        return {
            reports: Reports.find({isValidated: false, category: category}, {sort: {createdAt: -1}}).fetch(),
        }
    }

}, List);