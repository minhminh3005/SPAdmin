import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useState } from "react";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Header,
  Grid,
  Dropdown,
  Button,
  Form,
} from "semantic-ui-react";
import { post } from "../../utils/api";
import CustomPagination from "../CustomPagination";
import { StatusCode } from "../../settings/constants";
import { formatAmount, formatTime } from "../../settings/format";
import { getLinkProfile } from "../../settings";
import SearchHigherComponent from "../SearchHigherComponent";
import StakingStatistic from './StakingStatistic';
import { copyToClipboard } from "../../utils/util";

function StakingList({ data }) {
  return (
    <>
      <StakingStatistic meta={data.meta} />
      <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header>List Stakings</Header>
          </Grid.Column>
          <Grid.Column computer={8}>
            <p>Total: {data.itemCount}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment loading={!data} vertical id="horizontal_scroll_table">
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Coin</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Product Id</Table.HeaderCell>
              <Table.HeaderCell>Daily Profit</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Yield Amount</Table.HeaderCell>
              <Table.HeaderCell>Estimate Apy(%)</Table.HeaderCell>
              <Table.HeaderCell>Duration(day)</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">{getLinkProfile(s.userId, s.email)}
                  <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.email)}></i></Link>
                </Table.Cell>
                <Table.Cell>{s.base}</Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>{s.productId}</Table.Cell>
                <Table.Cell>{s.dailyProfit}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.coin}
                </Table.Cell>
                <Table.Cell>{s.yieldAmount}</Table.Cell>
                <Table.Cell>{s.estimateApy}</Table.Cell>
                <Table.Cell>{s.duration}</Table.Cell>
                <Table.Cell>{s.status}</Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell style={{ textAlign: "center" }} colSpan={12}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(StakingList, {
  endpoint: `/staking-service/staking/list`,
  filterBy: ["id", "email", "from", "to", "status", "productId"],
  component: "staking",
  exportLink: "/staking-service/staking/export",
});
