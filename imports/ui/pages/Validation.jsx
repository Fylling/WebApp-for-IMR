import React, { Component, PropTypes } from 'react';
import {Grid, Row, ListGroup} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import FullTask from '../../ui/components/FullTask.jsx';
import { Tasks } from '/imports/api/tasks.js';

class Validation extends Component  {
    renderTask() {
        return this.props.task.map((t) => (
            <FullTask key={t._id} task={t}/>
        ))

    }

    render() {
        return (
            <Grid>
                <Row>
                    <h1>Her kommer en rapport</h1>

                    <ListGroup>
                        {this.renderTask}
                    </ListGroup>
                </Row>
            </Grid>
        )
    }
}


Validation.propTypes = {
    task: PropTypes.array.isRequired,
};

export default ValidationContainer = createContainer(() => {
    Meteor.subscribe('tasks');
    let taskId = FlowRouter.getParam('_id');
    console.log(taskId);

    return {
        task: Tasks.find({}).fetch(),
    };
}, Validation);

