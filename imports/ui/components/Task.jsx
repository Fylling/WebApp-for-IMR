import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';

import {Tasks} from '/imports/api/tasks.js';


export default class Task extends Component {
    //TODO: finne ein måte å sette props til validation page
    toggleCheckedOut() {
       let t = this.props.task._id;
        console.log(t);
       FlowRouter.setParams({_id: t})
       FlowRouter.go('/validation/' + t);

    }

    render() {
        return(
            <ListGroupItem>{this.props.task.text} - {this.props.task.user}
                <Button className="checkOut" bsStyle="primary" bsSize="xsmall" onClick={this.toggleCheckedOut.bind(this)}>Sjekk ut</Button>
            </ListGroupItem>
        );
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,

};