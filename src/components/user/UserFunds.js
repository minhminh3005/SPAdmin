import React, { useEffect, useState } from "react";
import { Grid, Header, Icon, Segment, Tab, Table } from "semantic-ui-react";
import { get, post } from "../../utils/api";
import { formatAmount } from "../../settings/format.js";
import { useParams } from "react-router-dom";
import { toBuffer } from "qrcode";
import { checkFeature } from "../../settings";

const transactionType = [
  {
    type: "AIRDROP",
    text: "Airdrop",
  },
  {
    type: "STAKING_REFERRAL",
    text: "Staking referral",
  },
  {
    type: "GIFT",
    text: "Gift",
  },
  {
    type: "EASYBUY",
    text: "Easy buy",
  },
];

function Details({ item }) {
  const [show, setShow] = useState(false);
  const [deposit, setDeposit] = useState(null);
  const [withdraw, setWithdraw] = useState(null);
  const [swap, setSwap] = useState(null);
  const [staking, setStaking] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (show) {
      post(
        `/fund-service/deposit/statistic-by-user/${id}`,
        {
          coin: item.coin,
        },
        (data) => setDeposit(data.totalDeposit)
      );
      post(
        `/fund-service/withdraw/statistic-by-user/${id}`,
        {
          coin: item.coin,
        },
        (data) => setWithdraw(data.totalWithdraw)
      );
      post(
        `/swap-service/swap/statistic-by-user/${id}`,
        {
          coin: item.coin,
        },
        (data) => {
          setSwap(data);
        }
      );
      post(
        `/staking-service/staking/statistic-by-user/${id}`,
        {
          coin: item.coin,
        },
        (data) => {
          setStaking(data);
        }
      );
      post(
        `/fund-service/transaction/statistic-by-user/${id}`,
        {
          coin: item.coin,
        },
        (data) => {
          setTransaction(data);
        }
      );
    }
  }, [id, item.coin, show]);

  console.log("item", item);

  return (
    <>
      <Table.Cell>
        <span className="d-fex-cbt">
          {item.coin}{" "}
          <Icon
            link
            name={show ? "eye" : "eye slash"}
            onClick={() => setShow(!show)}
          />
        </span>
      </Table.Cell>
      <Table.Cell>
        {formatAmount(item.amount)}
        <span style={{ opacity: "0.5", display: "block", fontSize: "0.9rem" }}>
          {formatAmount(item.amount * item.usdPrice)} USDT
        </span>
      </Table.Cell>
      <Table.Cell>{formatAmount(item.blockedAmount)}</Table.Cell>
      <Table.Cell>{show ? formatAmount(deposit) : "*****"}</Table.Cell>
      <Table.Cell>{show ? formatAmount(withdraw) : "*****"}</Table.Cell>
      {checkFeature("SWAP") ? (
        <React.Fragment>
          <Table.Cell>
            {show && swap ? formatAmount(swap.totalSend) : "*****"}
          </Table.Cell>
          <Table.Cell>
            {show && swap ? formatAmount(swap.totalReceive) : "*****"}
          </Table.Cell>
        </React.Fragment>
      ) : null}
      <Table.Cell>
        {show && staking ? formatAmount(staking.totalAmount) : "*****"}
      </Table.Cell>
      <Table.Cell>
        {show && staking ? formatAmount(staking.totalRedeem) : "*****"}
      </Table.Cell>
      {transactionType.map((item, index) => {
        let display = "*****";
        if (transaction && show) {
          const check = transaction.statistics.filter(
            (element) => element.type === item.type
          )[0];
          if (check) {
            display = formatAmount(check.totalAmount);
          } else {
            display = 0;
          }
        }
        return <Table.Cell key={index}>{display}</Table.Cell>;
      })}
    </>
  );
}

function UserFunds() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    !data &&
      post(`/fund-service/fund/list-by-user/${id}`, {}, (data) => {
        setData(data);
      });
  }, [data, id]);

  return (
    data && (
      <Table selectable striped compact="very" basic="very" celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>Coin</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2}>Amount</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2}>Blocked</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2}>Deposit</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2}>Withdraw</Table.HeaderCell>
            {checkFeature("SWAP") ? (
              <Table.HeaderCell colSpan={2}>Swap</Table.HeaderCell>
            ) : null}
            <Table.HeaderCell colSpan={2}>Staking</Table.HeaderCell>
            <Table.HeaderCell colSpan={transactionType.length}>
              Transaction
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {checkFeature("SWAP") ? (
              <React.Fragment>
                <Table.HeaderCell>Send</Table.HeaderCell>
                <Table.HeaderCell>Receive</Table.HeaderCell>
              </React.Fragment>
            ) : null}
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Redeem</Table.HeaderCell>
            {transactionType.map((item, index) => (
              <Table.HeaderCell key={index}>{item.text}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => (
            <Table.Row key={index}>
              <Details item={item} />
            </Table.Row>
          ))}
          {data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={13}>No records found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  );
}

export default UserFunds;
