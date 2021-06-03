import React from "react";
import { Link } from 'react-router-dom';
import { Segment, Table, Header, Label, Grid } from "semantic-ui-react";
import { INTERNAL } from "../../settings/constants";
import { formatTime, formatAmount } from "../../settings/format";
import { formatAddress, getLinkHash, getLinkProfile } from "../../settings";
import SearchHigherComponent from "../SearchHigherComponent";
import { copyToClipboard } from "../../utils/util";

function DepositList({ data }) {
  return (
    <>
      <Header>Meta</Header>
      <Segment vertical>
        <Grid columns={5}>
          {data.meta ? data.meta.map((item, index) => {
            return (
              <Grid.Column key={index} style={{padding: "10px"}}>
                <Label style={{ fontSize: "13px", padding: "10px", marginBottom: "3px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                  {item.coin}
                  <Label.Detail>{formatAmount(item.amount)}</Label.Detail>
                </Label>
              </Grid.Column>

            );
          }) : "Meta not found"}
        </Grid>

      </Segment>
      <Segment vertical textAlign="right" style={{ marginTop: "10px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header>List Deposits</Header>
          </Grid.Column>
          <Grid.Column computer={8}>
            <p>Total: {data.itemCount}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment vertical loading={!data} id="horizontal_scroll_table">
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Hash</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data &&
              data.items.map((s, i) => (
                <Table.Row key={i}>
                  <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                  <Table.Cell className="table_cell_copyhand">{getLinkProfile(s.userId, s.email)} <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.email)}></i></Link> </Table.Cell>
                  <Table.Cell>
                    {getLinkHash(s)}
                  </Table.Cell>
                  <Table.Cell>{formatAddress(s.address)}</Table.Cell>
                  <Table.Cell>{s.type}</Table.Cell>
                  <Table.Cell>
                    {s.amount} {s.coin}
                  </Table.Cell>
                  <Table.Cell>{formatTime(s.time)}</Table.Cell>
                  <Table.Cell>{s.status}</Table.Cell>
                </Table.Row>
              ))}
            {data && data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell style={{textAlign: "center"}} colSpan={12}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(DepositList, {
  endpoint: `/fund-service/deposit/list`,
  filterBy: ["id", "email", "txHash", "coin", "type", "from", "to", "address"],
  component: "fund-deposit",
  exportLink: "/fund-service/deposit/list/export",
});
