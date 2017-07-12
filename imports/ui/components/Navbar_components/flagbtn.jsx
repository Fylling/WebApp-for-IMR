import React, {Component} from 'react';
import {NavItem} from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';

export default class FlagBtn extends Component {


    constructor(props){
        super(props);
        this.state = {
            flag: "/norway_flag_icon.png"
        }
    }

    changeLanguage(){
        console.log("In change langauge");
        i18n.getLocale() === 'en-US' ? i18n.setLocale('nb-NO') : i18n.setLocale('en-US');
        this.showFlag();
    }

    showFlag(){
        let flag;
        console.log("Showflag");
        if(i18n.getLocale() === 'en-US'){
            flag = "/united_kingdom_flag_icon.png"
        } else {
            flag = "/norway_flag_icon.png"
        }

        this.setState({
            flag: flag
        })
    }

    render(){
        return(
            <NavItem onClick={this.changeLanguage.bind(this)}>
                <img src={this.state.flag} height={20} width={20} alt=""/>
            </NavItem>
        )
    }
}