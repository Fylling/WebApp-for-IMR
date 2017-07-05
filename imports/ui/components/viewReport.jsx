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
            Session.set('report.id', false);
            Meteor.call('reports.updateFeedback', this.props.report[0]._id, feedback);
            Meteor.call('sendAEmail', this.props.report[0].user, this.props.report[0].text);
            console.log(feedback);
            FlowRouter.go('/reports');
        }
        this.closeModal();
    }

    renderImg() {
        let imgArray = [];
        console.log("Mengde bilder");
        console.log(this.props.report[0].photo.length);
        console.log("Reports");
        console.log(this.props.report.length);
        for (let i = 0; i < this.props.report[0].photo.length; i++) {
            imgArray.push(
                <CarouselItem>
                    <ShowImg key={i} img={this.props.report[0].photo[i]}/>
                </CarouselItem>
            )
        }

        return <Carousel>{imgArray}</Carousel>;
    }

    render() {
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
                    <strong>Bruker:</strong> {this.props.report[0].user}
                </ListGroupItem>
                <ListGroupItem className="species">
                    <strong>Art:</strong> {this.props.report[0].text}
                </ListGroupItem>
                <ListGroupItem className="date">
                    <strong>Dato: </strong> {this.props.report[0].submitDate}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong>Breddegrad: </strong> {this.props.report[0].latitude}
                </ListGroupItem>
                <ListGroupItem className="geoLocation">
                    <strong>Lengdegrad: </strong> {this.props.report[0].longitude}
                </ListGroupItem>
                <ListGroupItem className="amount">
                    <strong>Antall: </strong>{this.props.report[0].amount}
                </ListGroupItem>
                <ListGroupItem className="depth">
                    <strong>Dybde: </strong> {this.props.report[0].depth}
                </ListGroupItem>
                <ListGroupItem className="feedback">
                    <strong>Tilbakemelding: </strong>{this.props.report[0].reportFeedback}
                </ListGroupItem>
                <hr/>
                <Row>
                    <MyMap report={this.props.report[0]}/>
                </Row>
                <hr/>
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
                            Er du sikker på at du vil sende denne tilbakemeldingen til {this.props.report[0].user}?
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

    }
}


ViewReport.propTypes = {
    report: PropTypes.array.isRequired,
    reportId: PropTypes.string.isRequired
};

export default createContainer(() => {
    let rId = Session.get('report.id');
    remote.subscribe('reports.findOne', rId);
    return {
        report: Reports.find({_id: rId}).fetch(),
    }
}, ViewReport);
