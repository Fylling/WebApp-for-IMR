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
            checkedOutToUser: (localStorage.getItem('userMail') === this.props.report.scientist),
        };

        this.toggleCheckedOut = this.toggleCheckedOut.bind(this);
    }

    openReport() {
        let id = this.props.report._id;
        localStorage.setItem('report.id', this.props.report._id);
        Session.set('report.id', this.props.report._id);
        //FlowRouter.setParams({_id: id});
        //FlowRouter.go('/reports/' + id);
        FlowRouter.go('/report/');
    }

    toggleCheckedOut(e) {
        e.preventDefault();
        this.setState({
            buttonVisible: !this.state.buttonVisible,
        });
        console.log(this.state.buttonVisible);
        let scientistEmail;
        if(!this.state.buttonVisible){
            scientistEmail = localStorage.getItem('userMail');
        } else {
            scientistEmail = '';
        }
        Meteor.call('reports.setCheckedOut', this.props.report._id, !this.state.buttonVisible, scientistEmail);

    }

    componentWillMount(){
        Meteor.call('reports.setCheckedOut', this.props.report._id, this.state.buttonVisible);
    }

    componentWillUpdate(){

    }

    render() {
        if(this.props.report) {
            if (!this.state.buttonVisible) {
                return (

                    <ListGroup>
                        <ListGroupItem header={this.props.report.text}> {/*sendt inn av {this.props.report.user}*/}
                            <strong>Sendt inn av: </strong>
                            {this.props.report.user}
                            <ButtonToolbar>
                                <Checkbox onChange={this.toggleCheckedOut.bind(this)}>Sjekk ut</Checkbox>
                            </ButtonToolbar>
                        </ListGroupItem>
                    </ListGroup>
                );
            } else {
                return (
                    <ListGroup>
                        <ListGroupItem header={this.props.report.text}>
                            Denne jobbes med nå av en annen forsker.
                            <ButtonToolbar>
                                {this.state.checkedOutToUser ?
                                    <div>
                                        <Checkbox checked="true" onChange={this.toggleCheckedOut.bind(this)}>Gå
                                            tilbake</Checkbox>
                                        <Button className="checkOut" bsStyle="primary" bsSize="xsmall"
                                            onClick={this.openReport.bind(this)}>Se rapport</Button>
                                    </div>
                                    : ''
                                }
                            </ButtonToolbar>
                        </ListGroupItem>
                    </ListGroup>
                );
            }
        } else {
            return (
                <p>loading...</p>
            )
        }
    }
}

ReportListing.propTypes = {
    report: PropTypes.object.isRequired,

};