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

export default class ShowMoreDropDown extends Component {

    setShowLimit(limit) {
        localStorage.setItem('limit', limit);
        Session.set('limit', limit);
        console.log("showing more " + limit);
    }

    render() {
        return (
            <div>
                <DropdownButton id="Viss flere rapporter" title={<T>common.showMoreBtnDrpDwn.showMore</T>}>
                    <MenuItem id="Show 20 report" eventKey="1" onClick={this.setShowLimit.bind(this, 10)}>
                        <T>common.showMoreBtnDrpDwn.showTen</T>
                    </MenuItem>
                    <MenuItem id="Show 50 report" eventKey="2" onClick={this.setShowLimit.bind(this, 50)}>
                        <T>common.showMoreBtnDrpDwn.showFifty</T>
                    </MenuItem>
                    <MenuItem id="Show 100 report" eventKey="3" onClick={this.setShowLimit.bind(this, 100)}>
                        <T>common.showMoreBtnDrpDwn.showHundred</T>
                    </MenuItem>
                </DropdownButton>
            </div>
        )
    }
}