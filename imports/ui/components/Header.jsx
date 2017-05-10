import React from 'react';
import { Meteor } from 'meteor/meteor';

import {Navbar, Nav, NavItem } from 'react-bootstrap';
import { IsLoggedIn } from '../../../lib/helpers.jsx';

Header = React.createClass({
    getInitialState() {
        return {
            isLoggedIn: IsLoggedIn()
        };
    },

    handleLogout() {
        Meteor.logout((error) => {
            if(error) {
                console.log(error.reason);
            } else {
                this.setState({isLoggedIn: !this.state.isLoggedIn});
                FlowRouter.go('/');
            }
        });
    },

    render() {
        let loginButton = IsLoggedIn() ?  <NavItem eventKey={1} href="/reports" onClick={this.handleLogout.bind(this)}>Logout</NavItem> : <NavItem eventKey={1} href="/login">Login</NavItem>;

        return(
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">IMR</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    {loginButton}
                </Nav>
            </Navbar>

        )
    }
});

export default Header;