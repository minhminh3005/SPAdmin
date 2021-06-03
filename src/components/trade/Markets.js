import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Segment,
  Table,
  Input,
  Button,
  Modal,
  Icon,
  Header,
  Form,
} from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { checkScope } from "../../settings";
import { formatAmount, formatMoney } from "../../settings/format";
import { post, _delete } from "../../utils/api";
import { formatCurrency } from "../../utils/util";
import MarketForm from "./MarketForm";
import { IS_SHARE } from "../../settings/constants";

function Edit({ item, callback }) {
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };

  return (
    item && (
      <Modal onClose={_close} open={item !== null} closeIcon>
        <Modal.Header>Edit Trade Market</Modal.Header>
        <Modal.Content>
          <MarketForm action="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function Markets() {
  const dispatch = useDispatch();
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const history = useHistory();
  useEffect(() => {
    _handleSearch();
  }, []);

  const _success = (e) => {
    setList(e);
  };

  const _handleSearch = (value) => {
    setIsProcessing(true);
    let body = {
      page: 1,
      pageSize: 1000,
      search: "",
      orderBy: "",
      filters: {
        share: value,
      },
    };

    post(`/trade-service/market/list`, body, (result) => {
      setList(result);
      setIsProcessing(false);
    });
  };

  function handleCancelAllOrder(pair) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Are you sure to cancel all order in ${pair}?`,
        callback: () => {
          setIsProcessing(true);
          _delete(
            "/trade-service/order/cancel-all-by-pair?pair=" + pair,
            null,
            () => {
              toast.success("Cancel order success!");
              setIsProcessing(false);
            },
            () => {
              toast.warning("Cancel order fail!");
              setIsProcessing(false);
            }
          );
        },
      },
    });
  }

  return (
    list && (
      <>
        <Header>Trade Markets</Header>
        <Segment
          style={{
            textAlign: "right",
            marginRight: "20px",
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
          vertical
        >
          <Form.Select
            label="Share Oder Book from"
            clearable
            placeholder="Select share"
            onChange={(e, { value }) => _handleSearch(value)}
            options={IS_SHARE}
            selectOnBlur={false}
          />
          <Button
            content="Create Market"
            onClick={() => history.push("/trade/create-market")}
          />
        </Segment>
        <Segment
          loading={!list || isProcessing}
          vertical
          id="horizontal_scroll_table"
        >
          <Table celled striped selectable compact="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Last price</Table.HeaderCell>
                <Table.HeaderCell>Low</Table.HeaderCell>
                <Table.HeaderCell>High</Table.HeaderCell>
                <Table.HeaderCell>Volume</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>IsShare</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Interval</Table.HeaderCell>
                <Table.HeaderCell>Min Trade</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {list.items.map((s, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{s.symbol}</Table.Cell>
                  <Table.Cell>{formatAmount(s.close)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.low)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.high)}</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(s.volume)} {s.base} /{" "}
                    {formatCurrency(s.quoteVolume)} {s.quote}
                  </Table.Cell>
                  <Table.Cell>{s.status}</Table.Cell>
                  <Table.Cell>{s.share}</Table.Cell>
                  <Table.Cell>{s.type}</Table.Cell>
                  <Table.Cell>{formatAmount(s.interval)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.minTrade)}</Table.Cell>
                  <Table.Cell>
                    {checkScope(["COIN_FULL"]) && (
                      <Link to="#" onClick={() => setItem(s)}>
                        Edit
                      </Link>
                    )}
                    <span style={{ marginLeft: "10px" }}>|</span>
                    {checkScope(["COIN_FULL"]) && (
                      <Link
                        to="#"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleCancelAllOrder(s.symbol)}
                      >
                        Cancel all order
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
            post(`/trade-service/market/list`, {}, _success);
          }}
        />
      </>
    )
  );
}

export default Markets;
