import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Header,
  Icon,
  Modal,
  Pagination,
  Segment,
  Tab,
  Table,
  Button,
} from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { post, _delete } from "../../utils/api";
import CustomPagination from "../CustomPagination";
import AdminForm from "./AdminForm";

function AdminList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [admin, setAdmin] = useState(null);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory();

  useEffect(() => {
    post(
      `/admin-service/admin/list`,
      {
        page,
        pageSize,
      },
      (data) => setData(data)
    );
  }, [page, pageSize]);

  const _handleDelete = (id) => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete admin id = " + id + " ?",
        callback: () => {
          _delete(`/admin-service/admin/${id}`, {}, () => {
            toast("Delete admin successfully");
            post(
              `/admin-service/admin/list`,
              {
                page,
                pageSize,
              },
              (data) => setData(data)
            );
          });
        },
      },
    });
  };

  return (
    data && (
      <>
        <Header style={{marginTop: "10px", marginBottom: "0px"}}>List Administrators</Header>
        <Segment style={{ textAlign: "right", marginRight: "20px", paddingBottom: "10px" }}  vertical>
          <Button
          content='Add Administrators'
          onClick={() => history.push("/admin/create")}
        />
        </Segment>
        <Table celled striped selectable compact="very" basic="very" singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.items.map((item, index) => (
              <Table.Row key={index}>
                <Table.HeaderCell>#{item.id}</Table.HeaderCell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.role}</Table.Cell>
                <Table.Cell>
                  {item.isActive ? (
                    <Icon name="checkmark" color="green" />
                  ) : (
                    <Icon name="x" color="red" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Link to="#" onClick={() => setAdmin(item)}>
                    Edit
                  </Link>
                  {" | "}
                  <Link to="#" onClick={() => _handleDelete(item.id)}>
                    Delete
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <CustomPagination
          data={data}
          changePage={(e, { activePage }) => setPage(activePage)}
          changePageSize={(e, { value }) => setPageSize(value)}
        />
        <Modal open={admin !== null} onClose={() => setAdmin(null)} closeIcon>
          <Modal.Header>Update admin</Modal.Header>
          <Modal.Content>
            <AdminForm
              data={admin}
              callback={() => {
                post(
                  `/admin-service/admin/list`,
                  {
                    page,
                    pageSize: 10,
                  },
                  (data) => setData(data)
                );
                setAdmin(null);
              }}
            />
          </Modal.Content>
        </Modal>
      </>
    )
  );
}

export default AdminList;
