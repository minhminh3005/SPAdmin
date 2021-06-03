import React, { useEffect, useCallback, useState } from 'react';
import { Icon, Container, Grid, Header, Segment } from 'semantic-ui-react';
import TraderOnline from './TraderOnline';
import OpenOrderByPair from './OpenOrderByPair';
import RealVolume from './RealVolume';
import TradeVolume from './TradeVolume';

export default function TradeOverview() {

    return (
        <Segment style={{ 'border': 'none', 'boxShadow': 'none', 'padding': '0' }}>
            <Grid>
                <Grid.Column computer={5} tablet={5} mobile={16}>
                    <TraderOnline />
                </Grid.Column>
                <Grid.Column computer={15} tablet={15} mobile={16}></Grid.Column>
                <Grid.Column
                    computer={16}
                    tablet={16}
                    mobile={16}
                >
                    <TradeVolume />
                </Grid.Column>
            </Grid>
        </Segment>
    );
}
