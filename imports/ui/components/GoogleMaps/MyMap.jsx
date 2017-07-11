import React, { Component } from 'react';
import GoogleMap from '../../../api/GoogleMaps.js';

export default class MyMap extends Component {
    constructor() {
        super();
        this.handleOnReady = this.handleOnReady.bind(this);
        this.handleMapOptions = this.handleMapOptions.bind(this)
    }

    handleMapOptions() {
        return {
            center: new google.maps.LatLng(this.props.report.longitude, this.props.report.latitude),
            zoom: 15,
        };
    }

    handleOnReady(name) {
        GoogleMaps.ready(name, map => {
            Tracker.autorun(c => {

                const marker = new google.maps.Marker({
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(this.props.report.longitude, this.props.report.latitude),
                    map: map.instance,
                    id: this.props.report._id,
                });

            });
        });
    }


    render() {
        return (
            <div>
            <GoogleMap
                onReady={this.handleOnReady}
                mapOptions={this.handleMapOptions}
            >
                Loading!
            </GoogleMap>
            </div>
        );
    }
}

