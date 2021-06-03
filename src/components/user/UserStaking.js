import React from "react";
import { Segment, Table } from "semantic-ui-react";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";

function UserStaking({ data }) {
  return (
    <>
      <Segment vertical textAlign="right">
        Total: {data.itemCount}
      </Segment>
      <Segment vertical style={{ overflow: "auto" }}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Yield Amount</Table.HeaderCell>
              <Table.HeaderCell>Estimate Apy(%)</Table.HeaderCell>
              <Table.HeaderCell>Duration(days)</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.base}
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
                <Table.Cell colSpan={8}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(UserStaking, {
  filterBy: ["id", "from", "to", "status"],
  endpoint: `/staking-service/staking/list-by-user/`,
  component: "staking",
});
