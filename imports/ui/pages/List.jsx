import React, {Component} from 'react';
import {PageHeader, Grid, Row} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

import ReportListing from '../components/ReportList/ReportListing.jsx';
import {Reports, remote} from '../../api/reports.js';
import {Loading_feedback} from '../components/Loading_feedback.jsx';
import ShowMoreBtn from '../components/ReportList/ShowMoreBtn.jsx';
import ShowMoreDropDown from '../components/ReportList/ShowMoreDropDown.jsx';

const T = i18n.createComponent();


//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReport: false,
        }
    }

    renderReports() {
        let reportlistings = this.props.reports.map((report) => (
            <ReportListing key={report._id} report={report} remote={remote}/>
        ));
        if (typeof reportlistings !== 'undefined' && reportlistings.length > 0) {
            return reportlistings;
        } else {
            return <p>Fant ingen rapporter</p>;
        }
    }

    isValidated() {
        return localStorage.getItem('validated') === 'true' ?
            <T>common.list.valid</T> : <T>common.list.inValid</T>;
    }

    headerText() {
        let textStyle = { display: 'inline' };
        
        if (FlowRouter.getParam('category') === "Alle") {
            return (<div style={textStyle}><T>common.list.all</T> {this.isValidated()}</div>);
        } else {
            return (<div style={textStyle}>{this.isValidated()} {FlowRouter.getParam('category').toLowerCase()}</div>)
        }
    }

    componentWillMount() {
        Session.set('limit', 10);
        console.log(Session.get('limit'));
    }

    render() {
        if (this.props.reports) {
            return (
                <Grid className="pageContainer">
                    <Row>
                        <PageHeader>
                            <div>
                                <p>
                                    <T>common.list.list</T> {this.headerText()} <T>common.list.reports</T>
                                </p>
                                <ShowMoreDropDown/>
                            </div>
                        </PageHeader>

                        {this.renderReports()}
                        <ShowMoreBtn/>
                    </Row>
                </Grid>
            );
        } else {
            return <Loading_feedback/>
        }
    }
}


//Det er her uthentingen skjer
export default ListContainer = createContainer(() => {
    let category = FlowRouter.getParam('category');
    let validated = localStorage.getItem('validated') !== 'false';
    let selector;
    let fields = {"text": 1, "user": 1, "isValidated": 1,
        "checkedOut": 1, "scientist": 1, "category": 1, "createdAt": 1};
    let localLimit = parseInt(localStorage.getItem('limit'));
    let sessionLimit = Session.get('limit');
    let limit = sessionLimit < localLimit ? localLimit : sessionLimit;
    let options = {limit: limit, sort: {createdAt: -1}, fields: fields};

    console.log(limit);

    if (category === "Alle") {
        selector = {isValidated: validated};
        remote.subscribe('reports.adminPageList', validated, fields, limit);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    } else {
        selector = {isValidated: validated, category: category};
        remote.subscribe('reports.adminPageListWithCategory', category, validated, fields, limit);
        return {
            reports: Reports.find(selector, options).fetch(),
        }
    }
}, List);