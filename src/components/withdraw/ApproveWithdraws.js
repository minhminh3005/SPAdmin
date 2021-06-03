import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Tab,
  Container,
  Divider,
  Button,
  Modal,
  Form,
  Grid,
  Dropdown,
  Checkbox,
  Label,
  Radio,
  Header,
  Icon,
} from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import {
  checkScope,
  formatAddress,
  getLinkHash,
  getLinkProfile,
} from "../../settings";
import { INTERNAL, StatusCode } from "../../settings/constants";
import { formatTime } from "../../settings/format";
import { post, put, _delete } from "../../utils/api";
import CustomPagination from "../CustomPagination";
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

function ApproveWithdraws({ data, onReload }) {
  const [list, setList] = useState(data);
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);

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

  return (
    list && (
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
                        <Label.Detail>{item.amount}</Label.Detail>
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

        <Header>List Approve Withdraws</Header>
        <Segment vertical>
          <Grid>
            <Grid.Column width={10}>
              {checkScope(["WITHDRAW_FULL"]) && (
                <>
                  <Button onClick={_handleBroadcast}>Broadcast</Button>
                </>
              )}
            </Grid.Column>
            <Grid.Column width={6} verticalAlign="middle" textAlign="right">
              Total: {list.itemCount}
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment vertical loading={!list} id="horizontal_scroll_table">
          <Table
            celled
            striped
            selectable
            compact="very"
            basic="very"
            singleLine
          >
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
    )
  );
}

export default SearchHigherComponent(ApproveWithdraws, {
  filterBy: ["id", "txHash", "from", "to", "coin", "type", "email", "address"],
  endpoint: `/fund-service/withdraw/list`,
  status: "APPROVED",
  component: "fund-approveWithdraws",
  exportLink: "/fund-service/withdraw/list/export",
});
