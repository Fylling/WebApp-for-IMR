import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { ButtonToolbar, Checkbox, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

import {Tasks} from '/imports/api/tasks.js';

//Representerer en liste over hver eneste rapport som ligger i databasen
export default class TaskList extends Component {
    constructor(props){
        super(props);

        this.state= {
            buttonVisible: this.props.task.checkedOut,
        };
        this.toggleButton = this.toggleButton.bind(this);
    }

    toggleCheckedOut(e) {
        e.preventDefault();
       let id = this.props.task._id;
       console.log(id);
       FlowRouter.setParams({_id: id});
       FlowRouter.go('/reports/' + id);
    }

    toggleButton(e) {
        e.preventDefault();
        this.setState({
        buttonVisible: !this.state.buttonVisible,
        });
        console.log(this.state.buttonVisible);
        let id = this.props.task._id;
        Meteor.call('tasks.setCheckedOut', id, this.state.buttonVisible);

    }



    /*
    insertMethod() {
        Meteor.call('tasks.insert', "Kvithai", "" , 2, "15 meter", "");
    }

    deleteMethod(){
        let id = this.props.task._id;
        Meteor.call('tasks.remove', id);
    }*/

    render() {
        if(!this.state.buttonVisible) {
        return(

                <ListGroup>
                    <ListGroupItem>{this.props.task.text} sendt inn av {this.props.task.user}
                        <ButtonToolbar>
                            <Checkbox onChange={this.toggleButton.bind(this)}>Sjekk ut</Checkbox>
                        </ButtonToolbar>
                    </ListGroupItem>
                </ListGroup>
             );
    } else {
            return(
                <ListGroup>
                    <ListGroupItem>Denne jobbes med nå av en annen forsker.
                        <ButtonToolbar>
                            <Checkbox checked="true" onChange={this.toggleButton}>Gå tilbake</Checkbox>
                            <Button className="checkOut" bsStyle="primary" bsSize="xsmall"
                                    onClick={this.toggleCheckedOut.bind(this)}>Se rapport</Button>
                        </ButtonToolbar>
                    </ListGroupItem>
                </ListGroup>
            );
        }}
}

TaskList.propTypes = {
    task: PropTypes.object.isRequired,

};