import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input, Segment, Table } from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { formatAmount } from "../../settings/format";
import { put } from "../../utils/api";
import SearchHigherComponent from "../SearchHigherComponent";
import SendAirdrop from "./SendAirdrop";
import UserVerificationModal from "./UserVerificationModal";
import { copyToClipboard } from "../../utils/util"

function UserAirdrop({ data, onReload }) {
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

  return (
    <>
      <Segment vertical>
        <SendAirdrop onReload={onReload} />
      </Segment>
      <Table celled striped selectable compact="very" basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data &&
            data.items.map((item, index) => (
              <Table.Row key={index}>
                <Table.HeaderCell>#{item.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">
                  <Link to={`/user-detail/${item.userId}`} target="_blank">
                    {item.note}
                  </Link>
                  <Link to="#"><i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(item.note)}></i></Link>
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.amount)} {item.coin}
                </Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{new Date(item.time).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          {data && data.itemCount === 0 && (
            <Table.Row>
              <Table.Cell colSpan={4}>No records found.</Table.Cell>
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

export default SearchHigherComponent(UserAirdrop, {
  endpoint: `/fund-service/transaction/airdrop/list`,
  filterBy: ["email", "coin"],
  component: "",
});
