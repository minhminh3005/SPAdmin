import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Button,
  Icon,
  Modal,
  Header,
  Image,
  Form,
} from "semantic-ui-react";
import { checkScope } from "../../settings";
import { post } from "../../utils/api";
import SwapProductForm from "./SwapProductForm";
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
        <Modal.Header>Edit Swap Product</Modal.Header>
        <Modal.Content>
          <SwapProductForm type="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function SwapProduct() {
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);
  const history = useHistory();
  useEffect(() => {
    post(`/swap-service/product/list`, {}, _success);
  }, []);

  const _success = (e) => {
    setList(e);
  };

  return (
    <>
      <Header id="product__header">List Swap Products</Header>
      {/* <Segment vertical loading={!list} style={{ marginTop: "-15px" }} > */}
      <Segment id="product_button_add" vertical>
        <Button
          content='Add Product'
          onClick={() => history.push("/swap/create-product")}
        />
      </Segment>
      <Segment loading={!list} vertical className="column_fixed" id="horizontal_scroll_table">
        <Table celled selectable compact="very" basic="very" singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Base</Table.HeaderCell>
              <Table.HeaderCell>Quote</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Fee</Table.HeaderCell>
              <Table.HeaderCell>Min</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Last update</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {list &&
              list.map((s, i) => (
                <Table.Row key={i} negative={s.isActive ? false : true}>
                  <Table.Cell id="coin__image">
                    <Image className="image" src={imageURL + `/coins/${s.base}.png`} alt="" size='mini' />
                    <div className="coin">
                      {s.base}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div id="coin__image">
                      <Image className="image" src={imageURL + `/coins/${s.quote}.png`} alt="" size='mini' />
                      <div className="coin"> {s.quote}</div>

                    </div>
                  </Table.Cell>
                  <Table.Cell>{s.price}</Table.Cell>
                  <Table.Cell>{s.fee}</Table.Cell>
                  <Table.Cell>{s.minAmount}</Table.Cell>
                  <Table.Cell>
                    {s.isActive ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(s.lastUpdate).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {checkScope(["SWAP_PRODUCT_FULL"]) && (
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

      {/* </Segment> */}
      <Edit
        item={item}
        callback={() => {
          setItem(null);
          post(`/swap-service/product/list`, {}, _success);
        }}
      />
    </>
  );
}

export default SwapProduct;
