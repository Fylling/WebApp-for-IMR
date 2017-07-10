import React, {Component} from 'react';
import {Random} from 'meteor/random';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';


export default class ViewReport_info extends Component{
    render(){
        return(
            <ListGroup>
                <ListGroupItem className="user">
                    <strong>Bruker:</strong> {this.props.report.user}
                </ListGroupItem>
                <ListGroupItem className="species">
                    <strong>Art:</strong> {this.props.report.text}
                </ListGroupItem>
                <ListGroupItem className="date">
                    <strong>Dato: </strong> {moment(this.props.report.taken).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong>Breddegrad: </strong> {this.props.report.latitude}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong>Lengdegrad: </strong> {this.props.report.longitude}
                </ListGroupItem>
                <ListGroupItem className="amount">
                    <strong>Antall: </strong>{this.props.report.amount}
                </ListGroupItem>
                <ListGroupItem className="depth">
                    <strong>Dybde: </strong> {this.props.report.depth} meter
                </ListGroupItem>
                <ListGroupItem className="length">
                    <strong>Lengde: </strong> {this.props.report.length} cm
                </ListGroupItem>
                {this.props.report.reportFeedback === "" ? '' :
                    <ListGroupItem className="feedback">
                        <strong>Tilbakemelding: </strong>{this.props.report.reportFeedback}
                    </ListGroupItem> }
            </ListGroup>
        );
    }
}