import React, {Component} from 'react';
import {PageHeader, Grid, Row, ButtonToolbar, Button, ButtonGroup} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

import ReportListing from '../components/ReportList/ReportListing.jsx';
import {Reports, remote, AmountOfReports} from '../../api/reports.js';
import {Loading_feedback} from '../components/Loading_feedback.jsx';
import ShowMoreDropDown from '../components/ReportList/ShowMoreDropDown.jsx';
import SortDropDown from '../components/ReportList/SortDropDown.jsx';

const T = i18n.createComponent();

let reportAmount = 0;

const style = {
    color: '#ffffff',
    textAlign: "center",
    backgroundImage: 'linear-gradient(to bottom,#337ab7 0,#2e6da4 100%)'
};

//Controller klassen som henter info fra databasen
class List extends Component {
    constructor(props) {
        super(props);
        reportAmount = 0;
        this.state = {
            page: true,
            reportAmount: 0,
            showNextPageBtn: true,
            showMoreBtnStyle: {display: 'block'}
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
        let textStyle = {display: 'inline'};

        if (FlowRouter.getParam('category') === "Alle") {
            return (<div style={textStyle}><T>common.list.all</T> {this.isValidated()}</div>);
        } else {
            return (<div style={textStyle}>{this.isValidated()} {FlowRouter.getParam('category').toLowerCase()}</div>)
        }
    }

    componentWillMount() {
        Session.set('limit', 10);
        if (localStorage.getItem('page') === null) {
            localStorage.setItem('page', 0);
            Session.set('page', 0);
        }
    }

    setShowMoreBtn(e) {
        e.preventDefault();
        let sessionLimit = Session.get('limit');
        let prevLimit = sessionLimit;
        let currLimit = sessionLimit + 10;
        Session.set('limit', sessionLimit + 10);

        console.log(prevLimit);
        console.log(currLimit);
        console.log(this.props.amountOfReports[0].total);
        console.log(prevLimit < this.props.amountOfReports[0].total && this.props.amountOfReports[0].total < currLimit);

        if (prevLimit < this.props.amountOfReports[0].total && this.props.amountOfReports[0].total < currLimit) {
            console.log("Hallo");
            this.setState({
                showMoreBtnStyle: {display: 'none'}
            })
        }
    }

    componentWillReceiveProps(props) {

        console.log('componentWillReceiveProps');

        if(props.reports){
            let amountsOfReports;

            let category = FlowRouter.getParam('category');
            if (category === 'Alle') {
                amountsOfReports = props.amountOfReports[0].total;
            } else if (category === 'Fiske art') {
                amountsOfReports = props.amountOfReports[0].fish;
            } else if (category === 'Koral') {
                amountsOfReports = props.amountOfReports[0].coral;
            } else {
                amountsOfReports = props.amountOfReports[0].unknown;
            }

            let limit = Session.get('limit') < parseInt(localStorage.getItem('limit')) ?
                parseInt(localStorage.getItem('limit')) : Session.get('limit');

            console.log(amountsOfReports);
            console.log(amountsOfReports < limit);
            console.log(limit);
            let updateState = limit === props.reports.length && amountsOfReports > limit;
            if (updateState) {
                console.log("Set to block");
                this.setState({
                    showMoreBtnStyle: {display: 'block'}
                })
            } else if (amountsOfReports < limit) {
                console.log("Set to none");
                this.setState({
                    showMoreBtnStyle: {display: 'none'}
                })
            }
        }

    }

    render() {
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
                        </div>
                    </PageHeader>
                </Row>
                <Row>
                    {this.props.reports ? this.renderReports() : <Loading_feedback/>}
                    {this.props.reports ?
                        <div style={this.state.showMoreBtnStyle}>
                            <ButtonGroup vertical block>
                                <Button style={style} onClick={this.setShowMoreBtn.bind(this)}>
                                    <T>common.showMoreBtnDrpDwn.showMore</T>
                                </Button>
                            </ButtonGroup>
                            <br/><br/>
                        </div>
                        : null}
                </Row>

            </Grid>
        );

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
    let options = {sort: sort, limit: limit, fields: fields};
    let reportSub;
    if (category === "Alle") {
        selector = {isValidated: validated};
        reportSub = remote.subscribe('reports.adminPageList', validated, fields, limit, sort, page);
    } else {
        selector = {isValidated: validated, category: category};
        reportSub = remote.subscribe('reports.adminPageListWithCategory', category, validated, fields, limit, sort, page);
    }
    let reportAmountSub = remote.subscribe('reports.amount', validated);
    let reportsAmount;
    if (reportAmountSub.ready()) {
        reportsAmount = AmountOfReports.find({valid: validated}, {
            fields: {
                valid: 1,
                total: 1,
                fish: 1,
                coral: 1,
                unknown: 1
            }
        }).fetch()
    }
    let reports;
    if (reportSub.ready()) {
        reports = Reports.find(selector, options).fetch();
    }
    return {
        reports: reports,
        amountOfReports: reportsAmount
    }
}, List);