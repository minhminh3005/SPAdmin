import React, { useEffect, useState } from "react";
import { Divider, Header, Segment, Statistic } from "semantic-ui-react";
import { get } from "../../utils/api";
import CanvasJSReact from "../assets/canvasjs.react";
import { formatAmount } from "../../settings/format.js";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function UserStatistic() {
  const [data, setData] = useState(null);

  useEffect(() => {
    !data &&
      get(`/user-service/user/statistic?from=0&to=0`, (data) => {
        setData(data);
      });
  }, [data]);

  return (
    data && (
      <Segment vertical style={{overflow: "hidden"}}>
        <Header>User Overview</Header>
        <Statistic.Group style={{ justifyContent: "space-around" }} size="small">
          <Statistic>
            <Statistic.Value>
              {formatAmount(data.totalActive)}/{formatAmount(data.totalUser)}
            </Statistic.Value>
            <Statistic.Label>Active / Total User</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              {formatAmount(data.thirtyRegister)}
            </Statistic.Value>
            <Statistic.Label>30 days</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              {formatAmount(data.sevenDaysRegister)}
            </Statistic.Value>
            <Statistic.Label>7 days</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              {formatAmount(data.oneDayRegister)}
            </Statistic.Value>
            <Statistic.Label>24h</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Segment>
    )
  );
}

export default UserStatistic;
