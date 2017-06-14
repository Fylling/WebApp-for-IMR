import React, { Component, PropTypes } from 'react';
import { ListGroup, PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';


import TaskList from './TaskList.jsx';
import {Tasks} from '/imports/api/tasks.js';
import SimpleTask from "./SimpleTask.jsx";

//Controller klassen som henter info fra databasen
class List extends Component {

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

                    {this.renderTasks()}

                </Row>
            </Grid>
        );
    }
}

List.propTypes = {
    tasks: PropTypes.array.isRequired,
};


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    Meteor.subscribe('tasks');
    let id = FlowRouter.getParam('_id');

    //Om Id ikke er satt hentes alle rapporter som ikke er validert
    if(!id) {
    return {
        tasks: Tasks.find({}, { sort: { submitDate: -1, isValidated: false} }).fetch(),
    }} else {
        return {
            tasks: Tasks.find({_id: id }).fetch(),
        }
    }
}, List);