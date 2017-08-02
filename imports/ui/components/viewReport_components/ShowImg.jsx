import React, {Component} from 'react';



export default class ShowImg extends Component {

    render() {
        return (
            <img src={this.props.img} className="carouselItemImg"/>
        );
    }
}

