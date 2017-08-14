import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {remote} from '../../api/reports.js';
import {Grid, Row, ListGroupItem, ListGroup, Button} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import {Loading_feedback} from '../components/Loading_feedback'


const T = i18n.createComponent();


class Profile extends Component {
    render() {
        if (this.props.currentUser) {
            return (

                <div>
                    <Grid>
                        <Row>
                            <ListGroup>
                                <ListGroupItem header={i18n.__('common.profile.receiveMail')}>
                                    <Button bsStyle="primary"
                                            onClick={() => {
                                                Meteor.call('setSendEmail')
                                            }}>
                                        {this.props.currentUser.profile.sendEmail ?
                                            <T>common.profile.yes</T> :
                                            <T>common.profile.no</T>}
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Row>
                    </Grid>
                </div>
            )
        } else {
            return (
                <Loading_feedback/>
            )
        }
    }
}

export default createContainer(() => {
    return {
        currentUser: Meteor.user(),
    }
}, Profile)