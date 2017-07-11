import React, {Component} from 'react';
import {Image} from 'react-bootstrap';



export default class ShowImg extends Component {

    render() {
        return (
            <Image src={this.props.img} relative/>
        );
    }
}

