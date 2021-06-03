import React, { useEffect, useState } from "react";
import {
  Grid,
  Header,
  Icon,
  Label,
  Modal,
  Segment,
  Statistic,
  Image,
  Table,
} from "semantic-ui-react";
import { get } from "../../utils/api";
import { formatAmount } from "../../settings/format.js";
import { Link } from "react-router-dom";
import CoinStatistic from "../coin/CoinStatistic";
import { useDispatch, useSelector } from "react-redux";
import { _getCoinList } from "../../actions/managerActions";
import { imageURL } from "../../utils/api";

function FundStatistic() {
  const [data, setData] = useState(null);
  const [statistic, setStatistic] = useState(null);
  const [coinSelected, setCoinSelected] = useState(null);
  const dispatch = useDispatch();
  const { manager } = useSelector((state) => state);
  const { coinList } = manager;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !coinList && dispatch(_getCoinList());
    if (!data && coinList) {
      get(`/fund-service/fund/statistic?from=0&to=0`, (data) => {
        setData(data);
        setTimeout(() => {
          data.statistics.forEach((a) => {
            const networks = [];
            coinList.items.forEach((b) => {
              if (a.coin === b.code) {
                networks.push({
                  network: b.network,
                  balance: 0,
                });
              }
            });
            a.networks = networks;
          });
          data.statistics[0].networks &&
            data.statistics.map((item) => {
              item.networks.map((network) =>
                get(
                  `/fund-service/fund/statistic/hot-wallet?Coin=${item.coin}&Network=${network.network}`,
                  (data) => (network.balance = data.balance)
                )
              );
              return null;
            });
          setTimeout(() => {
            setData(data);
            setLoading(false);
          }, 3000);
        }, 10);
      });
    };
    get(`/trade-service/order/open-orders/statistic`, (data) => {
      setStatistic(data);
    });

    if (statistic && data) {
      statistic.map((s, i) => {
        data.statistics?.map((u, j) => {
          if (s.coin == u.coin) {
            return u.totalFundInOrder = s.totalFundInOrder;
          };
        });
      });
    };
  }, [coinList, data, dispatch]);

  return (
    data && (
      <Segment vertical>
        <Header>Fund Overview{loading && null}</Header>

        <Table selectable structured striped compact="very"  celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan='2'>Coin</Table.HeaderCell>
              <Table.HeaderCell rowSpan='2'>Hot wallet</Table.HeaderCell>
              <Table.HeaderCell colSpan='4' style={{paddingLeft: "400px"}}>Balance</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Fund</Table.HeaderCell>
              <Table.HeaderCell>Block</Table.HeaderCell>
              <Table.HeaderCell>In Odrer</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body style={{ fontWeight: 900 }}>
            {data.statistics.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell id="coin__image">
                  <Image className="image" src={imageURL + `/coins/${item.coin}.png`} alt="" size='mini' />
                  <div className="coin">
                    {item.coin}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {item.networks &&
                    item.networks.map((network, index) => (
                      <div key={`network-${index}`}>
                        {network.network}: {network.balance}
                      </div>
                    ))}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalFund)}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalBlockedAmount)}
                </Table.Cell>
                <Table.Cell>
                  {item.totalFundInOrder ? formatAmount(item.totalFundInOrder) : 0}
                </Table.Cell>
                <Table.Cell>
                {formatAmount(parseFloat(item.totalFund) + parseFloat(item.totalBlockedAmount) + (item.totalFundInOrder ? parseFloat(item.totalFundInOrder) : 0))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <br />

        <Table selectable structured striped compact="very"  celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan='2'>Coin</Table.HeaderCell>
              <Table.HeaderCell colSpan='2' style={{paddingLeft: "120px"}}>Deposit</Table.HeaderCell>
              <Table.HeaderCell colSpan='2' style={{paddingLeft: "120px"}}>Withdrawal</Table.HeaderCell>
              <Table.HeaderCell colSpan='2' style={{paddingLeft: "120px"}}>Pending Withdraw</Table.HeaderCell>
              <Table.HeaderCell rowSpan='2'>Withdraw Fee</Table.HeaderCell>
              <Table.HeaderCell rowSpan='2'>Ranking</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>External</Table.HeaderCell>
              <Table.HeaderCell>Internal</Table.HeaderCell>
              <Table.HeaderCell>External</Table.HeaderCell>
              <Table.HeaderCell>Internal</Table.HeaderCell>
              <Table.HeaderCell>External</Table.HeaderCell>
              <Table.HeaderCell>Internal</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body style={{ fontWeight: 900 }}>
            {data.statistics.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell style={{ display: "flex" }}>
                  <Image style={{ width: "20px", height:"20px" }} src={imageURL + `/coins/${item.coin}.png`} alt="" size='mini' />
                  <div style={{ margin: "auto 0", paddingLeft: "10px" }}>
                    {item.coin}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalDeposit)}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalInternalDeposit)}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalWithdraw)}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.totalInternalWithdraw)}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(item.pendingWithdrawCount)}
                </Table.Cell>
                <Table.Cell>
                  ~{formatAmount(item.totalPendingWithdraw)}
                </Table.Cell>
                <Table.Cell>{formatAmount(item.totalWithdrawFee)}</Table.Cell>
                <Table.Cell>
                  <div style={{ color: item.color }}>
                    <Icon
                      name="trophy"
                      size="large"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => setCoinSelected(item.coin)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Segment vertical style={{borderBottom: "none"}}>
          <Header as="h5">
            Total Airdrop:
            <br />
            {data.meta.airdrop.map((item, index) =>
              <Label style={{marginTop: "8px"}} key={index}>{item.coin}
                <Label.Detail style={{ color: "black", fontSize: "13px" }}>{item.amount}</Label.Detail>
              </Label>
            )}
          </Header>
        </Segment>

        <Modal
          open={coinSelected !== null}
          size="small"
          onClose={() => setCoinSelected(null)}
        // closeIcon
        >
          <Modal.Header>
            {coinSelected} Top Holder
            <Icon
              link
              name="close"
              onClick={() => setCoinSelected(null)}
              style={{ position: "absolute", top: "1em", right: "1em" }}
            />
          </Modal.Header>
          <Modal.Content>
            <CoinStatistic coin={coinSelected} />
          </Modal.Content>
        </Modal>
      </Segment>
    )
  );
}

export default FundStatistic;
