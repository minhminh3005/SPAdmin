import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
import { post } from "../../utils/api";
import StakingProductFrom from "./StakingProductFrom";
import { imageURL } from "../../utils/api";

function Edit({ item, callback }) {
  const _close = (e) => {
    if (e.target.className === "close icon") {
      callback();
    }
  };
  return (
    item && (
      <Modal onClose={_close} open={item !== null} closeIcon>
        <Modal.Header>Edit Staking Product</Modal.Header>
        <Modal.Content>
          <StakingProductFrom action="edit" data={item} callback={callback} />
        </Modal.Content>
      </Modal>
    )
  );
}

function StakingProduct() {
  const [list, setList] = useState(null);
  const [item, setItem] = useState(null);
  const history = useHistory();

  useEffect(() => {
    post(`/staking-service/product/list`, {}, _success);
  }, []);

  const _success = (e) => {
    setList(e);
  };

  return (
    <>
      <Header id="product__header">List Staking Products</Header>
      <Segment id="product_button_add" vertical>
        <Button
          content='Add Product'
          onClick={() => history.push("/staking/create-product")}
        />
      </Segment>

      <Segment loading={!list} vertical className="column_fixed" id="horizontal_scroll_table">
        <Table celled selectable compact="very" basic="very" sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Staking Coin</Table.HeaderCell>
              <Table.HeaderCell>Redeem Coin</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Estimate Apy (%)</Table.HeaderCell>
              <Table.HeaderCell>Duration (days)</Table.HeaderCell>
              <Table.HeaderCell>Min</Table.HeaderCell>
              <Table.HeaderCell>Max</Table.HeaderCell>
              <Table.HeaderCell>Pool size</Table.HeaderCell>
              <Table.HeaderCell>Redeem period (days)</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {list &&
              list.map((s, i) => (

                <Table.Row key={i} negative={s.isActive ? false : true}>
                  <Table.Cell id="coin__image">
                    <Image className="image" src={imageURL + `/coins/${s.base}.png`} alt="" size='mini' />
                    <div className="coin">
                      {s.base}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div id="coin__image">
                      <Image className="image" src={imageURL + `/coins/${s.quote}.png`} alt="" size='mini' />
                      <div className="coin"> {s.quote}</div>

                    </div>
                  </Table.Cell>
                  <Table.Cell>{s.type}</Table.Cell>
                  <Table.Cell sorted="ascending">{s.estimateApy}</Table.Cell>
                  <Table.Cell>{s.duration}</Table.Cell>
                  <Table.Cell>{formatAmount(s.minAmount)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.maxAmount)}</Table.Cell>
                  <Table.Cell>{formatAmount(s.poolSize)}</Table.Cell>
                  <Table.Cell>{s.redeemPeriod}</Table.Cell>
                  <Table.Cell>
                    {s.isActive ? (
                      <Icon name="checkmark" color="green" />
                    ) : (
                      <Icon name="x" color="red" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {checkScope(["STAKING_PRODUCT_FULL"]) && (
                      <Link to="#" onClick={() => setItem(s)}>
                        Edit
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
          post(`/staking-service/product/list`, {}, _success);
          setItem(null);
        }}
      />
    </>
  );
}

export default StakingProduct;

// import React, { useState, useEffect } from 'react';
// import { useHistory, Link } from 'react-router-dom';
// import { post } from "../../utils/api";
// import { DataGrid } from '@material-ui/data-grid';
// import { Segment, Header, Button } from "semantic-ui-react";
// // import Button from '@material-ui/core/Button';
// import DeleteIcon from '@material-ui/icons/Delete';
// import { Icon, } from '@material-ui/core';
// import CheckIcon from '@material-ui/icons/Check';
// import CloseIcon from '@material-ui/icons/Close';
// import IconButton from '@material-ui/core/IconButton';


// export default function DataTable() {
//   const columns = [
//     { field: 'staking', headerName: 'Staking Coin', width: 130 },
//     { field: 'redeem', headerName: 'Redeem Coin', width: 130 },
//     { field: 'type', headerName: 'Type', width: 130 },
//     {
//       field: 'estimate',
//       headerName: 'Estimate',
//       type: 'number',
//       width: 90,
//     },
//     { field: 'duration', headerName: 'Duration', width: 130 },
//     { field: 'min', headerName: 'Min', width: 130 },
//     { field: 'max', headerName: 'Max', width: 130 },
//     { field: 'poolSize', headerName: 'Pool size', width: 130 },
//     { field: 'redeemPeriod', headerName: 'Redeem Period', width: 130 },
//     { field: 'active', headerName: 'Active', width: 100 },
//     { field: 'action', headerName: 'Action', width: 100 },

//   ];

//   const [list, setList] = useState(null);
//   const [item, setItem] = useState(null);
//   const [rows, setRows] = useState(null)
//   // console.log(rows)
//   const history = useHistory();

//   useEffect(() => {
//     post(`/staking-service/product/list`, {}, _success);
//   }, []);

//   const _success = (e) => {
//     setList(e);
//   };

//   useEffect(() => {
//     let _row = [];
//     let id = 0;
//     if (list) {
//       list.map((item, index) => {
//         _row.push({
//           id: index,
//           staking: item.base,
//           redeem: item.quote,
//           type: item.type,
//           estimate: item.estimateApy,
//           duration: item.duration,
//           min: item.minAmount,
//           max: item.maxAmount,
//           poolSize: item.poolSize,
//           redeemPeriod: item.redeemPeriod,
//           active: <CheckIcon />,
//           action: <Link to="#" onClick={() => setItem(item)}> Edit  </Link>
//         });
//       });
//       setRows(_row);
//     }

//   }, [list]);

//   return (
//     <>
//       <Header style={{ marginTop: "10px", marginBottom: "0px" }}>List Staking Products</Header>
//       <Segment style={{ textAlign: "right", marginRight: "20px", paddingBottom: "10px" }} vertical>
//         <Button
//           content='Add Product'
//           onClick={() => history.push("/staking/create-product")}
//         />
//       </Segment>   
//       <div style={{ height: 700, width: '100%' }}>
//         {rows &&
//           <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection />
//         }
//       </div>
//     </>
//   );
// }
