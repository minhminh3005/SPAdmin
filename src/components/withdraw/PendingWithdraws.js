import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Segment,
  Table,
  Input,
  Button,
  Modal,
  Grid,
  Checkbox,
  Header,
  Icon,
  Label,
  Dimmer,
} from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import {
  checkScope,
  formatAddress,
  getLinkHash,
  getLinkProfile,
} from "../../settings";
import { INTERNAL } from "../../settings/constants";
import { formatTime, formatAmount } from "../../settings/format";
import { get, put } from "../../utils/api";
import SearchHigherComponent from "../SearchHigherComponent";
import Notes from "./Notes";
import { copyToClipboard } from "../../utils/util";

function ApproveWithdraw({ item, callback }) {
  const [gaCode, setGaCode] = useState("");
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };

  const _handleApproveWithdraw = () => {
    const body = {
      ids: [item.id],
      gaCode,
    };
    console.log(body);
    put("/fund-service/withdraw/approve", body, (e) => console.log(e));
  };

  return (
    item && (
      <Modal onClose={_close} closeIcon open>
        <Modal.Header>Approve Withdraw</Modal.Header>
        <Modal.Content>
          <p>ID: {item.id}</p>
          <p>Email: {item.email}</p>
          <p>Address: {item.address}</p>
          <p>
            Amount: {item.amount} {item.coin}
          </p>
          <p>Fee: {item.fee}</p>
          <p>Time: {new Date(item.time).toLocaleDateString()}</p>
        </Modal.Content>
        <Modal.Actions>
          <Input
            label="GA"
            value={gaCode}
            onChange={(e, { value }) => setGaCode(value)}
          />
          <Button color="green" onClick={_handleApproveWithdraw}>
            Approve
          </Button>
        </Modal.Actions>
      </Modal>
    )
  );
}

function PendingWithdraw({ data, onReload }) {
  const [list, setList] = useState(data);
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);

  const _handleApprove = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Approve selected withdraws ?",
        callback: () => {
          const temp = [];
          list.items.forEach((element) => {
            if (element.selected) temp.push(element.id);
          });
          put(
            `/fund-service/withdraw/approve`,
            {
              ids: temp,
              gaCode: null,
            },
            () => {
              toast("Selected withdraw is approved");
              onReload();
            }
          );
        },
      },
    });
  };

  const _handleCancel = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Cancel selected withdraws ?",
        callback: () => {
          const temp = [];
          list.items.forEach((element) => {
            if (element.selected) temp.push(element.id);
          });
          put(
            `/fund-service/withdraw/cancel`,
            {
              ids: temp,
              gaCode: null,
            },
            () => {
              toast("Selected withdraw is cancel");
              onReload();
            }
          );
        },
      },
    });
  };

  return (
    <>
      {data.meta && data.meta.length !== 0 ? (
        <>
          <Header>Meta</Header>
          <Segment vertical>
            <Grid columns={5}>
              {data.meta.map((item, index) => {
                return (
                  <Grid.Column key={index} id="meta__custome">
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

      <Header>List Pending Withdraws</Header>
      <Segment vertical>
        <Grid>
          <Grid.Column width={10}>
            {checkScope(["WITHDRAW_FULL"]) && (
              <>
                <Button onClick={_handleApprove}>Approve</Button>
                <Button onClick={_handleCancel}>Cancel</Button>
              </>
            )}
          </Grid.Column>
          <Grid.Column width={6} verticalAlign="middle" textAlign="right">
            Total: {list.itemCount}
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment vertical loading={!list} id="horizontal_scroll_table">
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>
                <Checkbox
                  onChange={(e, { checked }) => {
                    list.items.forEach((element) => {
                      element.selected = checked;
                    });
                    setList({ ...list });
                  }}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Tx Hash</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {list.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Checkbox
                    checked={s.selected}
                    onChange={(e, { checked }) => {
                      s.selected = checked;
                      setList({ ...list });
                    }}
                  />
                </Table.Cell>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">
                  {getLinkProfile(s.userId, s.email)}
                  <Link to="#">
                    {" "}
                    <i
                      aria-hidden="true"
                      className="copy disabled icon teal"
                      onClick={() => copyToClipboard(s.email)}
                    ></i>
                  </Link>
                </Table.Cell>
                <Table.Cell>{getLinkHash(s)}</Table.Cell>
                <Table.Cell>{formatAddress(s.address)}</Table.Cell>
                <Table.Cell textAlign="right">
                  {s.amount} {s.coin}
                </Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
                <Table.Cell textAlign="center">{s.status}</Table.Cell>
                <Table.Cell>
                  <Icon name="eye" link onClick={() => setSelected(s.id)} />
                </Table.Cell>
              </Table.Row>
            ))}
            {list && list.itemCount === 0 && (
              <Table.Row>
                <Table.Cell colSpan={10}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
      <ApproveWithdraw item={item} callback={() => setItem(null)} />
      <Notes id={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default SearchHigherComponent(PendingWithdraw, {
  filterBy: ["id", "txHash", "from", "to", "coin", "type", "email", "address"],
  endpoint: `/fund-service/withdraw/list`,
  status: "PENDING",
  component: "fund-pendingWithdraw",
  exportLink: "/fund-service/withdraw/list/export",
});
