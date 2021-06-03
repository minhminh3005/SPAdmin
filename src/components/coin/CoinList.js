import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Segment,
  Table,
  Input,
  Button,
  Modal,
  Icon,
  Image,
  Header,
} from "semantic-ui-react";
import { checkScope } from "../../settings";
import { post } from "../../utils/api";
import CoinForm from "./CoinForm";
import { imageURL } from "../../utils/api";

function Edit({ item, callback }) {
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };

  return (
    item && (
      <Modal onClose={_close} open={item !== null} closeIcon>
        <Modal.Header>Edit Coin Detail</Modal.Header>
        <Modal.Content>
          <CoinForm action="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function CoinList() {
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);
  const history = useHistory();
  useEffect(() => {
    post(
      `/fund-service/coin/list`,
      {
        pageSize: 1000,
      },
      _success
    );
  }, []);

  const _success = (e) => {
    setList(e);
  };

  return (
    list && (
      <>
        <Header>List Coins</Header>
        <Segment id="product_button_add" vertical>
        <Button
          content='Add Coin'
          onClick={() => history.push("/coin/create")}
        />
      </Segment>
        <Segment loading={!list} vertical>
          <Table celled striped selectable compact="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Coin</Table.HeaderCell>
                <Table.HeaderCell>Network</Table.HeaderCell>
                <Table.HeaderCell>Color</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Withdraw Fee</Table.HeaderCell>
                <Table.HeaderCell>In System</Table.HeaderCell>
                <Table.HeaderCell>Has address tag</Table.HeaderCell>
                <Table.HeaderCell>Deposit</Table.HeaderCell>
                <Table.HeaderCell>Withdraw</Table.HeaderCell>
                <Table.HeaderCell>Enable</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {list.items.map((s, i) => (
                <Table.Row key={i}>
                  <Table.Cell style={{ display: "flex" }}>
                    <Image
                      style={{ width: "20px", height: "20px" }}
                      src={imageURL + `/coins/${s.code}.png`}
                      alt=""
                      size="mini"
                    />
                    <div style={{ margin: "auto 0", paddingLeft: "10px" }}>
                      {s.code}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{s.network}</Table.Cell>
                  <Table.Cell>
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        border: "1px solid #000",
                        backgroundColor: s.color,
                      }}
                    ></div>
                  </Table.Cell>
                  <Table.Cell>${s.usdPrice}</Table.Cell>
                  <Table.Cell>{s.withdrawFee}</Table.Cell>
                  <Table.Cell>
                    {s.isInSystem ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {s.hasAddressTag ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {s.depositEnable ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {s.withdrawEnable ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {s.enable ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {checkScope(["COIN_FULL"]) && (
                      <Link to="#" onClick={() => setItem(s)}>
                        Edit
                      </Link>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
        <Edit
          item={item}
          callback={() => {
            setItem(null);
            post(`/fund-service/coin/list`, { pageSize: 1000 }, _success);
          }}
        />
      </>
    )
  );
}

export default CoinList;
