import { Checkbox, formatMs, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, TextArea, Dropdown, Grid } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { post, put } from "../../utils/api";
import InputDateTime from "../InputDateTime";
import {
  TRADE_TYPE,
  SUPPORTED_RESOLUTIONS,
  MARKET_TAG,
  IS_SHARE,
} from "../../settings/constants";
import { SketchPicker } from "react-color";
import ColorPicker from "../ColorPicker";
import Alert from '@material-ui/lab/Alert';

function MarketForm({ action = "create", data, callback }) {
  const { manager } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { fundStatistic } = manager;
  // const { coinList } = manager;
  const history = useHistory();
  const [base, setBase] = useState(action === "create" ? "" : data.base);
  const [quote, setQuote] = useState(action === "create" ? "" : data.quote);
  const [status, setStatus] = useState(
    action === "create" ? "PENDING" : data.status
  );
  const [interval, setInterval] = useState(
    action === "create" ? "15" : data.interval
  );
  const [tag, setTag] = useState(action === "create" ? "" : data.tag);
  const [minTrade, setMinTrade] = useState(
    action === "create" ? "10" : data.minTrade
  );
  const [priceFix, setPriceFix] = useState(
    action === "create" ? "" : data.priceFix
  );
  const [priceFixAlert, setPriceFixAlert] = useState("");
  const [qtyFixAlert, setqtyFixAlert] = useState("");

  const [qtyFix, setQtyFix] = useState(action === "create" ? "" : data.qtyFix);
  const [type, setType] = useState(action === "create" ? "PENDING" : data.type);
  const [share, setShare] = useState(action === "create" ? "" : data.share);
  const [disables, setDisables] = useState(
    action === "create" || !data.disableFeatures
      ? ""
      : data.disableFeatures.toString()
  );
  const [options, setOptions] = useState([]);
  const [price, setPrice] = useState(action === "create" ? "" : data.close);
  const [index, setIndex] = useState(action === "create" ? 0 : data.index);
  const [tagColor, setTagColor] = useState(
    action === "create" ? "#fff" : data.tagColor
  );
  const [lastPriceUsd, setLastPriceUsd] = useState(
    action === "create" ? "" : data.lastPriceUsd
  );
  const [isDemo, setIsDemo] = useState(
    action === "create" ? false : data.isDemo
  );
  const [openTime, setOpenTime] = useState(
    action === "create" ? "" : data.openTime
  );

  useEffect(() => {
     if(tag ===  "HOT"){
         setTagColor("#D0021B");
     };
     if(tag === "NEW"){
      setTagColor("#F8E71C");
     };
     if(tag === "UPCOMING"){
      setTagColor("#7ED321");
    }
  }, [tag])

  useEffect(() => {
    if (fundStatistic) {
      const _options = [];
      fundStatistic.statistics.map((item) => {
        // if (item.isActive) {
          _options.push({
          key: item.coin,
          value: item.coin,
          text: item.coin,
        });
      });
      setOptions(_options);
    };
  }, [fundStatistic]);

  const _handleSubmit = () => {
    const body = {
      base,
      quote,
      status: status,
      type,
      share,
      minTrade,
      interval,
      priceFix,
      qtyFix,
      tag,
      tagColor,
      index,
      disables: disables.split(";"),
      price,
      lastPriceUsd,
      openTime: openTime,
      isDemo: isDemo,
    };
    if(priceFix >= 0 && priceFix <= 10 && qtyFix >= 0 && qtyFix <= 10){
      if (action === "create") {
        dispatch({
          type: SHOW_POPUP,
          payload: {
            content: "Add new market ?",
            callback: () => {
              post("/trade-service/market", body, () => {
                toast("Add new market was successful");
                history.push("/trade/markets");
              });
            },
          },
        });
      } 
      else {
        dispatch({
          type: SHOW_POPUP,
          payload: {
            content: "Update market detail?",
            callback: () => {
              put("/trade-service/market", body, () => {
                toast("Update market detail was successful");
                callback();
              });
            },
          },
        });
      };
    };   
  };

  useEffect(() => {
    if(priceFix < 0 || priceFix > 10) {
      setPriceFixAlert("Invalid price fix");
    };
    if(priceFix >= 0 && priceFix <= 10) {
      setPriceFixAlert("");
    };
    if(qtyFix < 0 || qtyFix > 10) {
      setqtyFixAlert("Invalid quanltity fix");
    };
    if(qtyFix >= 0 && qtyFix <= 10) {
      setqtyFixAlert("");
    };
  }, [priceFix, qtyFix])

  return (
    <Form onSubmit={_handleSubmit}>
      <Form.Group widths="equal">
        <Form.Select
          label="Base"
          value={base}
          onChange={(e, { value }) => setBase(value)}
          disabled={action !== "create"}
          placeholder="Enter base"
          clearable
          required
          options={options}
          selectOnBlur={false}
        />
        <Form.Select
          label="Quote"
          value={quote}
          onChange={(e, { value }) => setQuote(value)}
          disabled={action !== "create"}
          clearable
          placeholder="Enter quote"
          required
          options={options}
          selectOnBlur={false}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Price"
          value={price}
          type="number"
          onChange={(e, { value }) => setPrice(value)}
          placeholder="Enter price"
          required
          disabled={action !== "create"}
        />
        <Form.Input
          label="Last price USD"
          value={lastPriceUsd}
          type="number"
          onChange={(e, { value }) => setLastPriceUsd(value)}
          placeholder="Enter last price USD"
          required
          disabled={action !== "create"}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Select
          label="Interval default"
          value={interval}
          options={SUPPORTED_RESOLUTIONS}
          onChange={(e, { value }) => setInterval(value)}
          placeholder="Enter Interval"
          clearable
          selectOnBlur={false}
        />
        <Form.Input
          label="Min Trade"
          value={minTrade}
          type="number"
          onChange={(e, { value }) => setMinTrade(value)}
          placeholder="Enter min Trade"
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Price Fix"
          value={priceFix}
          type="number"
          onChange={(e, { value }) => setPriceFix(value)}
          placeholder="Enter price fix"
          required
          error={priceFixAlert ? true : false}
        />           
        <Form.Input
          label="Quantity Fix"
          value={qtyFix}
          type="number"
          onChange={(e, { value }) => setQtyFix(value)}
          placeholder="Enter quantity fix"
          required
          error={qtyFixAlert ? true : false}
        />
      </Form.Group>
      <Grid columns={2}>
       <Grid.Column>
       {priceFixAlert ?  <Alert severity="error" id="alert_message">Please input price fix from 0 to 10 </Alert> : null}
       </Grid.Column>
       <Grid.Column>
       {qtyFixAlert ?  <Alert severity="error" id="alert_message">Please input quantity fix from 0 to 10 </Alert> : null}
       </Grid.Column>
      </Grid>
      <Form.Group widths="equal">
        <Form.Select
          label="Share Order Book from"
          value={share}
          options={IS_SHARE}
          placeholder="Select Share"
          clearable
          onChange={(e, { value }) => setShare(value)}
          selectOnBlur={false}
        />
        <Form.Select
          label="Tag"
          value={tag}
          options={MARKET_TAG}
          placeholder="Enter Tag"
          clearable
          onChange={(e, { value }) => setTag(value)}
          selectOnBlur={false}
        />
        <Form.Input
          label="Index"
          type="number"
          value={index}
          onChange={(e, { value }) => setIndex(value)}
          placeholder="Enter Index"
        />
        <Form.Field>
          <label>Color</label>
          <ColorPicker
            onChange={(color) => setTagColor(color.hex)}
            value={tagColor}
          />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <label>Disable Feature</label>
        <TextArea
          onChange={(e, { value }) => setDisables(value)}
          value={disables}
        />
      </Form.Field>
      <Form.Group widths="equal">
        <Form.Select
          label="Status"
          value={status}
          options={[
            {
              key: "PENDING",
              value: "PENDING",
              text: "PENDING",
            },
            {
              key: "PRE_TRADING",
              value: "PRE_TRADING",
              text: "PRE_TRADING",
            },
            {
              key: "TRADING",
              value: "TRADING",
              text: "TRADING",
            },
            {
              key: "BREAK",
              value: "BREAK",
              text: "BREAK",
            },
            {
              key: "TEMP_STOP",
              value: "TEMP_STOP",
              text: "TEMP_STOP",
            },
          ]}
          onChange={(e, { value }) => setStatus(value)}
          selectOnBlur={false}
        />
        <Form.Select
          label="Type"
          value={type}
          options={TRADE_TYPE}
          onChange={(e, { value }) => setType(value)}
          selectOnBlur={false}
        />
        <Form.Field>
          <label>Listing time</label>
          <InputDateTime
            defaultValue={
              data
                ? moment
                    .unix(data.openTime / 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")
                : ""
            }
            placeholder="YYYY-MM-DD HH:mm"
            onChange={(value) => setOpenTime(moment.utc(value).unix() * 1000)}
          />
        </Form.Field>
        <Form.Field>
          <label>&nbsp;</label>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDemo}
                onChange={() => setIsDemo(!isDemo)}
                name="checkedB"
                color="primary"
                disabled={action !== "create"}
              />
            }
            label="This pair is Demo"
          />
        </Form.Field>
      </Form.Group>
      <Button>Confirm</Button>
    </Form>
  );
}

export default MarketForm;
