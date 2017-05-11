import React, { Component, PropTypes } from 'react';
import {Grid, Row} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Task from '../components/Task.jsx'
import { Tasks } from '/imports/api/tasks.js';

export default class Validation extends Component  {
    renderTask() {
        console.log("HEI");
        let i = FlowRouter.getParam('_id');
        console.log(i);
    }

    render() {
        return (
            <Grid>
                <Row>
                    <h1>Her kommer en rapport</h1>
                    <button onClick={this.renderTask.bind(this)}>Tryykkk </button>
                </Row>
            </Grid>
        )
    }
}
