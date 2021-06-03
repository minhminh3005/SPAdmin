import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BotVolumeForm from './BotVolumeForm';
import { post, get, _delete } from "../../utils/api";
import {
    Segment,
    Table,
    Pagination,
    Input,
    Icon,
    Modal,
    Header,
    Form,
    Image,
    Button,
} from "semantic-ui-react";
import { checkScope } from "../../settings";
import { formatAmount } from "../../settings/format";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { toast } from "react-toastify";
import { formatTime } from "../../settings/format";

function Edit({ item, callback }) {
    const _close = (e) => {
        if (e.target.className === "close icon") {
            callback();
        }
    };
    return (
        item && (
            <Modal onClose={_close} open={item !== null} closeIcon size="large">
                <Modal.Header>Edit Volume Bot</Modal.Header>
                <Modal.Content>
                    <BotVolumeForm action="edit" data={item} callback={callback} />
                </Modal.Content>
            </Modal>

        )
    );
};


export default function BotVolumeList() {
    const [list, setList] = useState(null);
    const [item, setItem] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        get(`/volume-bot-service/volume-bot`, _success);
    }, [isProcessing]);

    const _success = (e) => {
        setList(e);
    };

    function handleDeleteBot(id, name) {
        dispatch({
            type: SHOW_POPUP,
            payload: {
                content: `Are you sure to cancel this Bot ${name}?`,
                callback: () => {
                    setIsProcessing(true);
                    _delete(
                        "/volume-bot-service/volume-bot?id=" + id,
                        null,
                        () => {
                            toast.success("Delete Bot success!");
                            setIsProcessing(false);
                            history.push("/bot/volume-bot-list");

                        },
                        () => {
                            toast.warning("Delete Bot fail!");
                            setIsProcessing(false);

                        }
                    );
                },
            },
        });
    }
    return (
        <>
         <Header style={{ marginTop: "10px", marginBottom: "0px" }}>List Volume Bot</Header>
            <Segment style={{ textAlign: "right", marginRight: "20px", paddingBottom: "10px" }} vertical>
                <Button
                    content='Add Volume Bot'
                    onClick={() => history.push("/bot/add-volume-bot")}
                />
            </Segment>

            <Segment loading={!list} vertical>
                <Table celled selectable compact="very" basic="very">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#Id</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Symbol</Table.HeaderCell>
                            <Table.HeaderCell>Min Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Max Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Random Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Min Interval</Table.HeaderCell>
                            <Table.HeaderCell>Max Interval</Table.HeaderCell>
                            <Table.HeaderCell>Is Active</Table.HeaderCell>
                            <Table.HeaderCell>Next Time</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {list &&
                            list.map((s, i) => (
                                <Table.Row key={i} negative={s.isActive ? false : true}>
                                    <Table.Cell>#{s.id}</Table.Cell>
                                    <Table.Cell>{s.name} </Table.Cell>
                                    <Table.Cell>{s.symbol}</Table.Cell>
                                    <Table.Cell>{s.options.minQty}</Table.Cell>
                                    <Table.Cell>{s.options.maxQty}</Table.Cell>
                                    <Table.Cell>
                                        {s.options.randomQty ? (
                                            <Icon name="checkmark" color="green" />
                                        ) : (
                                            <Icon name="x" color="red" />
                                        )
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{s.options.minInterval}</Table.Cell>
                                    <Table.Cell>{s.options.maxInterval}</Table.Cell>
                                    <Table.Cell>
                                        {s.isActive ? (
                                            <Icon name="checkmark" color="green" />
                                        ) : (
                                            <Icon name="x" color="red" />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{formatTime(s.nextTime)}</Table.Cell>
                                    <Table.Cell>
                                        {checkScope(["TRADE_FULL"]) && (
                                            <Link to="#" onClick={() => setItem(s)}>
                            Edit
                                            </Link>
                                        )}
                                        <span style={{ marginLeft: "10px", marginRight: "10px" }}>|</span>
                                        {checkScope(["TRADE_FULL"]) && (
                                            <Link to="#" onClick={() => handleDeleteBot(s.id, s.name)}>
                            Delete
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
                    get(`/volume-bot-service/volume-bot`, _success);
                    setItem(null);
                }}
            />         
        </>
    )
}
