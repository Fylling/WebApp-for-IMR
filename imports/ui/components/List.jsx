import React, { Component, PropTypes } from 'react';
import { ListGroup, PageHeader, Grid, Row } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';


import Task from './Task.jsx';
import {Tasks} from '/imports/api/tasks.js';

class List extends Component {
    renderList() {
        return this.props.tasks.map((task) => (
            <Task key={task._id} task={task}/>
        ))
    }


    render() {
        return (
            <Grid>
                <Row>
                <PageHeader>
                    Liste av rapporter
                </PageHeader>

                <ListGroup>
                    {this.renderList()}
                </ListGroup>
                </Row>
            </Grid>
        );
    }
}

List.propTypes = {
    tasks: PropTypes.array.isRequired,
};



export default ListContainer = createContainer(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
}, List);