import React from "react";
import { Segment, Table } from "semantic-ui-react";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";

function UserSwap({ data }) {
  return (
    <>
      <Segment vertical textAlign="right">
        <p>Total: {data.itemCount}</p>
      </Segment>
      <Segment vertical style={{ overflow: "auto" }}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Base</Table.HeaderCell>
              <Table.HeaderCell>Quote</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.base}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.total)} {s.quote}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={4}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(UserSwap, {
  filterBy: ["id", "base", "quote", "from", "to"],
  endpoint: `/swap-service/swap/list-by-user/`,
});
