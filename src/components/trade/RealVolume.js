import React, { useEffect, useState, useMemo } from "react";
import { get, post } from "../../utils/api";
import {
  Button,
  Dimmer,
  Header,
  Input,
  Loader,
  Segment,
  Grid,
  Form,
  Dropdown,
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
import moment from "moment";
import { formatAmount, formatMoney } from "../../settings/format";

export default function RealVolume() {
  const [statistic, setStatistic] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentPair, setCurrentPair] = useState("TRXUSDT");
  const [date, setDate] = useState(
    moment(moment().format("YYYY-MM-DD") + " 00:00:00").unix() * 1000
  );
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(null);
  let pairOption = [];
  useEffect(() => {
    post(`/trade-service/market/list`, {}, _success);
  }, []);
  const _success = (e) => {
    setList(e);
  };
  if (list) {
    list.items.map((item) =>
      pairOption.push({
        key: item.symbol,
        value: item.symbol,
        text: item.symbol,
      })
    );
  }
  useEffect(() => {
    setLoading(true);
    get(`/trade-service/trade/statistic?from=${date}&to=0`, (result) => {
      setLoading(false);
      setStatistic(result);
    });
  }, [date]);

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
    <Segment
      style={{ paddingBottom: "45px", marginTop: "20px", borderRadius: "20px" }}
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
        <Header className="user_online">
          <span style={{ color: "#00b5ad" }}>
            {" "}
            <i
              aria-hidden="true"
              class="teal dollar circular inverted icon"
            ></i>
            Volume
          </span>
        </Header>
        <Form.Group widths="equal" style={{ display: "flex" }}>
          <Form.Field style={{ marginRight: "20px" }}>
            <Dropdown
              options={pairOption}
              selection
              search
              placeholder="Select pair"
              value={currentPair}
              onChange={(e, { value }) => setCurrentPair(value)}
            />
          </Form.Field>
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

      <Segment
        loading={loading}
        style={{ border: "none", boxShadow: "none", padding: "0" }}
      >
        <Grid>
          <Grid.Row  >
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
                <XAxis dataKey="lastUpdate" tick={<CustomizedAxisTick />}>
                  <Label
                    // value="Time volume"
                    offset={0}
                    position="insideBottom"
                  />
                </XAxis>
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  strokeWidth={2}
                  dataKey="volume"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </LineChart>
            </Grid.Column>
            <Grid.Column  computer={8} tablet={16} mobile={16}>
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
                <XAxis dataKey="lastUpdate" tick={<CustomizedAxisTick />}>
                  <Label
                    // value="Time volume"
                    offset={0}
                    position="insideBottom"
                  />
                </XAxis>
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  dataKey="totalVolume"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Segment>
  );
}

const CustomizedAxisTick = (props) => {
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="char-custom-tooltip">
        <p className="label">
          <label>Time </label>
          <span>{moment(label).format("YYYY-MM-DD HH:mm:ss")}</span>
        </p>
        <p className="label">
          <label>Total volume </label>
          <span style={{ color: payload[0].stroke }}>
            {formatMoney(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};
