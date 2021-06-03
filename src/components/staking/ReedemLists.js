import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Header,
  Grid,
  Dropdown,
  Button,
  Label,
  Form,
} from "semantic-ui-react";
import { post } from "../../utils/api";
import CustomPagination from "../CustomPagination";
import { StatusCode } from "../../settings/constants";
import { formatAmount, formatTime } from "../../settings/format";
import { getLinkProfile } from "../../settings";
import SearchHigherComponent from "../SearchHigherComponent";
import { copyToClipboard } from "../../utils/util";

function ReedemLists({ data }) {
  return (
    <>
      {data.meta && data.meta.length !== 0 ? (
        <>
          <Header>Meta</Header>
          <Segment vertical>
            <Grid columns={5}>
              {data.meta.map((item, index) => {
                return (
                  <Grid.Column id="meta__custome" key={index}>
                    <Label className="meta__label">
                      {item.coin}
                      <Label.Detail>{formatAmount(item.amount)}</Label.Detail>
                    </Label>
                  </Grid.Column>
                );
              })}
            </Grid>
          </Segment>
        </>
      ) : (
        "Meta not found"
      )}
      <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header style={{ margin: 0 }}>List Reedems</Header>
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
              <Table.HeaderCell>UserID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Staking Coin</Table.HeaderCell>
              <Table.HeaderCell>Redeem Coin</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Staking Id</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Last Redeem</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.userId}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">
                  {getLinkProfile(s.userId, s.email)}
                  <Link to="#">
                    <i
                      aria-hidden="true"
                      className="copy disabled icon teal"
                      onClick={() => copyToClipboard(s.email)}
                    ></i>
                  </Link>
                </Table.Cell>
                <Table.Cell>{s.base}</Table.Cell>
                <Table.Cell>{s.quote}</Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>{s.amount}</Table.Cell>
                <Table.Cell>{s.stakingId}</Table.Cell>
                <Table.Cell>{s.price}</Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell style={{ textAlign: "center" }} colSpan={12}>
                  No records found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}
export default SearchHigherComponent(ReedemLists, {
  endpoint: `/staking-service/staking/transaction/list`,
  filterBy: ["userId", "email", "from", "to", "stakingId"],
  component: "staking",
  exportLink: "/staking-service/staking/transaction/export",
});
