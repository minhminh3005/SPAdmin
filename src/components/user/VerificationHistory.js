import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SearchHigherComponent from "../SearchHigherComponent";
import UserVerificationModal from "./UserVerificationModal";
import { copyToClipboard } from "../../utils/util";

function VerifyHistory({ data, onReload }) {
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  return (
    <>
      <Table celled striped selectable compact="very" basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.items.map((item, index) => (
            <Table.Row key={index}>
              <Table.HeaderCell>#{item.id}</Table.HeaderCell>
              <Table.Cell className="table_cell_copyhand">
                <Link onClick={() => setCurrentSelectedUser(item)} to="#">
                  {item.email}
                </Link>
                <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(item.email)}></i></Link>
              </Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>{new Date(item.time).toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Link to={`/user-detail/${item.id}`}>Detail</Link>
              </Table.Cell>
            </Table.Row>
          ))}
          {data && data.itemCount === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5}>No records found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <UserVerificationModal
        data={currentSelectedUser}
        callback={() => {
          setCurrentSelectedUser(null);
          onReload();
        }}
      />
    </>
  );
}

export default SearchHigherComponent(VerifyHistory, {
  endpoint: `/user-service/identity-verification/list`,
  filterBy: ["id", "email", "status"],
  component: "verification",
});
