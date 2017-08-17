import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();


export default class SortDropDown extends Component {
    constructor(props){
        super(props);
        this.state = {
            currFilter: localStorage.getItem('sort')
        }

    }

    setShowLimit(sort) {
        if(localStorage.getItem('sort') !== sort) {
            localStorage.setItem('sort', sort);
            this.setState({
                currFilter: localStorage.getItem('sort')
            });
            location.reload();
        }
    }

    render() {
        return (
            <div>
                <DropdownButton id="filter reports" title={this.state.currFilter === 'date' ?
                    <T>common.sortDropDown.filterDate</T> :
                    <T>common.sortDropDown.filterAlphabetic</T>
                }>
                    <MenuItem id="sort by date" eventKey="1" onClick={this.setShowLimit.bind(this, 'date')}>
                        <T>common.sortDropDown.date</T>
                    </MenuItem>
                    <MenuItem id="sort alphabetical" eventKey="2" onClick={this.setShowLimit.bind(this, 'alphabetic')}>
                        <T>common.sortDropDown.alphabetic</T>
                    </MenuItem>
                </DropdownButton>
            </div>
        )
    }
}