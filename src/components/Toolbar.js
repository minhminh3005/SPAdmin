import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, Form, Segment, Grid, Button } from "semantic-ui-react";
import { API } from "../settings";
import { StatusCode } from "../settings/constants";
import { getAccessToken } from "../utils/auth";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import moment from "moment";
import { toast } from "react-toastify";

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

const typeList = [
  {
    key: 1,
    value: StatusCode.INTERNAL,
    text: StatusCode.INTERNAL,
  },
  {
    key: 2,
    value: StatusCode.EXTERNAL,
    text: StatusCode.EXTERNAL,
  },
  {
    key: 3,
    value: StatusCode.ADMIN,
    text: StatusCode.ADMIN,
  },
];

const userStatusList = [
  {
    key: 1,
    value: StatusCode.NEW,
    text: StatusCode.NEW,
  },
  {
    key: 2,
    value: StatusCode.ACTIVE,
    text: StatusCode.ACTIVE,
  },
  {
    key: 3,
    value: StatusCode.BLOCK,
    text: StatusCode.BLOCK,
  },
];

const verificationStatusList = [
  {
    key: 1,
    value: StatusCode.PENDING,
    text: StatusCode.PENDING,
  },
  {
    key: 2,
    value: StatusCode.VERIFIED,
    text: StatusCode.VERIFIED,
  },
  {
    key: 3,
    value: StatusCode.REJECTED,
    text: StatusCode.REJECTED,
  },
];

const stakingStatusList = [
  {
    key: StatusCode.OPEN,
    value: StatusCode.OPEN,
    text: StatusCode.OPEN,
  },
  {
    key: StatusCode.CLOSED,
    value: StatusCode.CLOSED,
    text: StatusCode.CLOSED,
  },
];

const transactionStatusList = [
  {
    key: "STAKING_REFERRAL",
    value: "STAKING_REFERRAL",
    text: "STAKING_REFERRAL",
  },
  {
    key: "GIFT",
    value: "GIFT",
    text: "GIFT",
  },
  {
    key: "AIRDROP",
    value: "AIRDROP",
    text: "AIRDROP",
  },
  {
    key: "RANKING_BONUS",
    value: "RANKING_BONUS",
    text: "RANKING_BONUS",
  },
  {
    key: "TRADING_AIRDROP",
    value: "TRADING_AIRDROP",
    text: "TRADING_AIRDROP",
  },
  {
    key: "AIRDROP_COMMISSION",
    value: "AIRDROP_COMMISSION",
    text: "AIRDROP_COMMISSION",
  },
];

const transactionPresale = [
  { key: "EASYBUY", value: "EASYBUY", text: "EASYBUY" },
  { key: "IEO_RETURN", value: "IEO", text: "IEO" },
  { key: "IEO_RETURN", value: "IEO_RETURN", text: "IEO_RETURN" },
];

function Toolbar({
  filterBy,
  onSearch,
  component = "",
  defaultStatus,
  exportLink = "",
}) {
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [txHash, setTxHash] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [status, setStatus] = useState(defaultStatus ? defaultStatus : "");
  const [type, setType] = useState("");
  const [history, setHistory] = useState("");
  const [coin, setCoin] = useState("");
  const [base, setBase] = useState("");
  const [quote, setQuote] = useState("");
  const [side, setSide] = useState("");
  const [symbol, setSymbol] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const { manager } = useSelector((state) => state);
  const { fundStatistic, stakingProducts, idProductList } = manager;
  const [productId, setProductId] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [guid, setGuid] = useState("");
  const [address, setAddress] = useState("");
  const [operator, setOperator] = useState("");
  const coinOptions = [];
  const typeIdProduct = [];
  const [stakingId, setStakingId] = useState("");

  if (filterBy.includes("idProduct")) {
    idProductList?.map((item) => {
      typeIdProduct.push({
        key: item.id,
        value: item.id,
        text: `${item.id} / ${item.base} - [${item.quote}]`,
      });
    });
  }

  if (fundStatistic) {
    fundStatistic.statistics.map((item) => {
      // if (item.isActive) {
      coinOptions.push({
        key: item.coin,
        value: item.coin,
        text: item.coin,
      });
    });
  }

  let options;
  let types;
  let orderStatusHistory;
  let orderStatusOpen;
  switch (component) {
    case "user":
      options = userStatusList;
      break;
    case "verification":
      options = verificationStatusList;
      break;
    case "staking":
      options = stakingStatusList;
      break;
    default:
      options = statusList;
      break;
  }

  switch (component) {
    case "order":
      types = [
        { key: "LIMIT", value: "LIMIT", text: "Limit" },
        { key: "MARKET", value: "MARKET", text: "Market" },
        { key: "STOP_LIMIT", value: "STOP_LIMIT", text: "Stop limit" },
        { key: "STOP_MARKET", value: "STOP_MARKET", text: "Stop market" },
      ];
      orderStatusHistory = [
        { key: "FILLED", value: "FILLED", text: "Filled" },
        { key: "CANCELED", value: "CANCELED", text: "Canceld" },
        { key: "REJECTED ", value: "REJECTED", text: "Rejected" },
        { key: "EXPIRED  ", value: "EXPIRED", text: "Expired" },
      ];
      orderStatusOpen = [
        { key: "OPEN", value: "OPEN", text: "Open" },
        {
          key: "PARTIALLY_FILLED",
          value: "PARTIALLY_FILLED",
          text: "PartiallyFill",
        },
      ];
      break;
    case "staking":
      const temp = [];
      if (stakingProducts) {
        stakingProducts.forEach((element) => {
          if (element.isActive) {
            temp.push({
              key: element.id,
              value: element.id,
              text:
                element.base +
                " - " +
                element.quote +
                " - " +
                element.type +
                " - " +
                element.duration +
                " days",
            });
          }
        });
        types = temp;
      }
      break;
    case "transaction":
      types = transactionStatusList;
      break;
    case "presale":
      types = transactionPresale;
      break;
    default:
      types = typeList;
      break;
  }

  const _handleSearch = () => {
    let data = {
      id,
      email: email ? email.trim() : "",
      txId: txHash,
      from: new Date(from + "T00:00:00").getTime(),
      to: new Date(to + "T00:00:00").getTime(),
      status: history || status,
      type,
      coin,
      base,
      quote,
      productId: productId || idProduct,
      side,
      symbol,
      userId: userId ? userId.trim() : "",
      senderEmail: senderEmail ? senderEmail.trim() : "",
      receiverEmail: receiverEmail ? receiverEmail.trim() : "",
      stakingId: stakingId ? stakingId.trim() : "",
      guid: guid ? guid.trim() : "",
      address: address ? address.trim() : "",
      operator: operator ? operator.trim() : "",
    };
    for (var propName in data) {
      if (
        data[propName] === null ||
        data[propName] === undefined ||
        data[propName] === "" ||
        data[propName].length === ""
      ) {
        delete data[propName];
      }
    }
    onSearch(data);
  };

  const _handleReset = () => {
    if (defaultStatus) {
      onSearch({
        status: defaultStatus,
      });
    } else {
      onSearch({});
    }
    setId("");
    setUserId("");
    setEmail("");
    setTxHash("");
    setFrom("");
    setTo("");
    setStatus(defaultStatus ? defaultStatus : "");
    setType("");
    setHistory("");
    setCoin("");
    setBase("");
    setQuote("");
    setSenderEmail("");
    setReceiverEmail("");
    setProductId("");
    setStakingId("");
    setGuid("");
    setAddress("");
    setOperator("");
  };

  const _handleExport = () => {
    // if (
    //   component == "user" &&
    //   ((from == null && to == null) || from == "Invalid date")
    // ) {
    //   toast.warn(
    //     "Please select 'Form Date' and 'To Date' for export (Upto 7 days)"
    //   );
    // } else {

    fetch(`${API}${exportLink}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "bearer " + getAccessToken(),
      },
      method: "POST",
      body: JSON.stringify({
        filters: {
          userId: userId ? userId.trim() : "",
          side,
          type,
          senderEmail: senderEmail ? senderEmail.trim() : "",
          receiverEmail: receiverEmail ? receiverEmail.trim() : "",
          coin,
          from: from ? new Date(from + "T00:00:00").getTime() : 0,
          to: to ? new Date(to + "T00:00:00").getTime() : 0,
          id,
          productId: productId
            ? productId.trim()
            : "" || idProduct
            ? idProduct.trim()
            : "",
          status: status || history,
          email: email ? email.trim() : "",
          symbol,
          base,
          quote,
          stakingId: stakingId ? stakingId.trim() : "",
          guid: guid ? guid.trim() : "",
          txId: txHash ? txHash.trim() : "",
          address: address ? address.trim() : "",
        },
      }),
    })
      .then((res) => res.text())
      .then((json) => {
        var hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(json);
        hiddenElement.target = "_blank";
        hiddenElement.download = `${component}.csv`;
        hiddenElement.click();
      });
    // }
  };

  return (
    <>
      <Segment vertical>
        <Form onSubmit={_handleSearch}>
          <Grid columns={5} style={{ marginBottom: "10px" }}>
            {filterBy.includes("userId") && (
              <Form.Field width={3}>
                <Form.Input
                  label="User ID"
                  placeholder="5678"
                  value={userId}
                  onChange={(e, { value }) => setUserId(value)}
                  disabled={!filterBy.includes("userId")}
                />
              </Form.Field>
            )}
            {filterBy.includes("id") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Order ID"
                  placeholder="5678"
                  value={id}
                  onChange={(e, { value }) => setId(value)}
                  disabled={!filterBy.includes("id")}
                />
              </Form.Field>
            )}
            {filterBy.includes("guid") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Guid"
                  placeholder="c3cd0658fc0447ad85edc94412bc1f73"
                  value={guid}
                  onChange={(e, { value }) => setGuid(value)}
                  disabled={!filterBy.includes("guid")}
                />
              </Form.Field>
            )}
            {filterBy.includes("stakingId") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Staking ID"
                  placeholder="5678"
                  value={stakingId}
                  onChange={(e, { value }) => setStakingId(value)}
                  disabled={!filterBy.includes("stakingId")}
                />
              </Form.Field>
            )}
            {filterBy.includes("productId") && (
              <Form.Field width={3}>
                <label>Package</label>
                <Dropdown
                  options={types}
                  clearable
                  selection
                  placeholder="Select type"
                  value={productId}
                  onChange={(e, { value }) => setProductId(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("idProduct") && (
              <Form.Field width={3}>
                <label>Product ID</label>
                <Dropdown
                  options={typeIdProduct}
                  clearable
                  selection
                  placeholder="Select product ID"
                  value={idProduct}
                  onChange={(e, { value }) => setIdProduct(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("senderEmail") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Sender"
                  placeholder="example@gmail.com"
                  value={senderEmail}
                  onChange={(e, { value }) => setSenderEmail(value)}
                />
              </Form.Field>
            )}
            {filterBy.includes("receiverEmail") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Receiver"
                  placeholder="example@gmail.com"
                  value={receiverEmail}
                  onChange={(e, { value }) => setReceiverEmail(value)}
                />
              </Form.Field>
            )}
            {filterBy.includes("email") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e, { value }) => setEmail(value)}
                />
              </Form.Field>
            )}
            {filterBy.includes("txHash") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Transaction Hash"
                  placeholder="TYPwBbMUsEZR7oFePoZwTvuAP5FEAT1Dqt"
                  value={txHash}
                  onChange={(e, { value }) => setTxHash(value)}
                />
              </Form.Field>
            )}
            {filterBy.includes("from") && (
              <Form.Field width={3} id="date_datapicker">
                <SemanticDatepicker
                  label="From Date"
                  id="initialDate"
                  onChange={(e, { value }) =>
                    setFrom(moment(value).format("YYYY-MM-DD"))
                  }
                />
              </Form.Field>
            )}
            {filterBy.includes("to") && (
              <Form.Field width={3} id="date_datapicker">
                <SemanticDatepicker
                  label="To Date"
                  id="initialDate"
                  onChange={(e, { value }) =>
                    setTo(moment(value).format("YYYY-MM-DD"))
                  }
                />
              </Form.Field>
            )}
            {filterBy.includes("status") && (
              <Form.Field width={3}>
                <label>Status</label>
                <Form.Select
                  options={options}
                  clearable
                  selection
                  placeholder="Select status"
                  value={status}
                  onChange={(e, { value }) => setStatus(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("type") && (
              <Form.Field disabled={!filterBy.includes("type")} width={3}>
                <label>Type</label>
                <Dropdown
                  options={types}
                  search
                  clearable
                  selection
                  placeholder="Select type"
                  value={type}
                  onChange={(e, { value }) => setType(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("coin") && (
              <Form.Field disabled={!filterBy.includes("coin")} width={3}>
                <label>Coin</label>
                <Dropdown
                  options={coinOptions}
                  clearable
                  selection
                  search
                  placeholder="Select coin"
                  value={coin}
                  onChange={(e, { value }) => setCoin(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("base") && (
              <Form.Field disabled={!filterBy.includes("base")} width={3}>
                <label>Base</label>
                <Dropdown
                  options={coinOptions}
                  clearable
                  search
                  selection
                  placeholder="Select base"
                  value={base}
                  onChange={(e, { value }) => setBase(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("quote") && (
              <Form.Field disabled={!filterBy.includes("quote")} width={3}>
                <label>Quote</label>
                <Dropdown
                  options={coinOptions}
                  clearable
                  search
                  selection
                  placeholder="Select quote"
                  value={quote}
                  onChange={(e, { value }) => setQuote(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {component === "order" && filterBy.includes("side") && (
              <Form.Field disabled={!filterBy.includes("side")} width={3}>
                <label>Order side</label>
                <Form.Select
                  options={[
                    {
                      key: "BUY",
                      value: "BUY",
                      text: "Buy",
                    },
                    {
                      key: "SELL",
                      value: "SELL",
                      text: "Sell",
                    },
                  ]}
                  clearable
                  selection
                  placeholder="Select side"
                  value={side}
                  onChange={(e, { value }) => setSide(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {component === "order" && filterBy.includes("symbol") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Symbol"
                  placeholder="BTCUSDT"
                  value={symbol}
                  onChange={(e, { value }) => setSymbol(value)}
                />
              </Form.Field>
            )}
            {component === "order" &&
              filterBy.includes("order-status-history") && (
                <Form.Field width={3}>
                  <label>Order Status</label>
                  <Dropdown
                    options={orderStatusHistory}
                    clearable
                    search
                    selection
                    placeholder="Select order status"
                    value={history}
                    onChange={(e, { value }) => setHistory(value)}
                    selectOnBlur={false}
                  />
                </Form.Field>
              )}
            {component === "order" && filterBy.includes("order-status-open") && (
              <Form.Field width={3}>
                <label>Order Status</label>
                <Dropdown
                  options={orderStatusOpen}
                  clearable
                  search
                  selection
                  placeholder="Select order status"
                  value={history}
                  onChange={(e, { value }) => setHistory(value)}
                  selectOnBlur={false}
                />
              </Form.Field>
            )}
            {filterBy.includes("address") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Address"
                  placeholder="TS1SrTRz9wtqcaP1qpQYcWHVS9cK7P5dHt"
                  value={address}
                  onChange={(e, { value }) => setAddress(value)}
                  disabled={!filterBy.includes("address")}
                />
              </Form.Field>
            )}
            {filterBy.includes("operator") && (
              <Form.Field width={3}>
                <Form.Input
                  label="Operator"
                  placeholder="Id, Coin, Hash..."
                  value={operator}
                  onChange={(e, { value }) => setOperator(value)}
                  disabled={!filterBy.includes("operator")}
                />
              </Form.Field>
            )}
          </Grid>

          <Button type="submit" positive>
            Search
          </Button>
          <Button type="button" onClick={_handleReset} negative>
            Reset
          </Button>
          <Button type="button" onClick={_handleExport} disabled={!exportLink}>
            Export
          </Button>
        </Form>
      </Segment>
    </>
  );
}

export default Toolbar;
