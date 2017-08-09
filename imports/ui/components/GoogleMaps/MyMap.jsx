import React, { Component } from 'react';
import GoogleMap from '../../../api/GoogleMaps.js';
import {createContainer} from 'meteor/react-meteor-data';
import {remote, Reports} from '../../../api/reports.js';
import {Meteor} from 'meteor/meteor';

let category;


class MyMap extends Component {
    constructor() {
        super();
        this.handleOnReady = this.handleOnReady.bind(this);
        this.handleMapOptions = this.handleMapOptions.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };


    handleMapOptions() {
        if(this.props.report) {
            return {
                center: new google.maps.LatLng(this.props.report.longitude, this.props.report.latitude),
                zoom: 15,
            };
        } else {
            return {
                center: new google.maps.LatLng(60.399975, 5.303949),
                zoom: 5,
            }
        }
    }

    handleOnReady(name) {

        GoogleMaps.ready(name, map => {
            Tracker.autorun(c => {

                for(let i = 0; i < this.props.reports.length; i++){
                    console.log(this.props.reports[i]);
                }

                if(this.props.report !== null){
                    console.log("I if");
                    const marker = new google.maps.Marker({
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(this.props.report.longitude, this.props.report.latitude),
                        map: map.instance,
                        id: this.props.report._id,
                    });
                } else {

                    console.log("I else");
                    console.log(this.props.reports);
                    for (let i = 0; i < this.props.reports.length; i++) {
                        const marker = new google.maps.Marker({
                            draggable: false,
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(this.props.reports[i].longitude, this.props.reports[i].latitude),
                            map: map.instance,
                            id: this.props.reports[i]._id,
                        });
                    }
                }
            });
        });
    }

    render() {
        console.log(localStorage.getItem('map'));
        console.log(typeof localStorage.getItem('map'));
        if (localStorage.getItem('map') === "true") {
            console.log("In render if");
            localStorage.setItem('map', false);
            location.reload();
        }
        console.log(this.props.reports);
        return (
            <div>
                <h1>Reports {FlowRouter.getParam('category')}</h1>

                <GoogleMap
                    onReady={this.handleOnReady}
                    mapOptions={this.handleMapOptions}
                >
                    Loading!
                </GoogleMap>

                {/*<button onClick= {this.forceUpdateHandler} >FORCE UPDATE</button>*/}

            </div>
        );
    }
}

//Det er her uthentingen skjer
export default createContainer(() => {
    let category = FlowRouter.getParam('category');
    console.log(category);
    let validated = true;
    let selector;
    let fields = {"text": 1, "user": 1, "isValidated": 1,
        "checkedOut": 1, "scientist": 1, "category": 1, "createdAt": 1,
        "longitude": 1, "latitude": 1};
    let limit = 1000;
    let options = {sort: {createdAt: -1}, fields: fields};

    if (category === "Alle") {
        selector = {isValidated: validated};
        remote.subscribe('reports.adminMap', validated);
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
}, MyMap);