import React, {Component} from 'react';
import {ButtonToolbar, Checkbox, ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';
import {remote} from '../../../api/reports.js';

import {Loading_feedback} from '../Loading_feedback.jsx';

const T = i18n.createComponent();

//Representerer en liste over hver eneste rapport som ligger i databasen
export default class ReportListing extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        let scientistEmail;
        if (!this.state.buttonVisible) {
            scientistEmail = localStorage.getItem('userMail');
        } else {
            scientistEmail = '';
        }
        this.props.remote.call('reports.setCheckedOut', this.props.report._id, !this.state.buttonVisible, scientistEmail);

        this.setState({
            checkedOutToUser: (localStorage.getItem('userMail') === scientistEmail),
        });
    }

    componentWillMount() {
        //Meteor.call('reports.setCheckedOut', this.props.report._id, this.state.buttonVisible);
    }

    showSeRapport() {
        if (this.props.report.isValidated) {
            return true;
        } else {
            return (this.props.report.checkedOut);
        }
    }

    reportHeader(){
        if(localStorage.getItem('validated') === 'false'){
            console.log("reportheader if");
            return this.props.report.text;
        } else {
            console.log("reportheader else");
            console.log(this.props.report.validSpecie);
            return (this.props.report.validSpecie + "(" + this.props.report.text + ")")
        }
    }

    render() {
        if (this.props.report) {
            if (!this.props.report.checkedOut) {
                return (

                    <ListGroup>
                        <ListGroupItem header={this.reportHeader()}> {/*sendt inn av {this.props.report.user}*/}
                            <strong><T>common.reportListing.submittedBy</T></strong>
                            {this.props.report.user}
                            <ButtonToolbar>
                                <Checkbox onChange={this.toggleCheckedOut.bind(this)}>
                                    <T>common.reportListing.checkOut</T>
                                </Checkbox>
                            </ButtonToolbar>
                        </ListGroupItem>
                    </ListGroup>
                );
            } else {
                return (
                    <ListGroup>
                        <ListGroupItem header={this.reportHeader()}>
                            <p>{!this.props.report.isValidated ? <p><T>common.reportListing.diffScientistWorking</T>
                                    { " " + this.props.report.scientist + "."} </p> :
                                <T>common.reportListing.reportValid</T>}</p>
                            {(!this.showSeRapport()) ?
                                ''
                                :
                                <ButtonToolbar>

                                    {!this.props.report.isValidated ?
                                        <Checkbox checked="true" onChange={this.toggleCheckedOut.bind(this)}>
                                            <T>common.reportListing.goBack</T>
                                        </Checkbox> : null}
                                    <Button className="checkOut" bsStyle="primary" bsSize="xsmall"
                                            onClick={this.openReport.bind(this)}>
                                        <T>common.reportListing.seeReport</T>
                                    </Button>
                                </ButtonToolbar>
                            }
                        </ListGroupItem>
                    </ListGroup>
                );
            }
        } else {
            return (
                <Loading_feedback/>
            )
        }
    }
}