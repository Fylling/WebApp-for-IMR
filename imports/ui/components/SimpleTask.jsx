import React, { Component, PropTypes } from 'react';
import { ButtonGroup, Modal, Button, Row, FormControl, FormGroup, ControlLabel , ListGroupItem, Image} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';



// Representer en enkelt rapport hentet fra databasen
export default class SimpleTask extends Component {
    constructor(props){
        super(props);

        this.state= {
            modalVisible: false,
            alertVisible: false,
        };

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.alertVisible = this.alertVisible.bind(this);
    }

    // For visning/lukking av popup
    showModal () {
        this.setState({
            modalVisible: true,
        });
    }

    closeModal () {
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

        console.log(feedback);
        Meteor.call('tasks.sendFeedback', FlowRouter.getParam('_id'), feedback);
        Meteor.call('tasks.sendEmail', this.props.task.user, "example@mail.com", "Validering", feedback);
        FlowRouter.go('/reports');
        }
        this.closeModal();
    }


    render() {


        return (
            <Row className="simpleReportContainer">
                <div className="imageholder" style={{width: 400, height: 'auto'}}>
                    <Image src="/fisk.jpg" responsive/>
                </div>
                <ListGroupItem className="user">
                    <strong>Bruker:</strong> {this.props.task.user}
                </ListGroupItem>
                <ListGroupItem className="species">
                    <strong>Art:</strong> {this.props.task.text}
                </ListGroupItem>
                <ListGroupItem className="date">
                    <strong>Dato: </strong> {this.props.task.submitDate}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong>Lokasjon: </strong> {this.props.task.geoTag}
                </ListGroupItem>
                <ListGroupItem className="amount">
                    <strong>Antall: </strong>{this.props.task.amount}
                </ListGroupItem>
                <ListGroupItem className="depth">
                    <strong>Dybde: </strong> {this.props.task.depth}
                </ListGroupItem>
                <ListGroupItem className="feedback">
                    <strong>Tilbakemelding: </strong>{this.props.task.reportFeedback}
                </ListGroupItem>
                <hr></hr>
                <Row className="feedbackContainer">
                    <FormGroup>
                        <ControlLabel>Tilbakemelding:</ControlLabel>
                        <FormControl id="feedback" componentClass="textarea" placeholder="Skriv tilbakemelding her.."/>
                    </FormGroup>
                </Row>
                <Button className="feedbackBtn" type="submit" bsStyle="primary" onClick={ this.showModal }>Send
                    tilbakemelding</Button>

                <Modal className="confirmModal" show={this.state.modalVisible} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title>Bekreftelse</Modal.Title>
                        <Modal.Body>
                            Er du sikker på at du vil sende denne tilbakemeldingen til {this.props.task.user}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsSize="large" type="submit" bsStyle="primary" onClick={this.handleFeedback.bind(this)}>OK</Button>
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

            </Row>

        );

    }
}

SimpleTask.propTypes = {
    task: PropTypes.object.isRequired,

};