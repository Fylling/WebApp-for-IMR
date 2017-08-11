import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import { Row, Carousel, CarouselItem, Grid, PageHeader } from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

import {Reports, remote} from '/imports/api/reports.js';
import ShowImg from '../components/viewReport_components/ShowImg.jsx';
import MyMap from '../components/GoogleMaps/MyMap.jsx';
import ViewReport_info from '../components/viewReport_components/ViewReport_info.jsx';
import ViewReport_confirm from '../components/viewReport_components/ViewReport_confirm';
import ViewReport_validateSpecies from '../components/viewReport_components/ViewReport_validateSpecies.jsx';
import ValidateReport from '../components/viewReport_components/validateReport.jsx';
import {Loading_feedback} from '../components/Loading_feedback.jsx';

const T = i18n.createComponent();

//Representerer en liste over hver eneste rapport som ligger i databasen
class ViewReport extends Component {
    constructor(props) {
        super(props);
    }

    renderImg() {
        let imgArray = [];
        for (let i = 0; i < this.props.report.photo.length; i++) {
            imgArray.push(
                <CarouselItem className="carouselItemImg">
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
                            <T>common.viewReport.report</T>
                        </PageHeader>
                    </Row>
                    <Row className="simpleReportContainer">
                        {this.renderImg()}
                        <br/>
                        <ViewReport_info report={this.props.report}/>
                        <br/>
                    </Row>
                    {this.props.report.isValidated ? null :
                        <ViewReport_validateSpecies report={this.props.report}/>
                    }
                    <Row>
                        <MyMap report={this.props.report}/>
                        <hr/>
                        <ViewReport_confirm report={this.props.report}/>

                    </Row>
                    {this.props.report.isValidated ? null :
                        <ValidateReport report={this.props.report}/>
                    }
                    <br/>
                </Grid>

            );

        } else {
            return (
                <div>
                    <Loading_feedback/>
                </div>
            );
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
        isValidated: 1, validSpecie: 1
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
