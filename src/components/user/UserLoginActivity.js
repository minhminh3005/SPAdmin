import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pagination, Segment, Table } from "semantic-ui-react";
import { formatTime } from "../../settings/format";
import { get, post } from "../../utils/api";
import CustomPagination from "../CustomPagination";

function UserLoginActivity() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    post(
      `/user-service/login-activity/list-by-user/${id}`,
      {
        page,
        pageSize,
      },
      (data) => setData(data)
    );
  }, [id, page, pageSize]);

  return (
    data && (
      <>
        <Segment vertical textAlign="right">
          <p>Total: {data.itemCount}</p>
        </Segment>
        <Segment vertical style={{ overflow: "auto" }}>
          <Table
            celled
            striped
            selectable
            compact="very"
            basic="very"
            singleLine
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>IP</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Device</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.items.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.ip}</Table.Cell>
                  <Table.Cell>{item.location}</Table.Cell>
                  <Table.Cell>{item.device}</Table.Cell>
                  <Table.Cell>{formatTime(item.time)}</Table.Cell>
                </Table.Row>
              ))}
              {data.items.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={4}>No records found.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>
        <CustomPagination
          data={data}
          changePage={(e, { activePage }) => setPage(activePage)}
          changePageSize={(e, { value }) => setPageSize(value)}
        />
      </>
    )
  );
}

export default UserLoginActivity;
