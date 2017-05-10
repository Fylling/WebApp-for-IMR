import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { FormGroup, FormControl} from 'react-bootstrap';

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
                FlowRouter.go('Reports');
            }
        })

    }

    render () {
        return (
            <div className="container">
                <div>
                    <h1>Login</h1>
                    <form onSubmit={ this.handleSubmit }>
                        <FormGroup>
                        <FormControl
                                id="Email"
                                type="email"
                                label="Email address"
                                placeholder="Enter email..."
                        />
                        <FormControl
                            id="Password"
                            type="password"
                            label="Admin password"
                            placeholder="Enter password..."
                        />

                        </FormGroup>
                        <button type="submit" value="Login" >Logg inn</button>
                    </form>

                </div>
            </div>
        )
    }
}
