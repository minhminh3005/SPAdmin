import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {
    Segment,
    Grid,
    Header,
    Form,
    FormInput,
    Checkbox,
    Button
} from 'semantic-ui-react';
import { toast } from "react-toastify";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { post, put } from "../../utils/api";
import InputDateTime from "../InputDateTime";
import moment from "moment";

export default function BotVolumeForm({ action = "create", data, callback }) {
    const [name, setName] = useState(action === "create" ? "" : data.name);
    const [base, setBase] = useState(action === "create" ? "" : data.base);
    const [quote, setQuote] = useState(action === "create" ? "" : data.quote);
    const [lastExecute, setLastExecute] = useState(action === "create" ? "" : data.lastExecute);
    const [nextTime, setNextTime] = useState(action === "create" ? "" : data.nextTime);
    const [minQty, setMinQty] = useState(action === "create" ? "" : data.options.minQty);
    const [maxQty, setMaxQty] = useState(action === "create" ? "" : data.options.maxQty);
    const [minInterval, setMinInterval] = useState(action === "create" ? "" : data.options.minInterval);
    const [maxInterval, setMaxInterval] = useState(action === "create" ? "" : data.options.maxInterval);
    const [isActive, setIsActive] = useState(action === "create" ? false : data.isActive);
    const [randomQty, setRandomQty] = useState(action === "create" ? false : data.options.randomQty);
    const [coin, setCoin] = useState([]);
    const { manager } = useSelector((state) => state);
    const { fundStatistic } = manager;
    const history = useHistory();
    const dispatch = useDispatch()
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
            setCoin(_options);
          };
    }, [fundStatistic]);

    const _handleSubmit = () => {
        const body = {
            name,
            base,
            quote,
            symbol: base + quote,
            isActive,
            lastExecute,
            nextTime,
            options: {
                minQty,
                maxQty,
                minInterval,
                maxInterval,
                randomQty,
            }
        };
        if (action === "create") {
            //   body.duration = duration;
            dispatch({
                type: SHOW_POPUP,
                payload: {
                    content: "Add new volume bot ?",
                    callback: () => {
                        post("/volume-bot-service/volume-bot", body, () => {
                            toast.success("Added new volume bot");
                            history.push("/bot/volume-bot-list");
                        });
                    },
                },
            });
        } else {
            body.id = data.id;
            dispatch({
                type: SHOW_POPUP,
                payload: {
                    content: "Update volume bot ?",
                    callback: () => {
                        put("/volume-bot-service/volume-bot", body, () => {
                            toast.success("Updated volume bot");
                            callback();
                        });
                    },
                },
            });
        }
    };

    return (
        <>
                <Form onSubmit={_handleSubmit}>
                    <Header as='h4'>Basic Info</Header>
                    <Form.Group widths="equal">
                        <Form.Input
                            label="Name"
                            step="any"
                            value={name}
                            onChange={(e, { value }) => setName(value)}
                            placeholder="Naming for your bot"
                            required
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Select
                            label="Base"
                            step="any"
                            value={base}
                            onChange={(e, { value }) => setBase(value)}
                            placeholder="Select Base"
                            clearable
                            required
                            options={coin}
                        />
                        <Form.Select
                            label="Quote"
                            step="any"
                            value={quote}
                            onChange={(e, { value }) => setQuote(value)}
                            clearable
                            placeholder="Select Quote"
                            required
                            options={coin}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Input
                            label="Last Execute"
                            step="any"
                            value={lastExecute}
                            onChange={(e, { value }) => setLastExecute(value)}
                            placeholder="Please input last execute"
                            required
                        />

                        <Form.Field>
                            <label>
                                Next Time <span style={{ color: "red" }}>*</span>
                            </label>
                            <InputDateTime
                                defaultValue={
                                    nextTime
                                        ? moment
                                            .unix(nextTime / 1000)
                                            .utc()
                                            .format("YYYY-MM-DD HH:mm")
                                        : ""
                                }
                                placeholder="YYYY-MM-DD HH:mm"
                                onChange={(value) => setNextTime(moment.utc(value).unix() * 1000)}
                                required
                            />
                        </Form.Field>
                    </Form.Group>

                    <Header as='h4'>Trade Options</Header>
                    <Header as='h5'>
                        Volume
                    </Header>
                    <Form.Group widths="equal">
                        <Form.Input
                            label="Min Order's volume"
                            type="number"
                            step="any"
                            value={minQty}
                            onChange={(e, { value }) => setMinQty(value)}
                            placeholder="0"
                            required
                        />
                        <Form.Input
                            label="Max Order's volume"
                            type="number"
                            step="any"
                            value={maxQty}
                            onChange={(e, { value }) => setMaxQty(value)}
                            placeholder="0"
                            required
                        />
                    </Form.Group>

                    <Form.Group widths="equal">
                        <Form.Input
                            label="Min Interval (seconds)"
                            type="number"
                            step="any"
                            value={minInterval}
                            onChange={(e, { value }) => setMinInterval(value)}
                            placeholder="0"
                            required
                        />
                        <Form.Input
                            label="Max Interval (seconds)"
                            type="number"
                            step="any"
                            value={maxInterval}
                            onChange={(e, { value }) => setMaxInterval(value)}
                            placeholder="0"
                            required
                        />
                    </Form.Group>
                    <Form.Checkbox
                        label="Choose random quantity"
                        onChange={(e, { checked }) => setRandomQty(checked)}
                        checked={randomQty}
                    />

                    <Form.Checkbox
                        label="Active bot after create"
                        onChange={(e, { checked }) => setIsActive(checked)}
                        checked={isActive}
                    />

                    <br />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button>Confirm</Button>
                    </div>
                </Form>
        </>
    )
}
