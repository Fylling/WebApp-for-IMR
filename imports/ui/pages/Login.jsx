import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import { Button, FormGroup, FormControl} from 'react-bootstrap';

//Representerer
export default class Login extends Component {
    handleSubmit(event) {
        event.preventDefault();

        //Input verdier
        let email = document.getElementById('Email').value.trim();
        let password = document.getElementById('Password').value.trim();


        //Logg inn admin bruker
        Meteor.loginWithPassword(email, password, function(error) {
            if(error) {
                console.log(error.reason);

            } else {
                let category = "Alle";
                Meteor.call('checkSendEmail');
                localStorage.setItem('userMail', Meteor.user().emails[0].address);
                localStorage.setItem('validated', false);
                localStorage.setItem('limit', 10);

                FlowRouter.setParams({category: category});
                FlowRouter.go('/unvalidatedreports/' + category);
            }
        })

    }


    render () {
        console.log(i18n.__('common.loginform.Email'));
        return (
            <div className="container">
                <div>
                    <h1><T>common.loginform.Login</T></h1>
                    <form onSubmit={ this.handleSubmit }>
                        <FormGroup>
                        <FormControl
                                id="Email"
                                type="email"
                                label={i18n.__('common.loginform.Email')}
                                placeholder={i18n.__('common.loginform.Email')}
                        />
                        <FormControl
                            id="Password"
                            type="password"
                            label={i18n.__('common.loginform.Password')}
                            placeholder={i18n.__('common.loginform.Password')}
                        />

                        </FormGroup>
                        <button type="submit" value="Login" ><T>common.loginform.Login</T></button>
                    </form>

                </div>
            </div>
        )
    }
}
