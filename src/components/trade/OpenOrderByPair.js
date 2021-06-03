import React, { useState, useEffect, useMemo } from "react";
import {
    Button,
    Dimmer,
    Grid,
    Header,
    Input,
    Loader,
    Segment,
    Dropdown,
    Form,
    Statistic,
} from "semantic-ui-react";
import { get, post } from "../../utils/api";
import { objToUrlParams } from "../../utils/util";
import { formatAmount } from "../../settings/format";

export default function OpenOrderByPair() {
    const [symbol, setSymbol] = useState({
        pair: "",
    });
    const [total, setTotal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [list, setList] = useState(null)

    const _handleItemClick = (item) => {
        setLoading(true);
        setSymbol({
            pair: item,
        });
    };
    let pairOption = [];
    useEffect(() => {
        post(`/trade-service/market/list`, {}, _success);
    }, []);
    const _success = (e) => {
        setList(e);
    };

    if (list) {
        list.items.map(item =>
            pairOption.push({
                key: item.symbol,
                value: item.symbol,
                text: item.symbol,
            })
        )
    }
    useEffect(() => {
        if (!symbol.pair) {
            return;
        } else {
            get(
                "/trade-service/order/open-orders-by-pair/statistic" +
                objToUrlParams(symbol),
                (result) => {
                    setLoading(false);
                    setTotal(result);
                    setLoadingFirst(false);
                },
                (error) => {
                    setLoading(false);
                }
            );
        }
    }, [symbol]);

    return (
        <Segment
            style={{
                paddingBottom: "45px",
                marginTop: "20px",
                borderRadius: "20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    marginBottom: "0px",
                }}
            >
                <Header className="user_online">
                </Header>
                <Form.Field>
                    <Dropdown
                        options={pairOption}
                        selection
                        search
                        placeholder="Select pair"
                        onChange={(e, { value }) => _handleItemClick(value)}
                    />
                </Form.Field>
            </div>

            <br />

            <Segment
                loading={loading}
                style={{
                    border: "none",
                    boxShadow: "none",
                    padding: "0",
                    "text-align": "center",
                }}
            >
                <Grid>
                    <Grid.Column
                        computer={5}
                        tablet={5}
                        mobile={5}
                    >
                        <Statistic size="small">
                            <Segment style={{ "text-align": "center", "fontSize": "24px", "border": "none", "box-shadow": "none" }}>
                                Open Volume
                        </Segment>
                            {loadingFirst ? (
                                <Statistic.Value>0</Statistic.Value>
                            ) : (
                                <Statistic.Value>{formatAmount(total.totalVolume)}</Statistic.Value>
                            )}
                        </Statistic>
                    </Grid.Column>
                    <Grid.Column computer={5} tablet={5} mobile={5}>
                        <Statistic size="small">
                            <Segment style={{ "text-align": "center", "fontSize": "24px", "border": "none", "box-shadow": "none" }}>
                                Bids (Users/Total)
                        </Segment>
                            {loadingFirst ? (
                                <Statistic.Value>0</Statistic.Value>
                            ) : (
                                <Statistic.Value>{formatAmount(total.totalRealBids)}/{formatAmount(total.totalBids)}</Statistic.Value>
                            )}
                        </Statistic>
                    </Grid.Column>
                    <Grid.Column computer={5} tablet={5} mobile={5}>
                        <Statistic size="small">
                            <Header style={{ "text-align": "center"}}>
                                Asks (Users/Total)
                        </Header>
                            {loadingFirst ? (
                                <Statistic.Value>0</Statistic.Value>
                            ) : (
                                <Statistic.Value>{formatAmount(total.totalRealAsks)}/{formatAmount(total.totalAsks)}</Statistic.Value>
                            )}
                        </Statistic>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment>
    );
}
