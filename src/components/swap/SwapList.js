import React from "react";
import { Link } from 'react-router-dom';
import { Segment, Table, Header, Grid, Label, Icon } from "semantic-ui-react";
import { getLinkProfile } from "../../settings";
import { formatAmount, formatTime } from "../../settings/format";
import SearchHigherComponent from "../SearchHigherComponent";
import { copyToClipboard, formatCurrency } from "../../utils/util";

function SwapList({ data }) {
  return (
    <>
      <Header>Meta</Header>
      <Segment id="swap_list_meta">
        <Grid columns={3}>
          {data.meta ? data.meta.map((item, index) => {
            return (
              <Grid.Column className="swap_list_gridcolumn"key={index}>
                <Label className="label">
                  <Label.Detail className="label_detail">
                    <p>
                      <span>{formatCurrency(item.baseAmount)} {item.base}</span>
                      <Icon name='arrow right' />
                      <span>{formatCurrency(item.quoteAmount)} {item.quote}</span>
                    </p>
                  </Label.Detail>
                  <br />
                  <Label.Detail  className="label_detail" >
                    Fee: {formatCurrency(item.totalFee)} {item.base}
                  </Label.Detail>
                </Label>
              </Grid.Column>
            )
          }) : "Meta not found"}
        </Grid>
      </Segment>

      <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header>List Swaps</Header>
          </Grid.Column>
          <Grid.Column computer={8}>
            <p>Total: {data.itemCount}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment id="swap_list" loading={!data} vertical>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>From</Table.HeaderCell>
              <Table.HeaderCell>To</Table.HeaderCell>
              <Table.HeaderCell>Fee</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">
                  {getLinkProfile(s.userId, s.email)}
                   <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.email)}></i></Link> 
                    </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.base}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.total)} {s.quote}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.fee)} {s.base}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
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

export default SearchHigherComponent(SwapList, {
  endpoint: `/swap-service/swap/list`,
  filterBy: ["id", "email", "from", "to", "base", "quote"],
  component: "swap",
  exportLink: "/swap-service/swap/list/export",
});
