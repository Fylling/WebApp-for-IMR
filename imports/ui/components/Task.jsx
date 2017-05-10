import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';


export default class Task extends Component {

    //TODO: finne ein måte å sette props til validation page
    handleClick() {
        handleClick()
        {

        }
    }
    render() {
        return(
            <ListGroupItem>{this.props.task.text}
                <Button className="checkOut" bsStyle="primary" bsSize="xsmall" onClick={this.handleClick}>Sjekk ut</Button>
            </ListGroupItem>
        );
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
};