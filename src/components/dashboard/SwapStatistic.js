import React, { useEffect, useState } from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { get } from "../../utils/api";
import { formatAmount } from "../../settings/format.js";
import { imageURL } from "../../utils/api";


function SwapStatistic() {
  const [data, setData] = useState(null);
  useEffect(() => {
    !data &&
      get(`/swap-service/swap/statistic?from=0&to=0&base&quote`, (data) =>
        setData(data)
      );
  });

  return (
    data && (
      <Segment vertical>
        <Header>Swap Overview</Header>
        <Grid>
          {data.map((item, index) => (
            <Grid.Column key={index} width={8}>
              <Segment>
                <Header as="h4" style={{display: 'flex'}}>
                 <img style={{ width: "20px", height:"20px" }} src={imageURL + `/coins/${item.base}.png`} alt="" size='mini' /> <span style={{margin: "auto 0", padding: "0 3px"}}>{item.base}</span>  - <img style={{ width: "20px", paddingLeft: "3px", height:"20px" }} src={imageURL + `/coins/${item.quote}.png`} alt="" size='mini' /> <span style={{margin: "auto 0", padding: "0 3px"}}>{item.quote}</span> 
                </Header>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Total amount:</p>
                  <p>
                    {formatAmount(item.totalAmount)} {item.base}
                  </p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Total fee:</p>
                  <p>{formatAmount(item.totalFee)} {item.quote}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>AVG swap price:</p>
                  <p>{formatAmount(item.avgSwapPrice)}</p>
                </div>
              </Segment>
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    )
  );
}

export default SwapStatistic;
