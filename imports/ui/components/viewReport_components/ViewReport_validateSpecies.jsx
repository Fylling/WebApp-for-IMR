import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Row, FormControl, ControlLabel, Button, ButtonGroup, Modal} from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';

import {errorMsg} from "../common_components";

const T = i18n.createComponent();

export default class ViewReport_validateSpecies extends Component {
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

    validateSpecies(e) {
        e.preventDefault();
        console.log("validateSpecies");
        Meteor.call('reports.validateSpecies', this.props.report._id, document.getElementById('validSpecies').value.trim());
    }

    validSpecie(e){
        e.preventDefault();
        this.setState({modalVisible: false});

            if (document.getElementById('validSpecies').value.trim() === "") {
                this.setState({
                    error: true
                })
            } else {
                this.setState({
                    error: false
                });
                this.validateSpecies(e);
            }
    }

    handleChange(e){
        this.setState({input: document.getElementById('validSpecies').value.trim()});
    }

    render() {
        return (
            <div>
            <Row>
                <ControlLabel>Valider art</ControlLabel>
                {errorMsg("Input er tom", this.state.error)}
                <FormControl
                    type="text"
                    id="validSpecies"
                    placeholder="Enter text"
                    value={this.state.input}
                    onChange={this.handleChange.bind(this)}
                />
                <FormControl.Feedback/>
                <br/>
                <ButtonGroup>
                    <Button className="feedbackBtn" type="submit" bsStyle="primary"
                            onClick={() => {
                                this.setState({
                                    change: false,
                                    modalVisible: true,
                                });
                            }}>Valider</Button>
                </ButtonGroup>
                <br/><br/>
            </Row>

                <Modal className="confirmModal" show={this.state.modalVisible} onHide={() => {this.setState({modalVisible: false})}}>
                    <Modal.Header>
                        <Modal.Title>Bekreftelse</Modal.Title>
                        <Modal.Body>
                            Er du sikker på at du vil {this.state.change ? "endre " : "validere "} arten?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsSize="large" type="submit" bsStyle="primary"
                                    onClick={this.validSpecie.bind(this)}>OK</Button>
                            <Button bsSize="large" bsStyle="warning" onClick={() => {this.setState({modalVisible: false})}}>Avbryt</Button>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>
            </div>
        )
    }
}