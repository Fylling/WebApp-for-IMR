import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

const style = {
    color: '#ffffff',
    textAlign: "center",
    backgroundImage: 'linear-gradient(to bottom,#337ab7 0,#2e6da4 100%)'
};

export default class SortDropDown extends Component {

    setShowLimit(sort) {
        localStorage.setItem('sort', sort);
        if(localStorage.getItem('sort') !== sort) {
            location.reload();
        }
        location.reload();
    }

    render() {
        return (
            <div>
                <DropdownButton id="filter reports" title={<T>common.sortDropDown.filter</T>}>
                    <MenuItem id="Show 20 report" eventKey="1" onClick={this.setShowLimit.bind(this, 'date')}>
                        <T>common.sortDropDown.date</T>
                    </MenuItem>
                    <MenuItem id="Show 50 report" eventKey="2" onClick={this.setShowLimit.bind(this, 'alphabetic')}>
                        <T>common.sortDropDown.alphabetic</T>
                    </MenuItem>
                </DropdownButton>
            </div>
        )
    }
}