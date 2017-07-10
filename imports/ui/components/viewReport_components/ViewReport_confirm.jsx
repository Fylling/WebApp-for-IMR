import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {
    ButtonGroup,
    Modal,
    Button,
    Row,
    FormControl,
    FormGroup,
    ControlLabel,
} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';


//Representerer en liste over hver eneste rapport som ligger i databasen
export default class ViewReport_confirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            alertVisible: false,
        };

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.alertVisible = this.alertVisible.bind(this);
    }

    showModal() {
        this.setState({
            modalVisible: true,
        });
    }

    closeModal() {
        this.setState({
            modalVisible: false,
        });
    }

    alertVisible() {
        this.setState({
            alertVisible: !this.state.alertVisible,
        });
    }

    //Legger tilbakmeldingen inn i gitt rapport
    handleFeedback() {

        let feedback = document.getElementById('feedback').value.trim();
        if (feedback === "") {
            this.setState({
                alertVisible: true,
            });
        } else {
            Meteor.call('reports.updateFeedback', this.props.report._id, feedback);
            Meteor.call('sendAEmail', this.props.report.user, this.props.report.text);
            history.back();
        }
        this.closeModal();
    }

    render(){
        return(
            <div>

                {!this.props.report.isValidated ?
                    <div>
                        <Row className="feedbackContainer">
                            <FormGroup>
                                <ControlLabel>Tilbakemelding:</ControlLabel>
                                <FormControl id="feedback" componentClass="textarea"
                                             placeholder="Skriv tilbakemelding her.."/>
                            </FormGroup>
                            <Button className="feedbackBtn" type="submit" bsStyle="primary"
                                    onClick={ this.showModal }>Send
                                tilbakemelding</Button>
                        </Row>
                        <br/>
                    </div>
                    : null }

                <Modal className="confirmModal" show={this.state.modalVisible} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title>Bekreftelse</Modal.Title>
                        <Modal.Body>
                            Er du sikker på at du vil sende denne tilbakemeldingen
                            til {this.props.report.user}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsSize="large" type="submit" bsStyle="primary"
                                    onClick={this.handleFeedback.bind(this)}>OK</Button>
                            <Button bsSize="large" bsStyle="warning" onClick={this.closeModal}>Avbryt</Button>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>

                <Modal className="alertModal" show={this.state.alertVisible} onHide={this.alertVisible}>
                    <Modal.Header>
                        <Modal.Title>Denne tilbakemeldingen er tom!</Modal.Title>
                        <Modal.Body>
                            Prøv igjen.
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonGroup vertical block>
                                <Button bsStyle="warning" onClick={this.alertVisible}>OK</Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal.Header>
                </Modal>
            </div>
        );
    }
}