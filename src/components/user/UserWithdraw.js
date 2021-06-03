import React, { useEffect, useState } from "react";
import {
  Dimmer,
  Icon,
  Segment,
  Table,
  Header,
  Grid,
  Label,
} from "semantic-ui-react";
import { formatAddress, getLinkHash, getLinkProfile } from "../../settings";
import { INTERNAL } from "../../settings/constants";
import { formatAmount, formatTime } from "../../settings/format";
import { get } from "../../utils/api";
import SearchHigherComponent from "../SearchHigherComponent";
import Notes from "../withdraw/Notes";

function UserWithdraw({ data }) {
  const [selected, setSelected] = useState(null);
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
        Total: {data.itemCount}
      </Segment>
      <Segment vertical style={{ overflow: "auto" }}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Tx Hash</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Fee</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {s.type === INTERNAL
                    ? getLinkProfile(s.receiverId, s.receiver)
                    : getLinkHash(s)}
                </Table.Cell>
                <Table.Cell>{formatAddress(s.address)}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.coin}
                </Table.Cell>
                <Table.Cell>
                  {s.fee} {s.coin}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
                <Table.Cell textAlign="center">{s.status}</Table.Cell>
                <Table.Cell>
                  <Icon name="eye" link onClick={() => setSelected(s.id)} />
                </Table.Cell>
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
      <Notes id={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default SearchHigherComponent(UserWithdraw, {
  filterBy: ["id", "txHash", "from", "to", "coin", "type", "status"],
  endpoint: `/fund-service/withdraw/list-by-user/`,
});
