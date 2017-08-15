import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {PageHeader, Grid, Row, ButtonToolbar, Button} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import {setPageHelper} from "../../../lib/helpers"

import ReportListing from '../components/ReportList/ReportListing.jsx';
import {Reports, remote, AmountOfReports} from '../../api/reports.js';
import {Loading_feedback} from '../components/Loading_feedback.jsx';
import ShowMoreBtn from '../components/ReportList/ShowMoreBtn.jsx';
import ShowMoreDropDown from '../components/ReportList/ShowMoreDropDown.jsx';
import SortDropDown from '../components/ReportList/SortDropDown.jsx';

const T = i18n.createComponent();
let reportAmount = 0;

//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props) {
        super(props);
        reportAmount = 0;
        this.state = {
            page: true,
            reportAmount: 0
        }
    }

    renderReports() {
        let reportlistings = this.props.reports.map((report) => (
            <ReportListing key={report._id} report={report} remote={remote}/>
        ));

        reportAmount = reportlistings.length + reportAmount;

        console.log("reportAmount");
        console.log(reportAmount);

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
        let textStyle = {display: 'inline'};

        if (FlowRouter.getParam('category') === "Alle") {
            return (<div style={textStyle}><T>common.list.all</T> {this.isValidated()}</div>);
        } else {
            return (<div style={textStyle}>{this.isValidated()} {FlowRouter.getParam('category').toLowerCase()}</div>)
        }
    }

    componentWillMount() {
        Session.set('limit', 10);
        console.log(Session.get('limit'));
        if (localStorage.getItem('page') === null) {
            localStorage.setItem('page', 0);
            Session.set('page', 0);
        }
    }

    setPage(e) {
        e.preventDefault();
        //setPageHelper(this.props.amountOfReports[0].total, )
        if (this.props.amountOfReports[0].total) {
            localStorage.setItem('page', parseInt(localStorage.getItem('page')) + 1);
            console.log(localStorage.getItem('page'));
        }
    }

    tmp(e){
        e.preventDefault();
        this.forceUpdate();
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
                                <ButtonToolbar>
                                    <ShowMoreDropDown/>
                                    <SortDropDown/>
                                </ButtonToolbar>

                                <Button onClick={this.setPage.bind(this)}>
                                    Neste side
                                </Button>
                                <Button onClick={this.tmp.bind(this)}>
                                    update
                                </Button>
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
    let fields = {
        "text": 1, "user": 1, "isValidated": 1,
        "checkedOut": 1, "scientist": 1, "category": 1, "createdAt": 1,
        "validSpecie": 1, "taken": 1
    };
    let localLimit = parseInt(localStorage.getItem('limit'));
    let sort = localStorage.getItem('sort') === 'date' ? {taken: -1} : {text: 1};
    let sessionLimit = Session.get('limit');
    let limit = sessionLimit < localLimit ? localLimit : sessionLimit;
    let page = parseInt(localStorage.getItem('page'));
    let options = {limit: limit, sort: sort, fields: fields};
    console.log(page);
    let reportSub;
    if (category === "Alle") {
        selector = {isValidated: validated};
        reportSub = remote.subscribe('reports.adminPageList', validated, fields, limit, sort, page);
    } else {
        selector = {isValidated: validated, category: category};
        reportSub = remote.subscribe('reports.adminPageListWithCategory', category, validated, fields, limit, sort, page);
    }
    remote.subscribe('reports.amount', validated);
    let reports;
    if (reportSub.ready()) {
        reports = Reports.find(selector, options);
    }
    return {
        reports: reports,
        amountOfReports: AmountOfReports.find({valid: validated}, {
            fields: {
                valid: 1,
                total: 1,
                fish: 1,
                coral: 1,
                unknown: 1
            }
        }).fetch()
    }
}, List);