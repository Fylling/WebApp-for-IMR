import React, {Component} from 'react';
import {Random} from 'meteor/random';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class ViewReport_info extends Component{
    render(){
        return(
            <ListGroup>
                <ListGroupItem className="user">
                    <strong><T>common.viewReport_info.user</T></strong> {this.props.report.user}
                </ListGroupItem>
                <ListGroupItem className="species">
                    <strong><T>common.viewReport_info.species</T></strong> {this.props.report.text}
                </ListGroupItem>
                <ListGroupItem className="date">
                    <strong><T>common.viewReport_info.date</T></strong> {moment(this.props.report.taken).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong><T>common.viewReport_info.latitude</T></strong> {this.props.report.latitude}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong><T>common.viewReport_info.longitude</T></strong> {this.props.report.longitude}
                </ListGroupItem>
                <ListGroupItem className="amount">
                    <strong><T>common.viewReport_info.amount</T></strong>{this.props.report.amount}
                </ListGroupItem>
                <ListGroupItem className="depth">
                    <strong><T>common.viewReport_info.depth</T></strong> {this.props.report.depth} meter
                </ListGroupItem>
                <ListGroupItem className="length">
                    <strong><T>common.viewReport_info.length</T></strong> {this.props.report.length} cm
                </ListGroupItem>
                {this.props.report.reportFeedback === "" ? '' :
                    <ListGroupItem className="feedback">
                        <strong><T>common.viewReport_info.feedback</T></strong>{this.props.report.reportFeedback}
                    </ListGroupItem> }
            </ListGroup>
        );
    }
}