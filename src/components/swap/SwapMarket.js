import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Button,
  Icon,
  Modal,
  Header,
} from "semantic-ui-react";
import { checkScope } from "../../settings";
import { post } from "../../utils/api";
import SwapMarketForm from "./SwapMarketForm";
import { useHistory } from 'react-router-dom';

function Edit({ item, callback }) {
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };

  return (
    item && (
      <Modal onClose={_close} open={item !== null} closeIcon>
        <Modal.Header>Edit Swap Market</Modal.Header>
        <Modal.Content>
          <SwapMarketForm type="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function SwapMarket() {
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);

  const history = useHistory();

  useEffect(() => {
    post(`/swap-service/market/list`, {}, _success);
  }, []);

  const _success = (e) => {
    setList(e);
  };

  return (
    <>
      <Header id="product__header">List Swap Markets</Header>
      <Segment id="product_button_add" vertical>
        <Button
          content='Add New Market'
          onClick={() => history.push("/swap/create-market")}
        />
      </Segment>

      <Segment vertical loading={!list}>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Coin</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Is In System</Table.HeaderCell>
              <Table.HeaderCell>Update Interval</Table.HeaderCell>
              {/* <Table.HeaderCell>Last Update</Table.HeaderCell> */}
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {list &&
              list.map((s, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{s.coin}</Table.Cell>
                  <Table.Cell>{s.usdPrice}</Table.Cell>
                  <Table.Cell>
                    {s.isInSystem ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>{s.updateInterval}s</Table.Cell>
                  {/* <Table.Cell>
                    {new Date(s.lastUpdate).toLocaleString()}
                  </Table.Cell> */}
                  <Table.Cell>
                    {s.isActive ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {checkScope(["SWAP_MARKET_FULL"]) && (
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
          post(`/swap-service/market/list`, {}, _success);
        }}
      />
    </>
  );
}

export default SwapMarket;
