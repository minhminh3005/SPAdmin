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
import {
    ScatterChart,
    Scatter,
    LineChart,
    Line,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
    Legend,
} from "recharts";
import { get, post } from "../../utils/api";
import { objToUrlParams, formatCurrency } from "../../utils/util";
import { formatAmount, formatMoney } from "../../settings/format";
import moment from "moment";
import { convertToInternationalCurrencySystem } from "../../utils/util";

export default function TradeVolume() {
    const [symbol, setSymbol] = useState({
        pair: "TRXUSDT",
    });
    const [total, setTotal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [list, setList] = useState(null);
    const [currentPair, setCurrentPair] = useState("TRXUSDT");

    const _handleItemClick = (item) => {
        setLoading(true);
        setSymbol({
            pair: item,
        });

        setCurrentPair(item);
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

    }, [currentPair, symbol]);

    //Real Volume

    const [statistic, setStatistic] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [listCoin, setListCoin] = useState(null);
    const [totalFee, setTotalFee] = useState({
        base: 0,
        quote: 0,
        spc: 0,
        total: 0,
    });
    const [date, setDate] = useState(
        moment(moment().format("YYYY-MM-DD") + " 00:00:00").unix() * 1000
    );

    useEffect(() => {
        setLoading(true);
        get(`/trade-service/trade/statistic?from=${date}&to=0`, (result) => {
            setLoading(false);
            setStatistic(result);
        });
    }, [date]);
    useEffect(() => {
        post(`/trade-service/market/list`, {}, (e) => setListCoin(e));
    }, []);
    useEffect(() => {
        let base = 0;
        let quote = 0;
        let spc = 0;
        let total = 0;
        if (listCoin && chartData && chartData.length > 0) {
            chartData.map(chart => {
                listCoin.items.map(e => {
                    if (chart.symbol === e.symbol) {
                        chart.base = e.base;
                        chart.quote = e.quote;
                    }
                });
                base += chart.baseFee;
                quote += chart.quoteFee;
                spc += chart.spcFee;
                total += chart.totalVolume;
            });
            setTotalFee({
                base,
                quote,
                spc,
                total,
            });

            setChartData(chartData);
        }
        else {
            setTotalFee({
                base,
                quote,
                spc,
                total,
            });
        }
    }, [listCoin, chartData, currentPair, symbol.pair]);

    useEffect(() => {
        if (statistic && statistic.length > 0) {
            const newData = statistic.filter((item) => item.symbol === currentPair);
            if (newData.length > 0) {
                newData.map((item) => {
                    item.labelTime = moment(item.lastUpdate).format("HH");
                });
            }
            setChartData(newData);
        }
    }, [statistic, currentPair]);

    const dateOption = [
        {
            key: "1day",
            value: moment(moment().format("YYYY-MM-DD") + " 00:00:00").unix() * 1000,
            text: "1 DAY",
        },
        {
            key: "7days",
            value:
                moment(
                    moment().subtract(7, "days").format("YYYY-MM-DD") + " 00:00:00"
                ).unix() * 1000,
            text: "7 DAYS",
        },
        {
            key: "14days",
            value:
                moment(
                    moment().subtract(14, "days").format("YYYY-MM-DD") + " 00:00:00"
                ).unix() * 1000,
            text: "14 DAYS",
        },
        {
            key: "30days",
            value:
                moment(
                    moment().subtract(30, "days").format("YYYY-MM-DD") + " 00:00:00"
                ).unix() * 1000,
            text: "30 DAYS",
        },
    ];

    return (
        <>

            <Segment style={{ border: "none", boxShadow: "none", display: "flex", justifyContent: "space-between", padding: "0 14px 0 0" }}>
                <Header style={{ marginTop: "5px", fontSize: "1.2em" }}>
                    Volume
                </Header>
                <Form.Field>
                    <Dropdown
                        options={pairOption}
                        selection
                        search
                        value={currentPair}
                        placeholder="Select pair"
                        onChange={(e, { value }) => _handleItemClick(value)}
                    />
                </Form.Field>
            </Segment>
            <Segment
                loading={loading}
                style={{
                    padding: "0",
                    marginTop: "20px",
                    borderRadius: "8px",
                }}
            >
                <br />

                <Segment
                    style={{
                        border: "none",
                        boxShadow: "none",
                        padding: "0 0 20px 0",
                        textAlign: "center"
                    }}
                >
                    <Grid>
                        <Grid.Column
                            computer={5}
                            tablet={5}
                            mobile={5}
                        >
                            <Statistic size="mini" style={{ textAlign: "left" }}>
                                <Segment style={{ "paddingLeft": "0", "fontSize": "16px", "border": "none", boxShadow: "none", marginBottom: "0" }}>
                                    Open Volume
                        </Segment>
                                {loadingFirst ? (
                                    <Statistic.Value>0</Statistic.Value>
                                ) : (
                                    <Statistic.Value style={{ textAlign: "left" }}>{formatAmount(total.totalVolume)}</Statistic.Value>
                                )}
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={5} mobile={5}>
                            <Statistic size="mini" style={{ textAlign: "left" }}>
                                <Segment style={{ "paddingLeft": "0", "fontSize": "16px", "border": "none", boxShadow: "none", marginBottom: "0" }}>
                                    Bids (Users/Total)
                                </Segment>
                                {loadingFirst ? (
                                    <Statistic.Value>0</Statistic.Value>
                                ) : (
                                    <Statistic.Value style={{ textAlign: "left" }}>{formatAmount(total.totalRealBids)} / {formatAmount(total.totalBids)}</Statistic.Value>
                                )}
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={5} mobile={5}>
                            <Statistic size="mini" style={{ textAlign: "left" }}>
                                <Segment style={{ "paddingLeft": "0", "fontSize": "16px", "border": "none", boxShadow: "none", marginBottom: "0" }}>
                                    Asks (Users/Total)
                                </Segment>
                                {loadingFirst ? (
                                    <Statistic.Value>0</Statistic.Value>
                                ) : (
                                    <Statistic.Value style={{ textAlign: "left" }}>{formatAmount(total.totalRealAsks)} / {formatAmount(total.totalAsks)}</Statistic.Value>
                                )}
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column computer={1} tablet={1} mobile={1}></Grid.Column>
                    </Grid>
                </Segment>
                <Segment
                    style={{ paddingBottom: "45px", marginTop: "20px", borderRight: "none", borderLeft: "none", borderRadius: "none" }}
                >
                    <div
                        style={{
                            display: "flex",
                            margin: "0 auto",
                            paddingTop: "10px",
                            paddingBottom: "50px",
                            justifyContent: "space-between",
                        }}
                    >
                        <Segment style={{ display: "flex", marginTop: "0px", width: "40%", justifyContent: "space-between", border: "none", boxShadow: "none" }}>
                            <Header as='h5' style={{ marginTop: "11px" }}>Total Fee</Header>
                            <div className="segment_chart_curency">
                                <span style={{ marginRight: "3px" }}>{formatCurrency(totalFee.base)}</span> {chartData[0]?.base}
                            </div>
                            <div className="segment_chart_curency">
                                <span style={{ marginRight: "3px" }}>{formatCurrency(totalFee.quote)}</span> {chartData[0]?.quote}
                            </div>
                            <div className="segment_chart_curency">
                                <span style={{ marginRight: "3px" }}>{formatCurrency(totalFee.spc)}</span>SPC
                            </div>

                        </Segment>

                        <Form.Group widths="equal" style={{ display: "flex", marginTop: "15px" }}>
                            <Form.Field>
                                <Dropdown
                                    options={dateOption}
                                    selection
                                    search
                                    placeholder="Select dates"
                                    value={date}
                                    onChange={(e, { value }) => setDate(value)}
                                />
                            </Form.Field>
                        </Form.Group>
                    </div>
                    {/* <Segment style={{ display: "flex", marginTop: "0px", width: "30%", justifyContent: "space-between", border: "none", boxShadow: "none", paddingBottom:"30px"}}>
                           <div className="segment_chart_curency">
                                      Total Volume:  <span style={{marginLeft:"3px"}}>{formatCurrency(totalFee.total)}</span>
                            </div>
                        </Segment> */}

                    <Segment
                        style={{ border: "none", boxShadow: "none", padding: "0" }}
                    >
                        <Grid>
                            <Grid.Row>
                                <Grid.Column computer={8} tablet={16} mobile={16}>
                                    <h5>Volume</h5>
                                    <LineChart
                                        name={{ currentPair }}
                                        width={600}
                                        height={200}
                                        data={chartData}
                                        syncId="anyId"
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="lastUpdate" tick={<CustomizedAxisTickX />}>
                                            <Label
                                                offset={0}
                                                position="insideBottom"
                                            />
                                        </XAxis>
                                        <YAxis tick={<CustomizedAxisTickY />} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            strokeWidth={2}
                                            dataKey="volume"
                                            stroke="#8884d8"
                                            fill="#8884d8"
                                            dot={false}
                                        />
                                    </LineChart>
                                </Grid.Column>
                                <Grid.Column computer={8} tablet={16} mobile={16}>
                                    <h5>Total Volume</h5>
                                    <LineChart
                                        width={600}
                                        height={200}
                                        data={chartData}
                                        syncId="anyId"
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="lastUpdate" tick={<CustomizedAxisTickX />}>
                                            <Label
                                                offset={0}
                                                position="insideBottom"
                                            />
                                        </XAxis>
                                        <YAxis  tick={<CustomizedAxisTickY />} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            dataKey="totalVolume"
                                            stroke="#82ca9d"
                                            fill="none"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Segment>
            </Segment>
        </>
    );
}

const CustomizedAxisTickX = (props) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={30}
                y={0}
                dy={10}
                textAnchor="end"
                fill="#666"
                style={{ fontSize: "0.9rem" }}
            >
                {moment(payload.value).format("MM-DD HH[h]")}
            </text>
        </g>
    );
};
const CustomizedAxisTickY = (props) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                // x={30}
                // y={0}
                dy={5}
                textAnchor="end"
                fill="#666"
                style={{ fontSize: "0.9rem" }}
            >
                {convertToInternationalCurrencySystem(payload.value)}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="char-custom-tooltip">
                <div className="label">
                    <label>Time </label>
                    <p>{moment(label).format("YYYY-MM-DD HH:mm:ss")}</p>
                </div>
                <div className="label fee">
                    <span> <label>Total volume: </label>  </span>
                    <p style={{ color: payload[0].stroke }}>
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
                <div className="label fee">
                    <span><label>Fee: </label></span>
                    <div style={{ color: payload[0].stroke }}>
                        <>{formatCurrency(payload[0].payload.baseFee)}  <span className="currency">{payload[0].payload.base}</span></> <br />
                        <>{formatCurrency(payload[0].payload.quoteFee)}  <span className="currency">{payload[0].payload.quote}</span></>
                        <p>{formatCurrency(payload[0].payload.spcFee)}<span className="currency" style={{ marginLeft: "3px" }}>SPC</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
