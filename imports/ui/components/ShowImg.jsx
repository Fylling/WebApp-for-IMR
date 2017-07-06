import React, {Component, PropTypes} from 'react';
import {CarouselItem, Image} from 'react-bootstrap';

export default class ShowImg extends Component {

    render(){
        return(
                <Image src={this.props.img} responsive/>
        );
    }
}

ShowImg.propTypes = {
    img: PropTypes.string.isRequired,
};