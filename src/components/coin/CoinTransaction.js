import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SearchHigherComponent from "../SearchHigherComponent";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Header,
  Form,
  Dropdown,
  Label,
  Grid,
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { formatAmount, formatTime } from "../../settings/format";
import { getLinkProfile } from "../../settings";
import { copyToClipboard } from "../../utils/util";

function CoinTransaction({ data }) {
  return (
    <>
      <Header>Meta</Header>
      <Segment vertical>
        <Grid columns={5}>
        {data.meta ? data.meta.map((item, index) => {
          return (
            <Grid.Column key={index} id="meta__custome">
            <Label className="meta__label">
              {item.coin}
              <Label.Detail>{formatAmount(item.amount)}</Label.Detail>
            </Label>
            </Grid.Column>
          );
        }) : "Meta not found"}
        </Grid>
      </Segment>
      <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header>List Transactions</Header>
          </Grid.Column>
          <Grid.Column computer={8}>
            <p>Total: {data.itemCount}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment loading={!data} vertical>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Sender</Table.HeaderCell>
              <Table.HeaderCell>Receiver</Table.HeaderCell>
              <Table.HeaderCell>Coin</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Created Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">
                  {getLinkProfile(s.refUserId, s.senderEmail)}
                  <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.senderEmail)}></i></Link>
                </Table.Cell>
                <Table.Cell>
                  {getLinkProfile(s.userId, s.receiverEmail)}
                  <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.receiverEmail)}></i></Link>
                </Table.Cell>
                <Table.Cell>{s.coin}</Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.coin}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={9}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}
export default SearchHigherComponent(CoinTransaction, {
  endpoint: `/fund-service/transaction/list`,
  filterBy: ["senderEmail", "receiverEmail", "from", "to", "coin", "type"],
  component: "transaction",
  exportLink: "/fund-service/transaction/list/export"
});
