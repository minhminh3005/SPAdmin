import React, { useEffect, useState } from "react";
import { Header, Icon, Segment, Tab, Table } from "semantic-ui-react";
import { getLinkProfile } from "../../settings";
import { post } from "../../utils/api";

function ReferralStatistic() {
  const [top, setTop] = useState(null);
  useEffect(() => {
    if (!top)
      post(
        `/user-service/referral/top-affiliate`,
        {
          limit: 10,
        },
        (data) => {
          setTop(data);
        }
      );
  }, [top]);
  return (
    <Segment vertical>
      <Header>Top Affiliate</Header>
      {top && (
        <Table selectable striped compact="very" basic="very" celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Top</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Referral</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Icon name="trophy" size="large" color="yellow" />
              </Table.Cell>
              <Table.Cell>{getLinkProfile(top[0].id, top[0].email)}</Table.Cell>
              <Table.Cell>{top[0].totalChildren}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name="trophy" size="large" color="teal" />
              </Table.Cell>
              <Table.Cell>{getLinkProfile(top[1].id, top[1].email)}</Table.Cell>
              <Table.Cell>{top[1].totalChildren}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name="trophy" size="large" color="brown" />
              </Table.Cell>
              <Table.Cell>{getLinkProfile(top[2].id, top[2].email)}</Table.Cell>
              <Table.Cell>{top[2].totalChildren}</Table.Cell>
            </Table.Row>
            {top.map((item, index) => {
              if (index > 2) {
                return (
                  <Table.Row key={index}>
                    <Table.HeaderCell>#{index + 1}</Table.HeaderCell>
                    <Table.Cell>
                      {getLinkProfile(item.id, item.email)}
                    </Table.Cell>
                    <Table.Cell>{item.totalChildren}</Table.Cell>
                  </Table.Row>
                );
              } else return null;
            })}
          </Table.Body>
        </Table>
      )}
    </Segment>
  );
}

export default ReferralStatistic;
