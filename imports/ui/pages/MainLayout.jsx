import React from 'react';
import {PageHeader, Grid, Row } from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

//Layout som går igjen på hver side
export const MainLayout = ({header, content}) => {
    return (
        <Grid className="pageContainer">
            <Row>
                {header}
                {FlowRouter.current().route.name === "Map" ?
                    <PageHeader>
                        <h1><T>common.viewMapOfReports.googleMapHeading</T> {renderh1(FlowRouter.getParam('category'))}</h1>
                    </PageHeader>
                    : null}

                {content}
            </Row>
        </Grid>
    )
};

function renderh1(cat){

    console.log(FlowRouter.current().route.name === "Map");

    if(cat === "Fiske art"){
        return <T>common.navbar.fishSpecies</T>
    } else if(cat === "koral"){
        return <T>common.navbar.coralSpecies</T>
    } else if(cat === "Fremmed art"){
        return <T>common.navbar.unknownSpecies</T>
    } else {
        return <T>common.viewMapOfReports.all</T>
    }
}

//Er Footer komponent nødvendig?