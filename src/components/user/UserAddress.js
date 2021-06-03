import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "semantic-ui-react";
import { get } from "../../utils/api";

function UserAddress() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    get(`/fund-service/fund/address/list-by-user?userId=${id}`, (data) =>
      setData(data)
    );
  },[id]);

  return (
    data && (
      <Table celled striped selectable compact="very" basic="very" singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Coin</Table.HeaderCell>
            <Table.HeaderCell>Network</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Address Tag</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.coin}</Table.Cell>
              <Table.Cell>{item.network}</Table.Cell>
              <Table.Cell>{item.address}</Table.Cell>
              <Table.Cell>{item.addressTag}</Table.Cell>
            </Table.Row>
          ))}
          {data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={4}>No records found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  );
}

export default UserAddress;
