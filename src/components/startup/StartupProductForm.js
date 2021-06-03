import React, { useEffect, useState } from "react";
import moment from "moment";
import InputDateTime from "../InputDateTime";
import { Button, Form, Icon } from "semantic-ui-react";
import { post, put } from "../../utils/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_POPUP } from "../../redux/constant";
import { toast } from "react-toastify";
import { formatDate } from "../../settings/format";
import { PriceTypes, STARTUP_TYPE, SELL_MODE } from "../../settings/constants";

function StartupProductForm({ type = "create", data, callback }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [base, setBase] = useState(type === "create" ? "" : data.base);
  const [quote, setQuote] = useState(type === "create" ? [] : data.quote);
  const [priceType, setPriceType] = useState(
    type === "create" ? PriceTypes[0].value : data.priceType
  );
  // const [updateInterval, setUpdateInterval] = useState(
  //   type === "create" ? 0 : data.updateInterval
  // );
  const [minAmount, setMinAmount] = useState(
    type === "create" ? 0 : data.minAmount
  );
  const [maxAmount, setMaxAmount] = useState(
    type === "create" ? 0 : data.maxAmount
  );
  const [supply, setSupply] = useState(type === "create" ? 0 : data.supply);
  const [displaySupply, setDisplaySupply] = useState(
    type === "create" ? 0 : data.displaySupply
  );
  const [sold, setSold] = useState(type === "create" ? "" : data.sold);
  const [isActive, setIsActive] = useState(
    type === "create" ? false : data.isActive
  );
  const [title, setTitle] = useState(type === "create" ? "" : data.title);
  const [coverPhoto, setCoverPhoto] = useState(
    type === "create" ? "" : data.coverPhoto
  );
  const [price, setPrice] = useState(type === "create" ? 0 : data.price);
  const [name, setName] = useState(type === "create" ? "" : data.name);
  const [startDate, setStartDate] = useState(
    type === "create" ? "" : data.startDate
  );
  const [endDate, setEndDate] = useState(type === "create" ? "" : data.endDate);
  const [website, setWebsite] = useState(
    type === "create" ? "" : data.redirects[0].link
  );
  const [whitepaper, setWhitepaper] = useState(
    type === "create" ? "" : data.redirects[1].link
  );
  const [facebook, setFacebook] = useState(
    type === "create" ? "" : data.redirects[2].link
  );
  const [twister, setTwister] = useState(
    type === "create" ? "" : data.redirects[3].link
  );
  const [telegram, setTelegram] = useState(
    type === "create" ? "" : data.redirects[4].link
  );
  const [contentPhotos, setContentPhotos] = useState(
    type === "create" ? [""] : data.contentPhotos
  );
  const [description, setDescription] = useState(
    type === "create" ? "" : data.description
  );
  const [slug, setSlug] = useState(type === "create" ? "" : data.slug);
  const [startupType, setStartupType] = useState(
    type === "create" ? STARTUP_TYPE[0].key : data.type
  );
  const [requiredLevel, setRequiredLevel] = useState(
    type === "create" ? "" : data.requiredLevel
  );
  const [sellMode, setSellMode] = useState(
    type === "create" ? SELL_MODE[0].key : data.sellMode
  );

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
    }
  }, [fundStatistic]);

  const _handleSubmit = () => {
    const body = {
      name,
      // id: data.id,
      type: startupType,
      supply,
      displaySupply,
      sold,
      fee: 0,
      price,
      minAmount: parseFloat(minAmount),
      maxAmount: parseFloat(maxAmount),
      isInSystem: true,
      isActive,
      startDate: startDate,
      endDate: endDate,
      icon: "icon.png",
      coverPhoto,
      contentPhotos,
      title,
      base,
      quote,
      slug,
      description,
      priceType,
      requiredLevel,
      sellMode,
      redirects: [
        {
          id: data ? data.redirects[0].id : 0,
          key: "website",
          link: website,
        },
        {
          id: data ? data.redirects[1].id : 1,
          key: "whitepaper",
          link: whitepaper,
        },
        {
          id: data ? data.redirects[2].id : 2,
          key: "facebook",
          link: facebook,
        },
        {
          id: data ? data.redirects[3].id : 3,
          key: "twister",
          link: twister,
        },
        {
          id: data ? data.redirects[4].id : 4,
          key: "telegram",
          link: telegram,
        },
      ],
    };
    if (type === "create") {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Add new startup product ?",
          callback: () => {
            post("/presale-service/product", body, () => {
              toast.success("Add new startup product successful");
              history.push("/startup/products");
            });
          },
        },
      });
    } else {
      body.id = data.id;
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Update startup product detail ?",
          callback: () => {
            put("/presale-service/product", body, () => {
              toast.success("Update startup product successful");
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
        <Form.Dropdown
          options={options}
          selection
          search
          placeholder="Please choose base"
          label="Base"
          onChange={(e, { value }) => setBase(value)}
          selectOnBlur={false}
          value={base}
          required
        />
        <Form.Dropdown
          options={options}
          selection
          search
          multiple
          placeholder="Please choose quote"
          label="Quote"
          onChange={(e, { value }) => setQuote(value)}
          selectOnBlur={false}
          value={quote}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          options={PriceTypes}
          selection
          search
          placeholder="Please price type"
          label="Price type"
          onChange={(e, { value }) => setPriceType(value)}
          value={priceType}
          required
          selectOnBlur={false}
        />
        <Form.Input
          label="User level"
          onChange={(e, { value }) => setRequiredLevel(value)}
          type="number"
          value={requiredLevel}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          options={STARTUP_TYPE}
          selection
          search
          placeholder="Please select startup type"
          label="Startup type"
          onChange={(e, { value }) => setStartupType(value)}
          value={startupType}
          required
          selectOnBlur={false}
        />
        <Form.Dropdown
          options={SELL_MODE}
          selection
          search
          placeholder="Please select sell mode"
          label="Sell mode"
          onChange={(e, { value }) => setSellMode(value)}
          value={sellMode}
          required
          selectOnBlur={false}
          disabled={startupType != STARTUP_TYPE[1].key}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Name"
          onChange={(e, { value }) => setName(value)}
          type="text"
          value={name}
          required
        />
        <Form.Input
          label="Title"
          onChange={(e, { value }) => setTitle(value)}
          type="text"
          value={title}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Min amount"
          onChange={(e, { value }) => setMinAmount(value)}
          type="text"
          value={minAmount}
          required
        />
        <Form.Input
          label="Max amount"
          onChange={(e, { value }) => setMaxAmount(value)}
          type="text"
          value={maxAmount}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Price"
          onChange={(e, { value }) => setPrice(value)}
          type="text"
          value={price}
          required
        />
        <Form.Input
          label="Total supply"
          onChange={(e, { value }) => setDisplaySupply(value)}
          type="text"
          value={displaySupply}
          required
        />
        <Form.Input
          label="Limit sell"
          onChange={(e, { value }) => setSupply(value)}
          type="text"
          value={supply}
          required
        />
        <Form.Input
          label="Sold"
          onChange={(e, { value }) => setSold(value)}
          type="text"
          value={sold}
          required
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
                ? moment
                    .unix(startDate / 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")
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
              endDate
                ? moment
                    .unix(endDate / 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm")
                : ""
            }
            placeholder="YYYY-MM-DD HH:mm"
            required
          />
        </Form.Field>
      </Form.Group>
      <Form.Input
        label="Description"
        onChange={(e, { value }) => setDescription(value)}
        type="text"
        value={description}
        required
      />
      <Form.Group widths="equal">
        <Form.Input
          label="Slug"
          onChange={(e, { value }) => setSlug(value)}
          type="text"
          value={slug}
          required
        />
        <Form.Input
          label="Cover photo"
          onChange={(e, { value }) => setCoverPhoto(value)}
          type="text"
          value={coverPhoto}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Website"
          onChange={(e, { value }) => setWebsite(value)}
          type="text"
          value={website}
        />
        <Form.Input
          label="Whitepaper"
          onChange={(e, { value }) => setWhitepaper(value)}
          type="text"
          value={whitepaper}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Facebook"
          onChange={(e, { value }) => setFacebook(value)}
          type="text"
          value={facebook}
        />
        <Form.Input
          label="Twister"
          onChange={(e, { value }) => setTwister(value)}
          type="text"
          value={twister}
        />
        <Form.Input
          label="Telegram"
          onChange={(e, { value }) => setTelegram(value)}
          type="text"
          value={telegram}
        />
      </Form.Group>
      <Form.Field>
        <label>Content photos</label>
        {contentPhotos.map((item, index) => (
          <Form.Input
            key={index}
            onChange={(e, { value }) => {
              contentPhotos[index] = value;
              setContentPhotos([...contentPhotos]);
            }}
            type="text"
            value={item}
            action={
              <Button
                onClick={() => {
                  contentPhotos.splice(index, 1);
                  setContentPhotos([...contentPhotos]);
                }}
                type="button"
              >
                <Icon name="x" link style={{ margin: 0 }} />
              </Button>
            }
          />
        ))}
        <Button
          type="button"
          onClick={() => setContentPhotos([...contentPhotos, ""])}
        >
          +
        </Button>
      </Form.Field>
      <Form.Checkbox
        label="Active"
        onChange={(e, { checked }) => setIsActive(checked)}
        checked={isActive}
      />
      <Button>Confirm</Button>
    </Form>
  );
}

export default StartupProductForm;
