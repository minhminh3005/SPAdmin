import React from 'react'
import SearchHigherComponent from "../SearchHigherComponent";
import {
    Button,
    Dimmer,
    Header,
    Input,
    Loader,
    Segment,
    Table,
    Grid,
    Label,
    Image,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatTime, formatAmount } from "../../settings/format";
import { copyToClipboard } from "../../utils/util";

function UserOrderHistory({ data, onReload }) {
    if (data) {
        return (
            <>
                <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
                    <Grid>
                        <Grid.Column computer={8} textAlign="left">
                            <Header>Meta</Header>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment loading={!data} vertical>
                    <Table celled selectable compact="very" basic="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Symbol</Table.HeaderCell>
                                <Table.HeaderCell>Buy Amount</Table.HeaderCell>
                                <Table.HeaderCell>Buy USD Price</Table.HeaderCell>
                                <Table.HeaderCell>Sell Amount</Table.HeaderCell>
                                <Table.HeaderCell>Sell USD Price</Table.HeaderCell>
                                <Table.HeaderCell>Fail Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data &&
                                data.meta?.map((u, i) => (
                                    <Table.Row key={i}>
                                        <Table.HeaderCell>{u.symbol}</Table.HeaderCell>
                                        <Table.Cell> {formatAmount(u.buyAmount)} </Table.Cell>
                                        <Table.Cell>{formatAmount(u.buyUsdAmount)}</Table.Cell>
                                        <Table.Cell>{formatAmount(u.sellAmount)}</Table.Cell>
                                        <Table.Cell> {formatAmount(u.sellUsdAmount)} </Table.Cell>
                                        <Table.Cell>{formatAmount(u.failAmount)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            {data && data.itemCount === 0 && (
                                <Table.Row>
                                    <Table.Cell style={{ textAlign: "center" }} colSpan={6}>No records found.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Segment>

                <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
                    <Grid>
                        <Grid.Column computer={8} textAlign="left">
                            <Header>User History</Header>
                        </Grid.Column>
                        <Grid.Column computer={8}>
                            <p>Total: {data.itemCount}</p>
                        </Grid.Column>
                    </Grid>
                </Segment>

                <Segment loading={!data} vertical  id="horizontal_scroll_table">
                    <Table celled striped selectable compact="very" basic="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Time</Table.HeaderCell>
                                <Table.HeaderCell>Pair</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Side</Table.HeaderCell>
                                <Table.HeaderCell>Average</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>Filled</Table.HeaderCell>
                                <Table.HeaderCell>Total</Table.HeaderCell>
                                <Table.HeaderCell>Trigger conditions</Table.HeaderCell>
                                <Table.HeaderCell>Guid</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data &&
                                data.items.map((u, i) => (
                                    <Table.Row key={i}>
                                        <Table.HeaderCell>#{u.id}</Table.HeaderCell>
                                        <Table.Cell> {formatTime(u.time)} </Table.Cell>
                                        <Table.Cell>{u.symbol}</Table.Cell>
                                        <Table.Cell>{u.type}</Table.Cell>
                                        <Table.Cell>{u.side}</Table.Cell>
                                        <Table.Cell> {u.avgPrice} </Table.Cell>
                                        <Table.Cell>{u.price}</Table.Cell>
                                        <Table.Cell>{u.qty}</Table.Cell>
                                        <Table.Cell>{u.filled}</Table.Cell>
                                        <Table.Cell>{u.total}</Table.Cell>
                                        <Table.Cell>{u.tgCondition}</Table.Cell>
                                        <Table.Cell>{u.guid}
                                            <Link to="#">  <i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(u.guid)}></i></Link>
                                        </Table.Cell>
                                        <Table.Cell>{u.status}</Table.Cell>
                                    </Table.Row>
                                ))}
                            {data && data.itemCount === 0 && (
                                <Table.Row>
                                    <Table.Cell style={{ textAlign: "center" }} colSpan={12}>No records found.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Segment>

            </>
        );
    } else {
        return <Loader active />;
    }
}


export default SearchHigherComponent(UserOrderHistory, {
    endpoint: `/trade-service/order/list`,
    filterBy: ["userId", "id", "email", "from", "to", "symbol", "type", "order-status-history", "side", "guid"],
    component: "order",
    exportLink: "/trade-service/order/history/export",
});
