import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {Row, Button, Modal} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

export default class ValidateReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            change: true,
            modalVisible: false,
            alertVisible: false,
            error: false,
            input: this.props.report.text
        }
    }

    goBack(e) {
        e.preventDefault();
        Meteor.call('reports.validateReport', this.props.report._id);
        history.back();
    }

    render() {
        return (
            <div>
                <Row className="feedbackContainer">
                    <Button className="feedbackBtn"
                            type="submit"
                            bsStyle="primary"
                            onClick={() => {
                                this.setState({
                                    modalVisible: true,
                                });
                            }}>
                        Ferdig
                    </Button>
                </Row>
                <Modal className="confirmModal" show={this.state.modalVisible} onHide={() => {
                    this.setState({modalVisible: false})
                }}>
                    <Modal.Header>
                        <Modal.Title>Bekreftelse</Modal.Title>
                        <Modal.Body>
                            Er du ferdig å validere rapporten?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsSize="large" type="submit" bsStyle="primary"
                                    onClick={this.goBack.bind(this)}>OK</Button>
                            <Button bsSize="large" bsStyle="warning" onClick={() => {
                                this.setState({modalVisible: false})
                            }}>Avbryt</Button>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>
            </div>
        )
    }
}