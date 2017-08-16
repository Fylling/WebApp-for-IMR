import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {setPageHelper} from "../../../../lib/helpers";


export default class NextPageBtn extends Component{

    setPage(e) {
        e.preventDefault();
        setPageHelper(this.props.amountOfReports[0].total);
        if (this.props.amountOfReports[0].total) {
            localStorage.setItem('page', parseInt(localStorage.getItem('page')) + 1);
            console.log(localStorage.getItem('page'));
        }
    }

    render(){
        if(this.props.reportAmount){
            console.log(this.props.reportAmount);
            return(
                <Button onClick={this.setPage.bind(this)}>
                    Neste side
                </Button>
            )
        } else {
            return null;
        }
    }
}

/*
<NextPageBtn reportAmount={this.props.reportAmount}/>
 */