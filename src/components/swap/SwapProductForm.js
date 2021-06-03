import React, { useEffect, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { post, put } from "../../utils/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { toast } from "react-toastify";

function SwapProductForm({ type = "create", data, callback }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [list, setList] = useState(null);
  const [base, setBase] = useState(type === "create" ? "" : data.base);
  const [quote, setQuote] = useState(type === "create" ? "" : data.quote);
  const [updateInterval, setUpdateInterval] = useState(
    type === "create" ? 0 : data.updateInterval
  );
  const [minAmount, setMinAmount] = useState(
    type === "create" ? 0 : data.minAmount
  );
  const [maxAmount, setMaxAmount] = useState(
    type === "create" ? 0 : data.maxAmount
  );
  const [isActive, setIsActive] = useState(
    type === "create" ? false : data.isActive
  );
  const [fee, setFee] = useState(type === "create" ? 0 : data.fee);

  const [options, setOptions] = useState(null);
  const { manager } = useSelector((state) => state);
  const { fundStatistic } = manager;

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
    if (type === "create") {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Add new swap product ?",
          callback: () => {
            post(
              "/swap-service/product",
              {
                base,
                quote,
                updateInterval,
                minAmount,
                maxAmount,
                isActive,
                fee,
              },
              () => {
                toast("Add new swap product successful");
                history.push("/swap/product");
              }
            );
          },
        },
      });
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Update swap product detail ?",
          callback: () => {
            put(
              "/swap-service/product",
              {
                base,
                quote,
                updateInterval,
                minAmount,
                maxAmount,
                isActive,
                fee,
              },
              () => {
                toast("Update swap product successful");
                callback();
              }
            );
          },
        },
      });
    }
  };

  return (
    <Form onSubmit={_handleSubmit}>
      <Form.Group widths="equal">
        <Form.Dropdown
          options={options}
          selection
          search
          placeholder="Please choose base"
          label="Base"
          onChange={(e, { value }) => setBase(value)}
          disabled={type !== "create"}
          value={base}
          required
          selectOnBlur={false}
        />
        <Form.Dropdown
          options={options}
          selection
          search
          placeholder="Please choose quote"
          label="Quote"
          onChange={(e, { value }) => setQuote(value)}
          disabled={type !== "create"}
          value={quote}
          required
          selectOnBlur={false}
        />
      </Form.Group>
      <Form.Input
        label="Update interval"
        onChange={(e, { value }) => setUpdateInterval(value)}
        type="number"
        step="any"
        value={updateInterval}
        required
      />
      <Form.Input
        label="Min amount"
        onChange={(e, { value }) => setMinAmount(value)}
        type="number"
        step="any"
        value={minAmount}
        required
      />
      <Form.Input
        label="Fee"
        onChange={(e, { value }) => setFee(value)}
        value={fee}
        required
      />
      {/* <Form.Input
        label="Max amount"
        onChange={(e, { value }) => setMaxAmount(value)}
        type="number"
step="any"
        value={maxAmount}
      /> */}
      <Form.Checkbox
        label="Active"
        onChange={(e, { checked }) => setIsActive(checked)}
        checked={isActive}
      />
      <Button>Confirm</Button>
    </Form>
  );
}

export default SwapProductForm;


