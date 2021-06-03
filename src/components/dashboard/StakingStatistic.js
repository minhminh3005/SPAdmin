import React, { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import format, { formatAmount } from "../../settings/format";
import { get } from "../../utils/api";
import {
  Button,
  Dimmer,
  Header,
  Input,
  Loader,
  Segment,
  Table,
} from "semantic-ui-react";
import { formatTime } from "../../settings/format";

function StakingStatistic() {
  const [data, setData] = useState(null);
  useEffect(() => {
    !data &&
      get(`/staking-service/staking/statistic?from=0&to=0`, (data) =>
        setData(data)
      );
  });

  return (
    data && (
      <Segment vertical>
        <Header>Staking Overview</Header>

        <Segment loading={!data} vertical>
          <Table celled striped selectable compact="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Stake</Table.HeaderCell>
                <Table.HeaderCell>Redeem</Table.HeaderCell>
                <Table.HeaderCell>Pool Size</Table.HeaderCell>
                <Table.HeaderCell>Total stacking</Table.HeaderCell>
                <Table.HeaderCell>Total redeem</Table.HeaderCell>
                <Table.HeaderCell>Total open staking</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data &&
                data.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>#{item.productId}</Table.Cell>
                    <Table.HeaderCell>{item.base}</Table.HeaderCell>
                    <Table.HeaderCell>{item.quote}</Table.HeaderCell>
                    <Table.Cell> {formatAmount(item.poolSize)} {item.base}</Table.Cell>
                    <Table.Cell> {formatAmount(item.totalStaking)} {item.base}</Table.Cell>
                    <Table.Cell>{formatAmount(item.totalRedeem)} {item.quote}</Table.Cell>
                    <Table.Cell>{formatAmount(item.totalNewStaking)} </Table.Cell>
                  </Table.Row>
                ))}
              {data && data.itemCount === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={6}>Please fill select options and search.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>

      </Segment>
    )
  );
}

export default StakingStatistic;
