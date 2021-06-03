import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, GridColumn, Header, Segment } from "semantic-ui-react";
import { formatMoney } from "../../settings/format";
import { post } from "../../utils/api";
import { formatCurrency } from '../../utils/util'

function StakingStatistic({ meta }) {
    const [LusStaking, setLusStaking] = useState([]);

    class StakingCollection extends Array {
        sum(key) {
            return this.reduce((a, b) => a + (b[key] || 0), 0);
        }
    }

    return (
        meta?.length > 0 && (
            <Segment vertical>
                <Grid columns={6} textAlign="center">
                    <GridColumn>
                        <div>Total Staking</div>
                        <Header style={{ margin: 0 }}>
                            {formatCurrency(meta[0].totalStaking)}{" "}
                            {meta[0].base}
                        </Header>
                    </GridColumn>
                    <GridColumn>
                        <div>Total Closed Stake</div>
                        <Header style={{ margin: 0 }}>
                            {formatCurrency(meta[0].totalClosed)} {meta[0].base}
                        </Header>
                    </GridColumn>
                    <GridColumn>
                        <div>Total Reedem</div>
                        <Header style={{ margin: 0 }}>
                            {formatCurrency(meta[0].totalRedeem)}{" "}
                            {meta[0].quote}
                        </Header>
                    </GridColumn>
                    <GridColumn>
                        <div>Total Daily Profit</div>
                        <Header style={{ margin: 0 }}>
                            {formatCurrency(meta[0].totalDailyProfit)}{" "}
                            {meta[0].quote}
                        </Header>
                    </GridColumn>
                    <GridColumn>
                        <div> Open Staking</div>
                        <Header style={{ margin: 0 }}>
                            {formatCurrency(meta[0].totalOpenStaking)}
                        </Header>
                    </GridColumn>
                </Grid>
            </Segment>
        )
    );
}
export default StakingStatistic;