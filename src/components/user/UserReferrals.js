import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Dimmer,
  Dropdown,
  Icon,
  Label,
  Pagination,
  Segment,
  Tab,
  Table,
} from "semantic-ui-react";
import { getLinkProfile } from "../../settings";
import { formatDate } from "../../settings/format";
import { get, post } from "../../utils/api";
import CustomPagination from "../CustomPagination";

function UserReferrals() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState("LEVEL");
  const [isDesc, setIsDesc] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [parentList, setParentList] = useState(null);

  useEffect(() => {
    post(
      `/user-service/referral/list-by-user/${id}`,
      {
        page,
        pageSize,
        orderBy, //JOIN TIME
        isDesc,
      },
      (data) => {
        setData(data);
      }
    );
    if (!parentList) {
      get(`/user-service/referral/parents-by-user/${id}`, (data) => {
        setParentList(data);
      });
    }
  }, [id, isDesc, orderBy, page, pageSize, parentList]);

  return (
    data && (
      <>
        {showAll && parentList && (
          <Dimmer page active>
            <Segment textAlign="right">
              <Icon
                link
                name="close"
                inverted
                color="black"
                onClick={() => setShowAll(false)}
              />
              <Table selectable striped compact="very" basic="very" celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Level</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {parentList.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.HeaderCell>#{item.id}</Table.HeaderCell>
                      <Table.Cell>
                        {getLinkProfile(item.id, item.email)}
                      </Table.Cell>
                      <Table.Cell>{item.level}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Dimmer>
        )}
        <div>
          Parent referral:{" "}
          {data.parent && (
            <Link to={`/user-detail/${data.parent.id}`}>
              {data.parent.email}
            </Link>
          )}
          <Label
            onClick={() => setShowAll(true)}
            style={{ marginLeft: "1em", cursor: "pointer" }}
          >
            View all
          </Label>
        </div>
        <Segment vertical textAlign="right">
          <p>Total: {data.childs.itemCount}</p>
        </Segment>
        <Segment vertical style={{ overflow: "auto" }}>
          <Table
            celled
            striped
            selectable
            compact="very"
            basic="very"
            singleLine
            sortable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell
                  sorted={
                    orderBy === "LEVEL"
                      ? !isDesc
                        ? "descending"
                        : "ascending"
                      : null
                  }
                  onClick={() => {
                    if (orderBy === "LEVEL") {
                      setIsDesc(!isDesc);
                    } else {
                      setOrderBy("LEVEL");
                    }
                  }}
                >
                  Level
                </Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Verify Level</Table.HeaderCell>
                <Table.HeaderCell
                  sorted={
                    orderBy === "JOINTIME"
                      ? isDesc
                        ? "descending"
                        : "ascending"
                      : null
                  }
                  onClick={() => {
                    if (orderBy === "JOINTIME") {
                      setIsDesc(!isDesc);
                    } else {
                      setOrderBy("JOINTIME");
                    }
                  }}
                >
                  Join time
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.childs.items.map((item, index) => (
                <Table.Row key={index}>
                  <Table.HeaderCell>#{item.id}</Table.HeaderCell>
                  <Table.Cell>
                    <Link to={`/user-detail/${item.id}`}>{item.email}</Link>
                  </Table.Cell>
                  <Table.Cell>{item.level}</Table.Cell>
                  <Table.Cell>{item.status}</Table.Cell>
                  <Table.Cell>{item.verifyLevel}</Table.Cell>
                  <Table.Cell>{formatDate(item.joinTime)}</Table.Cell>
                </Table.Row>
              ))}
              {data.childs.items.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={6}>No records found.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>
        <CustomPagination
          data={data.childs}
          changePage={(e, { activePage }) => setPage(activePage)}
          changePageSize={(e, { value }) => setPageSize(value)}
        />
      </>
    )
  );
}

export default UserReferrals;
