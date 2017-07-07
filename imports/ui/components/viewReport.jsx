import React, {Component, PropTypes} from 'react';
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
    ListGroupItem,
    Carousel,
    CarouselItem,
    Grid,
    PageHeader
} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';

import {Reports, remote} from '/imports/api/tasks.js';
import ShowImg from './ShowImg.jsx';
import MyMap from './GoogleMaps/MyMap.jsx';

//Representerer en liste over hver eneste rapport som ligger i databasen
class ViewReport extends Component {
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

    // For visning/lukking av popup
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

    renderImg() {
        let imgArray = [];
        for (let i = 0; i < this.props.report.photo.length; i++) {
            imgArray.push(
                <CarouselItem>
                    <ShowImg key={i} img={this.props.report.photo[i]}/>
                </CarouselItem>
            )
        }

        return <Carousel>{imgArray}</Carousel>;
    }

    render() {
        if (this.props.report) {
            return (
                <Grid className="pageContainer">
                    <Row>
                        <PageHeader>
                            Rapport
                        </PageHeader>
                    </Row>
                    <Row className="simpleReportContainer">
                        {this.renderImg()}
                        <br/>
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
                        <hr/>
                        <Row>
                            <MyMap report={this.props.report}/>
                        </Row>
                        <hr/>
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

                    </Row>
                </Grid>

            );

        } else {
            return null;
        }
    }
}


export default createContainer(() => {
    let rId = localStorage.getItem('report.id');
    let fields = {
        text: 1, user: 1, scientist: 1,
        latitude: 1, longitude: 1,
        depth: 1, amount: 1, photo: 1,
        taken: 1, length: 1, reportFeedback: 1,
        isValidated: 1
    };
    let reportSub = remote.subscribe('reports.findOne', rId, fields);
    let reportId;
    if (reportSub.ready()) {
        reportId = Reports.findOne(rId);
    }
    return {
        report: reportId,
    }
}, ViewReport);
