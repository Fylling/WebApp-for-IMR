import React from 'react';
import { Grid, Row } from 'react-bootstrap';

export const MainLayout = ({header, content}) => (
    <Grid>
        <Row>
        {header}
        {content}
        </Row>
    </Grid>
);

//Er Footer komponent nødvendig?