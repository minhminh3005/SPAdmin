import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { post, put } from "../../utils/api";
import { SketchPicker } from "react-color";
import ColorPicker from "../ColorPicker";

function CoinForm({ action = "create", data, callback }) {
  const [code, setCode] = useState(action === "create" ? "" : data.code);
  const history = useHistory();
  const [fullName, setFullName] = useState(
    action === "create" ? "" : data.fullName
  );
  const [network, setNetwork] = useState(
    action === "create" ? "" : data.network
  );
  const [withdrawEnable, setWithdrawEnable] = useState(
    action === "create" ? false : data.withdrawEnable
  );
  const [minimumWithdraw, setMinimumWithdraw] = useState(
    action === "create" ? "" : data.minimumWithdraw
  );
  const [withdrawFee, setWithdrawFee] = useState(
    action === "create" ? "" : data.withdrawFee
  );
  const [depositEnable, setDepositEnable] = useState(
    action === "create" ? false : data.depositEnable
  );
  const [enable, setEnable] = useState(
    action === "create" ? false : data.enable
  );
  const [isInSystem, setIsInSystem] = useState(
    action === "create" ? false : data.isInSystem
  );
  const [usdPrice, setUsdPrice] = useState(
    action === "create" ? 0 : data.usdPrice
  );
  const [color, setColor] = useState(action === "create" ? "#fff" : data.color);
  const [hasAddressTag, setHasAddressTag] = useState(
    action === "create" ? false : data.hasAddressTag
  );
  const dispatch = useDispatch();

  const _handleSubmit = () => {
    const body = {
      code,
      fullName,
      network,
      withdrawEnable,
      minimumWithdraw,
      withdrawFee,
      depositEnable,
      enable,
      isInSystem,
      usdPrice,
      color,
      hasAddressTag,
    };
    if (action === "create") {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Add new coin ?",
          callback: () => {
            post("/fund-service/coin", body, () => {
              toast("Add new coin was successful");
              history.push("/coin/list");
            });
          },
        },
      });
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Update coin detail ?",
          callback: () => {
            put("/fund-service/coin", body, () => {
              toast("Update coin detail was successful");
              callback();
            });
          },
        },
      });
    }
  };

  return (
    <Form onSubmit={_handleSubmit}>
      <Form.Group widths="equal">
        <Form.Input
          label="Code"
          value={code}
          onChange={(e, { value }) => setCode(value)}
          disabled={action !== "create"}
          placeholder="Please enter coin code"
          required
        />
        <Form.Input
          label="Network"
          value={network}
          onChange={(e, { value }) => setNetwork(value)}
          disabled={action !== "create"}
          placeholder="Please enter network"
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Price"
          value={usdPrice}
          onChange={(e, { value }) => setUsdPrice(value)}
          // disabled={!isInSystem}
          required
        />
        <Form.Input
          label="Full name"
          value={fullName}
          onChange={(e, { value }) => setFullName(value)}
          disabled={action !== "create"}
          placeholder="Please enter coin name"
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Minimum withdraw amount"
          value={minimumWithdraw}
          onChange={(e, { value }) => setMinimumWithdraw(value)}
          placeholder="Please enter minimum withdraw amount"
          required
        />
        <Form.Input
          label="Withdraw fee"
          value={withdrawFee}
          onChange={(e, { value }) => setWithdrawFee(value)}
          placeholder="Please enter withdraw fee"
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Checkbox
            label="Enable Deposit"
            checked={depositEnable}
            onChange={(e, { checked }) => setDepositEnable(checked)}
          />
          <Form.Checkbox
            label="Enable Withdraw"
            checked={withdrawEnable}
            onChange={(e, { checked }) => setWithdrawEnable(checked)}
          />
          <Form.Checkbox
            label="In System"
            checked={isInSystem}
            onChange={(e, { checked }) => setIsInSystem(checked)}
            // disabled={action !== "create"}
          />
          <Form.Checkbox
            label="Has address tag"
            checked={hasAddressTag}
            onChange={(e, { checked }) => setHasAddressTag(checked)}
          />
          <Form.Checkbox
            label="Enable"
            checked={enable}
            onChange={(e, { checked }) => setEnable(checked)}
          />
        </Form.Field>

        <Form.Field>
          <label>Color</label>
          <ColorPicker
            onChange={(color) => setColor(color.hex)}
            value={color}
          />
        </Form.Field>
      </Form.Group>
      <Button>Confirm</Button>
    </Form>
  );
}

export default CoinForm;
