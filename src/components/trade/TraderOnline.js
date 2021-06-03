import React, { useEffect, useCallback, useState } from 'react';
import { get } from '../../utils/api';
import { Icon, Container, Grid, Header, Statistic, Segment } from 'semantic-ui-react';
import { formatAmount } from '../../settings/format';

export default function TraderOnline() {

    const [data, setData] = useState([])

    useEffect(() => {
        get("/trade-service/trade/statistic/online-trader",
            (result) => {
                setData(result.totalTrader)
            },
        )
    }, []);

    return (
        <Segment style={{'paddingBottom':'35px', 'marginTop':'0px', 'borderRadius':'8px' }}>
            <Header className="user_online" style={{ margin: "10px 0 45px 20px", fontSize: "1.2em" }}>
                24H Traders Online
            </Header>

            <Segment style={{ 'border': 'none', 'boxShadow': 'none', 'padding': '0', textAlign: 'center' }}>
                <Statistic size="tiny">
                    <Statistic.Value>
                        {formatAmount(data)}
                    </Statistic.Value>

                </Statistic>
            </Segment>
        </Segment>
    )
}
