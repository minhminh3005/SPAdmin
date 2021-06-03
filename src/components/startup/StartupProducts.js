import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import _ from "lodash";
import {
  Segment,
  Table,
  Pagination,
  Input,
  Icon,
  Modal,
  Header,
  Form,
  Button,
} from "semantic-ui-react";
// import Button from '@material-ui/core/Button';
import { checkScope } from "../../settings";
import { formatAmount, formatDate, formatTime } from "../../settings/format";
import { post, put } from "../../utils/api";
import StartupProductForm from "./StartupProductForm";
import { useDispatch } from "react-redux";
import { SHOW_POPUP } from "../../redux/constant";
import { toast } from "react-toastify";
import { SELL_MODE } from "../../settings/constants";

function Edit({ item, callback }) {
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };
  return (
    item && (
      <Modal onClose={_close} open={item !== null} closeIcon size="large">
        <Modal.Header>Edit Startup Product</Modal.Header>
        <Modal.Content style={{ height: "70vh", overflow: "auto" }}>
          <StartupProductForm type="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function StartupProduct() {
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  function handleGetList() {
    post(
      `/presale-service/product/list`,
      {
        type: "",
      },
      (result) => setList(result)
    );
  }

  useEffect(() => {
    handleGetList();
  }, []);

  function handleRelease(item) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Release product?",
        callback: () => {
          put(
            `/presale-service/product/release?productId=${item.id}`,
            null,
            () => {
              toast.success("Release product success.");
              handleGetList();
            },
            (error) => {
              toast.error(`Release product fail. ${error ? error.msg : ""}`);
            }
          );
        },
      },
    });
  }

  return (
    <>
      <Header id="product__header">List Startup Products</Header>
      <Segment id="product_button_add" vertical>
        <Button
          content="Add Product"
          onClick={() => history.push("/startup/create-product")}
        />
      </Segment>
      <Segment
        vertical
        loading={!list}
        className="column_fixed"
        id="horizontal_scroll_table"
      >
        <Table
          celled
          selectable
          compact="very"
          basic="very"
          singleLine
          sortable
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Base</Table.HeaderCell>
              <Table.HeaderCell>Quote</Table.HeaderCell>
              <Table.HeaderCell>Product ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Sell Mode</Table.HeaderCell>
              <Table.HeaderCell>User Level</Table.HeaderCell>
              <Table.HeaderCell>Price Type</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Sold / Supply</Table.HeaderCell>
              <Table.HeaderCell>Limit sell</Table.HeaderCell>
              <Table.HeaderCell>Min</Table.HeaderCell>
              <Table.HeaderCell>Max</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Start Date</Table.HeaderCell>
              <Table.HeaderCell>End Date</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {list &&
              list.map((s, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{s.base}</Table.Cell>
                  <Table.Cell>
                    {s.quote.map((item) => `${item} `).toString()}
                  </Table.Cell>
                  <Table.Cell>{s.redirects[0].productId}</Table.Cell>
                  <Table.Cell>{s.type}</Table.Cell>
                  <Table.Cell>{s.sellMode}</Table.Cell>
                  <Table.Cell>{s.requiredLevel}</Table.Cell>
                  <Table.Cell>{s.priceType}</Table.Cell>
                  <Table.Cell>{s.price}</Table.Cell>
                  <Table.Cell>
                    {formatAmount(s.sold)} / {formatAmount(s.displaySupply)}
                  </Table.Cell>
                  <Table.Cell>{formatAmount(s.supply)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.minAmount)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.maxAmount)}</Table.Cell>
                  <Table.Cell>
                    {s.isActive ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatDate(s.startDate)}</Table.Cell>
                  <Table.Cell>{formatDate(s.endDate)}</Table.Cell>
                  <Table.Cell>
                    {checkScope(["PRESALE_PRODUCT_FULL"]) && (
                      <Link to="#" onClick={() => setItem(s)}>
                        Edit
                      </Link>
                    )}
                    {checkScope(["PRESALE_PRODUCT_FULL"]) &&
                      s.sellMode === SELL_MODE[1].key &&
                      !s.isReleased && (
                        <Link
                          to="#"
                          onClick={() => handleRelease(s)}
                          style={{ marginLeft: "15px" }}
                        >
                          Release
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
          handleGetList();
        }}
      />
    </>
  );
}

export default StartupProduct;
