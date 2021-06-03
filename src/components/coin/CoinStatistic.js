import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Segment, Table, Button } from "semantic-ui-react";
import { formatAmount } from "../../settings/format";
import { post } from "../../utils/api";

function CoinStatistic({ coin }) {
  const [data, setData] = useState(null);
  const [loadmore, setLoadmore] = useState(0);
  const  [loading, setLoading ] = useState(false);

  useEffect(() => {
    setLoading(true)
    post(
      `/fund-service/fund/statistic/top-holder`,
      {
        coin,
        limit: 10 + loadmore,
      },
      (data) => {
        setData(data);
        setLoading(false);
      }
    );
  }, [coin, loadmore]);

  return (
    data && (
      <Segment loading={loading} style={{border: "none", boxShadow :"none", padding: "0px"}}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Top</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.users?.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <Link to={`/user-detail/${item.id}`}>{item.email}</Link>
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.amount)} {coin}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div>
          <Button style={{ marginTop: "10px", width: "100%" }} onClick={() => setLoadmore(loadmore + 10)}>Load More</Button>
        </div>
      </Segment>
    )
  );
}

export default CoinStatistic;
