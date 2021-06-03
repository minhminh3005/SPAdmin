import React from "react";
import { Link } from 'react-router-dom';
import { Segment, Table } from "semantic-ui-react";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";
import { copyToClipboard } from "../../utils/util";

function UserFundLogs({ data }) {
  return (
    <>
      <Segment vertical textAlign="right">
        Total: {data.itemCount}
      </Segment>
      <Segment vertical style={{ overflow: "auto" }}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.Cell className="table_cell_copyhand">{s.operator}<Link to="#"> <i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.operator)}></i></Link></Table.Cell>
                <Table.Cell>
                  {s.amount < 0 ? "-" : "+"}
                  {formatAmount(s.amount)} {s.coin}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={3}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(UserFundLogs, {
  filterBy: ["coin", "from", "to", "operator"],
  endpoint: `/fund-service/fund/fund-log/list-by-user/`,
});
