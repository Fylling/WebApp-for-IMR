import React from 'react';
import { Grid, Row } from 'react-bootstrap';

//Layout som går igjen på hver side
export const MainLayout = ({header, content}) => (
    <Grid>
        <Row>
        {header}
        {content}
        </Row>
    </Grid>
);

//Er Footer komponent nødvendig?