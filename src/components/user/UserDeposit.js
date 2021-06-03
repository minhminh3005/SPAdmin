import React from "react";
import { Segment, Table, Header, Grid, Label } from "semantic-ui-react";
import { getLinkHash, getLinkProfile } from "../../settings";
import { INTERNAL } from "../../settings/constants";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";

function UserDeposit({ data }) {
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
      <Segment vertical textAlign="right">
        <p>Total: {data.itemCount}</p>
      </Segment>
      <Segment vertical style={{ overflow: "auto" }}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Hash</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell>
                  {s.type === INTERNAL
                    ? getLinkProfile(s.senderId, s.sender)
                    : getLinkHash(s)}
                </Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.coin}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
                <Table.Cell>{s.status}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={6}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(UserDeposit, {
  filterBy: ["id", "txHash", "from", "to", "coin", "type"],
  endpoint: `/fund-service/deposit/list-by-user/`,
});
