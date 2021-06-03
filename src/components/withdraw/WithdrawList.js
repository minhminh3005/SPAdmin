import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Segment,
  Table,
  Input,
  Container,
  Button,
  Grid,
  Dropdown,
  Checkbox,
  Header,
  Dimmer,
  Icon,
  Label,
} from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import {
  checkScope,
  formatAddress,
  getLinkHash,
  getLinkProfile,
} from "../../settings";
import { INTERNAL, StatusCode } from "../../settings/constants";
import { formatTime, formatAmount } from "../../settings/format";
import { get, post, put } from "../../utils/api";
import SearchHigherComponent from "../SearchHigherComponent";
import Notes from "./Notes";
import { copyToClipboard } from "../../utils/util";

const statusList = [
  {
    key: 1,
    value: StatusCode.WAITING_CONFIRM,
    text: StatusCode.WAITING_CONFIRM,
  },
  {
    key: 2,
    value: StatusCode.PENDING,
    text: StatusCode.PENDING,
  },
  {
    key: 3,
    value: StatusCode.APPROVED,
    text: StatusCode.APPROVED,
  },
  {
    key: 4,
    value: StatusCode.CONFIRMING,
    text: StatusCode.CONFIRMING,
  },
  {
    key: 5,
    value: StatusCode.CONFIRMED,
    text: StatusCode.CONFIRMED,
  },
  {
    key: 6,
    value: StatusCode.CANCELED,
    text: StatusCode.CANCELED,
  },
  {
    key: 7,
    value: StatusCode.FAILED,
    text: StatusCode.FAILED,
  },
  {
    key: 8,
    value: StatusCode.BLOCKED,
    text: StatusCode.BLOCKED,
  },
];

function UpdateStatusSelect({ update, close, count }) {
  const [hash, setHash] = useState(null);
  const [value, setValue] = useState(statusList[0].value);
  return (
    <Dimmer page active>
      <Segment style={{ width: 300 }}>
        <Header>Select Status</Header>
        <Dropdown
          selection
          options={statusList}
          fluid
          search
          onChange={(e, { value }) => setValue(value)}
          value={value}
        />
        <br />
        {count === 1 && (
          <>
            <Input
              placeholder="Enter transaction hash"
              fluid
              onChange={(e, { value }) => setHash(value)}
            />
            <br />
          </>
        )}
        <Container fluid>
          <Button negative style={{ width: 130 }} onClick={close}>
            Cancel
          </Button>
          <Button
            positive
            style={{ width: 130 }}
            onClick={() => update({ value, hash })}
          >
            Update
          </Button>
        </Container>
      </Segment>
    </Dimmer>
  );
}

function WithdrawList({ data, onReload }) {
  const [list, setList] = useState(data);
  const dispatch = useDispatch();
  const [checkAll, setCheckAll] = useState(false);
  const [updating, setUpdating] = useState(false);
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

  const _handleBroadcast = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Broadcast selected withdraws ?",
        callback: () => {
          post(`/fund-service/withdraw/broadcast`, {}, () => {
            toast("Selected withdraw is broadcast");
            onReload();
          });
        },
      },
    });
  };

  const _handleUpdateStatus = (e) => {
    setUpdating(false);
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Update selected withdraws status ?",
        callback: () => {
          const temp = [];
          const txId = [];
          list.items.forEach((element) => {
            if (element.selected) {
              temp.push(element.id);
              txId.push(element.txId);
            }
          });
          put(
            `/fund-service/withdraw/update-status`,
            {
              ids: temp,
              status: e.value,
              txId: e.hash,
            },
            () => {
              toast("Selected withdraw status is updated");
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

      <Header>List Withdraws</Header>
      <Segment vertical>
        <Grid>
          <Grid.Column width={10}>
            {checkScope(["WITHDRAW_FULL"]) && (
              <>
                <Button onClick={_handleApprove}>Approve</Button>
                <Button onClick={_handleCancel}>Cancel</Button>
                <Button onClick={_handleBroadcast}>Broadcast</Button>
                <Button onClick={() => setUpdating(true)}>Update Status</Button>
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
            <Table.Row>
              <Table.HeaderCell>
                <Checkbox
                  onChange={(e, { checked }) => {
                    list.items.forEach((element) => {
                      element.selected = checked;
                    });
                    setList({ ...list });
                    setCheckAll(checked);
                  }}
                  checked={checkAll}
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
                    <i
                      aria-hidden="true"
                      className="copy disabled icon teal"
                      onClick={() => copyToClipboard(s.email)}
                    ></i>
                  </Link>
                </Table.Cell>
                <Table.Cell>{getLinkHash(s)}</Table.Cell>
                <Table.Cell>{formatAddress(s.address)}</Table.Cell>
                <Table.Cell>
                  {s.amount} {s.coin}
                </Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
                <Table.Cell>{s.status}</Table.Cell>
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
      {updating && (
        <UpdateStatusSelect
          close={() => setUpdating(false)}
          update={_handleUpdateStatus}
          count={list.items.filter((element) => element.selected).length}
        />
      )}
      <Notes id={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default SearchHigherComponent(WithdrawList, {
  filterBy: [
    "id",
    "txHash",
    "from",
    "to",
    "coin",
    "type",
    "email",
    "status",
    "address",
  ],
  endpoint: `/fund-service/withdraw/list`,
  component: "fund-widthdraw",
  exportLink: "/fund-service/withdraw/list/export",
});
