import React from "react";
import { Segment, Table } from "semantic-ui-react";
import { getLinkProfile } from "../../settings";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";

function UserTransactions({ data }) {
  return (
    <>
      <Segment vertical textAlign="right">
        Total: {data.itemCount}
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
                <Table.Cell>
                  {getLinkProfile(s.refUserId, s.senderEmail)}
                </Table.Cell>
                <Table.Cell>
                  {getLinkProfile(s.userId, s.receiverEmail)}
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

export default SearchHigherComponent(UserTransactions, {
  filterBy: ["type", "coin"],
  endpoint: `/fund-service/fund/transaction/list-by-user/`,
  component: "transaction",
});
