import React, { Component, PropTypes } from 'react';
import GoogleMap from '../../../api/GoogleMaps.js';
import Markers from './markers';

class MyMap extends Component {
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
        console.log("Handleonready");
        GoogleMaps.ready(name, map => {
            console.log("googlemaps.ready");
            Tracker.autorun(c => {
                console.log("tracker.autorun");
                /*google.maps.event.addListener(map.instance, 'click', function(event) {
                    Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                });

                const markers = {};

                /*Markers.find().observe({
                    added: function(document) {
                        const marker = new google.maps.Marker({
                            draggable: true,
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(document.lat, document.lng),
                            map: map.instance,
                            id: document._id,
                        });

                        google.maps.event.addListener(marker, 'dragend', function(event) {
                            Markers.update(marker.id, {
                                $set: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                            });
                        });

                        markers[document._id] = marker;
                    },
                    changed: function(newDocument, oldDocument) {
                        markers[newDocument._id].setPosition({
                            lat: newDocument.lat,
                            lng: newDocument.lng,
                        });
                    },
                    removed: function(oldDocument) {
                        markers[oldDocument._id].setMap(null);
                        google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
                        delete markers[oldDocument._id];
                    },
                });*/

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

    componentWillUnmount() {
        console.log("ComponenetWillUnMount");
    }

    render() {
        console.log("HHHHHHHHHHHH");
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

MyMap.propTypes = {
    report: PropTypes.object.isRequired
};

export default MyMap;