import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';

import {Tasks} from '/imports/api/tasks.js';


export default class FullTask extends Component {


    render() {
        return(
            <ListGroupItem>
                {this.props.task.text}
                {this.props.task.user}
            </ListGroupItem>

        );
    }
}

FullTask.propTypes = {
    task: PropTypes.object.isRequired,

};