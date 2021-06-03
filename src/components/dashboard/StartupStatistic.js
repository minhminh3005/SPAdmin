import React, { useEffect, useState } from "react";
import { Grid, Header, Progress, Segment } from "semantic-ui-react";
import { get, post } from "../../utils/api";
import { formatAmount } from "../../settings/format.js";

function StartupStatistic() {
  const [dataEASYBUY, setDataEASYBUY] = useState(null);
  const [dataIEO, setDataIEO] = useState(null)
  useEffect(() => {
    !dataEASYBUY &&
      post(
        `/presale-service/product/list`,
        {
          type: "EASYBUY",
        },
        (data) => {
          setDataEASYBUY(data);
        }
      );
  }, []);
  useEffect(() => {
    !dataIEO &&
      post(
        `/presale-service/product/list`,
        {
          type: "IEO",
        },
        (data) => {
          setDataIEO(data);
        }
      );
  }, []);
  return (
    dataEASYBUY && dataIEO && (
      <Segment vertical>
        <Header>Startup Overview</Header>
        <h3>EASYBUY</h3>
        <Grid columns={"4"}>
          {dataEASYBUY.map((item, index) => (
            <Grid.Column key={index}>
              <Segment>
                <Header as="h4">
                  {item.base} - {typeof(item.quote) !== "string" ? `[` + item.quote.map((item) => `${item} `)+ `]` : item.quote}
                </Header>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Supply: </p>
                  <p>
                    {formatAmount(item.supply)} {item.base}
                  </p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Sold: </p>
                  <p>
                    {formatAmount(item.sold)} {item.base} (
                    {parseInt((item.sold / item.supply) * 100)}%)
                  </p>
                </div>
                <Progress
                  percent={parseInt((item.sold / item.supply) * 100)}
                  success
                  style={{margin: "5px 0 15px 0"}}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                </div>
              </Segment>
            </Grid.Column>
          ))}
        </Grid>

        <h3>IEO</h3>
        <Grid columns={"4"}>
          {dataIEO.map((item, index) => (
            <Grid.Column key={index}>
              <Segment>
                <Header as="h4">
                  {item.base} - {typeof(item.quote) !== "string" ? `[` + item.quote.map((item) => `${item} `)+ `]` : item.quote}
                </Header>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Supply: </p>
                  <p>
                    {formatAmount(item.supply)} {item.base}
                  </p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Sold: </p>
                  <p>
                    {formatAmount(item.sold)} {item.base} (
                    {parseInt((item.sold / item.supply) * 100)}%)
                  </p>
                </div>
                <Progress
                  percent={parseInt((item.sold / item.supply) * 100)}
                  success
                  style={{margin: "5px 0 15px 0"}}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                </div>
              </Segment>
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    )
  );
}

export default StartupStatistic;
