import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { ButtonToolbar, Checkbox, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

import {Reports} from '/imports/api/tasks.js';

//Representerer en liste over hver eneste rapport som ligger i databasen
export default class ReportListing extends Component {
    constructor(props){
        super(props);

        this.state= {
            buttonVisible: this.props.report.checkedOut,
        };

        console.log("buttonvisible"+this.state.buttonVisible);
        console.log("checkedOut" + this.props.report.checkedOut);
        this.toggleButton = this.toggleButton.bind(this);
    }

    openReport() {
        let id = this.props.report._id;
        Session.set('report.id', this.props.report._id);
        console.log(id);
        //FlowRouter.setParams({_id: id});
        //FlowRouter.go('/reports/' + id);
    }

    toggleButton(e) {
        e.preventDefault();
        this.setState({
            buttonVisible: !this.state.buttonVisible,
        });
        Meteor.call('reports.setCheckedOut', this.props.report._id, !this.state.buttonVisible);
        console.log("ButtonsVisible " + this.state.buttonVisible);
        console.log("checkedOut " + this.props.report.checkedOut);

    }

    componentWillMount(){
        Meteor.call('reports.setCheckedOut', this.props.report._id, this.state.buttonVisible);
    }
    render() {
        if(!this.state.buttonVisible) {
            return(

                <ListGroup>
                    <ListGroupItem>{this.props.report.text} sendt inn av {this.props.report.user}
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
                            <Checkbox checked="true" onChange={this.toggleButton.bind(this)}>Gå tilbake</Checkbox>
                            <Button className="checkOut" bsStyle="primary" bsSize="xsmall"
                                    onClick={this.openReport.bind(this)}>Se rapport</Button>
                        </ButtonToolbar>
                    </ListGroupItem>
                </ListGroup>
            );
        }}
}

ReportListing.propTypes = {
    report: PropTypes.object.isRequired,

};