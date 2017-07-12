import React, {Component} from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class I18nTest extends Component {



    render(){
        return(
            <div>
                <T>
                    common.loginform.Email
                </T>
            </div>
        )
    }
}