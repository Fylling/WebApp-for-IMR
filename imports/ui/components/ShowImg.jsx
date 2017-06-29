import React, {Component, PropTypes} from 'react';
import {CarouselItem, Image} from 'react-bootstrap';

export default class ShowImg extends Component {

    render(){
        return(
                <img src={this.props.img}/>
        );
    }
}

ShowImg.propTypes = {
    img: PropTypes.string.isRequired,
};