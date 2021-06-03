import React, { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { post, put } from "../../utils/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { toast } from "react-toastify";
import { formatDate } from "../../settings/format";
import InputDateTime from "../InputDateTime";

function StakingProductFrom({ action = "create", data, callback }) {
  const [coin, setCoin] = useState(action === "create" ? "" : data.base);
  const [redeemCoin, setRedeemCoin] = useState(
    action === "create" ? "" : data.quote
  );
  const [type, setType] = useState(action === "create" ? "LOCKED" : data.type);
  const [duration, setDuration] = useState(
    action === "create" ? "" : data.duration
  );
  const [estimateApy, setEstimateApy] = useState(
    action === "create" ? "" : data.estimateApy
  );
  const [redeemPeriod, setRedeemPeriod] = useState(
    action === "create" ? "" : data.redeemPeriod
  );
  const [minAmount, setMinAmount] = useState(
    action === "create" ? "" : data.minAmount
  );
  const [maxAmount, setMaxAmount] = useState(
    action === "create" ? "" : data.maxAmount
  );
  const [poolSize, setPoolSize] = useState(
    action === "create" ? "" : data.poolSize
  );
  const [isActive, setIsActive] = useState(
    action === "create" ? false : data.isActive
  );
  const [startDate, setStartDate] = useState(
    action === "create" ? "" : data.startDate
  );
  const [endDate, setEndDate] = useState(
    action === "create" ? "" : data.endDate
  );
  const [title, setTitle] = useState(action === "create" ? "" : data.title);
  const [coverPhoto, setCoverPhoto] = useState(
    action === "create" ? "" : data.coverPhoto
  );
  const [name, setName] = useState(action === "create" ? "" : data.name);
  const history = useHistory();
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const { manager } = useSelector((state) => state);
  const { fundStatistic } = manager

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
      base: coin,
      quote: redeemCoin,
      type,
      estimateApy,
      redeemPeriod,
      minAmount,
      poolSize,
      isActive,
      maxAmount,
      startDate,
      endDate,
      name,
      title,
      coverPhoto,
    };
    if (action === "create") {
      body.duration = duration;
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Add new staking product ?",
          callback: () => {
            post("/staking-service/product", body, () => {
              toast("Add new staking product successful");
              history.push("/staking/product");
            });
          },
        },
      });
    } else {
      body.id = data.id;
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Update staking product detail ?",
          callback: () => {
            put("/staking-service/product", body, (e) => {
              toast("Update staking product detail successful");
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
        <Form.Select
          options={options}
          label="Staking coin"
          value={coin}
          onChange={(e, { value }) => setCoin(value)}
          disabled={action !== "create"}
          placeholder="Enter coin"
          required
          selectOnBlur={false}
        />
        <Form.Select
          options={options}
          label="Redeem coin"
          value={redeemCoin}
          onChange={(e, { value }) => setRedeemCoin(value)}
          disabled={action !== "create"}
          placeholder="Enter coin"
          required
          selectOnBlur={false}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Select
          options={[
            { key: "LOCKED", value: "LOCKED", text: "LOCKED" },
            { key: "FLEXIBLE", value: "FLEXIBLE", text: "FLEXIBLE" },
          ]}
          label="Type"
          value={type}
          onChange={(e, { value }) => setType(value)}
          disabled={action !== "create"}
          required
          selectOnBlur={false}
        />
        <Form.Input
          label={`Pool Size`}
          type="number"
          step="any"
          value={poolSize}
          onChange={(e, { value }) => setPoolSize(value)}
          placeholder="Enter pool size"
          required
          action={coin}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Duration"
          type="number"
          step="any"
          value={duration}
          onChange={(e, { value }) => setDuration(value)}
          disabled={action !== "create"}
          placeholder="Enter duration (days)"
          required
          action="day(s)"
        />
        <Form.Field></Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Estimate Apy"
          type="number"
          step="any"
          value={estimateApy}
          onChange={(e, { value }) => setEstimateApy(value)}
          placeholder="Enter Estimate Apy"
          required
          action="%"
        />
        <Form.Input
          label="Redeem Period"
          type="number"
          step="any"
          value={redeemPeriod}
          onChange={(e, { value }) => setRedeemPeriod(value)}
          placeholder="Enter redeem period"
          required
          action="day(s)"
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Minimum Amount"
          type="number"
          step="any"
          value={minAmount}
          onChange={(e, { value }) => setMinAmount(value)}
          placeholder="Enter min amount"
          required
          action={coin}
        />
        <Form.Input
          label="Maximum Amount"
          type="number"
          step="any"
          value={maxAmount}
          onChange={(e, { value }) => setMaxAmount(value)}
          placeholder="Enter max amount"
          required
          action={coin}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field>
          <label>
            Start date <span style={{ color: "red" }}>*</span>
          </label>
          <InputDateTime
            defaultValue={
              startDate
                ? moment(startDate).utc().format("YYYY-MM-DD HH:mm")
                : ""
            }
            placeholder="YYYY-MM-DD HH:mm"
            onChange={(value) => setStartDate(moment.utc(value).unix() * 1000)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>
            End date <span style={{ color: "red" }}>*</span>
          </label>
          <InputDateTime
            label="End date"
            onChange={(value) => setEndDate(moment.utc(value).unix() * 1000)}
            defaultValue={
              endDate ? moment(endDate).utc().format("YYYY-MM-DD HH:mm") : ""
            }
            placeholder="YYYY-MM-DD HH:mm"
            required
          />
        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Name"
          type="text"
          value={name}
          onChange={(e, { value }) => setName(value)}
          placeholder="Enter name"
          required
        />
        <Form.Input
          label="Title"
          type="text"
          value={title}
          onChange={(e, { value }) => setTitle(value)}
          placeholder="Enter title"
          required
        />
      </Form.Group>
      <Form.Input
        label="Cover photo"
        type="text"
        value={coverPhoto}
        onChange={(e, { value }) => setCoverPhoto(value)}
        placeholder="Enter cover photo link"
        required
      />
      <Form.Checkbox
        label="Active"
        checked={isActive}
        onChange={(e, { checked }) => setIsActive(checked)}
      />
      <Button>Confirm</Button>
    </Form>
  );
}

export default StakingProductFrom;
