import React from "react";
import { useParams } from "react-router-dom";
import { Segment, Table } from "semantic-ui-react";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";

function UserOrders({ data }) {
  console.log(data);
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
              <Table.HeaderCell>Pair</Table.HeaderCell>
              <Table.HeaderCell>Side</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Base</Table.HeaderCell>
              <Table.HeaderCell>Quote</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell>{s.symbol}</Table.Cell>
                <Table.Cell>{s.side}</Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.qty)} {s.base}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.total)} {s.quote}
                </Table.Cell>
                <Table.Cell>{s.status}</Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={7}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(UserOrders, {
  filterBy: ["id", "from", "to", "type", "side", "symbol"],
  component: "order",
  endpoint: `/trade-service/order/list-by-user`,
});
