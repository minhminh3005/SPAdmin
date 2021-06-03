import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import {
  Segment,
  Table,
  Header,
  Label,
  Grid,
  FormRadio,
} from "semantic-ui-react";
import { getLinkProfile } from "../../settings";
import { formatAmount, formatTime } from "../../settings/format";
import { objToArray } from "../../utils/util";
import SearchHigherComponent from "../SearchHigherComponent";
import { post } from "../../utils/api";
import { _getIdProduct } from "../../actions/managerActions";
import { copyToClipboard } from "../../utils/util";

function StartupList({ data }) {
  const [meta, setMeta] = useState([]);
  const listIdProduct = [];
  const dispatch = useDispatch();
  useEffect(() => {
    post(
      `/presale-service/product/list`,
      {
        type: "",
      },
      _success
    );
  }, []);

  const _success = (e) => {
    e.map(item => {
      listIdProduct.push({ id: item.redirects[0].productId, base: item.base, quote: item.quote })
    });
    dispatch(_getIdProduct(listIdProduct));
  };

  useEffect(() => {
    const temp = data.meta;
    const metaObj = {};
    if (temp && temp.length > 0) {
      temp.map((item) => {
        const existMeta = metaObj[`${item.base}${item.quote}`];
        if (existMeta && existMeta.items) {
          existMeta.items.push({
            [item.type]: item.totalSale,
          });
        } else {
          metaObj[`${item.base}${item.quote}`] = {
            ...item,
            items: [{ [item.type]: item.totalSale }],
          };
        }
      });
    }
    setMeta(objToArray(metaObj));
  }, [data]);


  return (
    <>
      {data.meta ? <>
        <Header>Meta</Header>
        <Segment id="startup__meta">
          <Grid columns={6}>
            {data.meta && meta.map((item, index) => {
              return (
                <Grid.Column className="startup__column" key={index}>
                  <Label className="startup__label">
                    <span style={{ color: "black" }}>
                      {" "}
                      {item.base} - {item.quote}
                    </span>
                    <br />
                    <br />
                    {item.items.map((b, c) => {
                      return (
                        <div style={{ marginBottom: "0" }} key={c}>
                          <Label className="startup__label__detail">
                            {Object.keys(b)}
                            <Label.Detail>{formatAmount(Object.values(b))}</Label.Detail>
                          </Label>
                        </div>
                      );
                    })}
                  </Label>
                </Grid.Column>

              )
            })}
          </Grid>

        </Segment>
      </>
        : ""}

      <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
        <Grid>
          <Grid.Column computer={8} textAlign="left">
            <Header>List Transactions</Header>
          </Grid.Column>
          <Grid.Column computer={8}>
            <p>Total: {data.itemCount}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment loading={!data} vertical>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Product ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>From</Table.HeaderCell>
              <Table.HeaderCell>To</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((s, i) => (
              <Table.Row key={i}>
                <Table.HeaderCell>#{s.id}</Table.HeaderCell>
                <Table.Cell className="table_cell_copyhand">{getLinkProfile(s.userId, s.email)} <Link to="#"> <i aria-hidden="true" className="copy disabled icon teal" onClick={() => copyToClipboard(s.email)}></i></Link></Table.Cell>
                <Table.Cell>{s.productId}</Table.Cell>
                <Table.Cell>{s.type}</Table.Cell>
                <Table.Cell>
                  {formatAmount(s.total)} {s.quote}
                </Table.Cell>
                <Table.Cell>
                  {formatAmount(s.amount)} {s.base}
                </Table.Cell>
                <Table.Cell>{formatTime(s.time)}</Table.Cell>
              </Table.Row>
            ))}
            {data.itemCount === 0 && (
              <Table.Row>
                <Table.Cell style={{textAlign: "center"}} colSpan={12}>No records found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
}

export default SearchHigherComponent(StartupList, {
  endpoint: `/presale-service/transaction/list`,
  filterBy: ["id", "email", "from", "to", "base", "quote", "type", "idProduct"],
  component: "presale",
  exportLink: "/presale-service/transaction/list/export",
});
