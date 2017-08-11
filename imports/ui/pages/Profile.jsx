import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {PageHeader, Grid, Row, ListGroupItem, ListGroup, Button} from 'react-bootstrap';
import {createContainer} from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';


const T = i18n.createComponent();

class Profile extends Component {
    constructor(props){
        super(props)
    }

    render(){
        if(this.props.currentUser){
            console.log(Meteor.user().profile.sendEmail);
        }
        return(
            <div>
                <Grid>
                    <Row>
                        <ListGroup>
                            <ListGroupItem header="Vil do motta email om ny rapporter?">
                                <Button bsStyle="primary"
                                        onClick={() => {Meteor.call('setSendEmail')}}
                                >
                                    Ja
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default createContainer(() => {
    return {
        currentUser: Meteor.user()
    }
}, Profile)