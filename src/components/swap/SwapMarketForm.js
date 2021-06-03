import React, { useEffect, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { post, put } from "../../utils/api";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";

function SwapMarketForm({ data, type = "create", callback }) {
  const [isInSystem, setIsInSystem] = useState(
    type === "create" ? false : data.isInSystem
  );
  const [coin, setCoin] = useState(type === "create" ? "" : data.coin);
  const [usdPrice, setUsdPrice] = useState(
    type === "create" ? 0 : data.usdPrice
  );
  const [updateInterval, setUpdateInterval] = useState(
    type === "create" ? 0 : data.updateInterval
  );
  const [isActive, setIsActive] = useState(
    type === "create" ? false : data.isActive
  );
  const history = useHistory();
  const dispatch = useDispatch();

  const [options, setOptions] = useState([]);
  const { manager } = useSelector((state) => state);
  const { coinList } = manager;
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

  const _handleCreateSwapMarket = () => {
    if (type === "create") {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Add new swap market ?",
          callback: () => {
            post(
              "/swap-service/market",
              {
                coin,
                usdPrice,
                updateInterval: parseFloat(updateInterval),
                isInSystem,
                isActive,
              },
              () => {
                toast("Add new swap market successful");
                history.push("/swap/market");
              }
            );
          },
        },
      });
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Update swap market detail ?",
          callback: () => {
            put(
              "/swap-service/market",
              {
                coin,
                usdPrice,
                updateInterval: parseFloat(updateInterval),
                isInSystem,
                isActive,
              },
              () => {
                toast("Update swap market successful");
                callback();
              }
            );
          },
        },
      });
    }
  };

  return (
    <Form onSubmit={_handleCreateSwapMarket}>
      <Form.Select
        label="Coin"
        value={coin}
        onChange={(e, { value }) => setCoin(value)}
        disabled={type !== "create"}
        placeholder="Please enter coin"
        required
        options={options}
        selectOnBlur={false}
      />
      <Form.Input
        label="Price"
        disabled={!isInSystem}
        type="number"
        step="any"
        value={usdPrice}
        onChange={(e) => setUsdPrice(e.target.value)}
        required
      />
      <Form.Input
        label="Update interval"
        disabled={isInSystem}
        value={updateInterval}
        onChange={(e) => setUpdateInterval(e.target.value)}
        required
      />
      <Form.Checkbox
        label="In System"
        onChange={(e, { checked }) => setIsInSystem(checked)}
        checked={isInSystem}
        disabled={type !== "create"}
      />
      <Form.Checkbox
        label="Active"
        onChange={(e, { checked }) => setIsActive(checked)}
        checked={isActive}
      />
      <Button>Confirm</Button>
    </Form>
  );
}

export default SwapMarketForm;
