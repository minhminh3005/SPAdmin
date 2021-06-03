import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Dimmer,
  Flag,
  Header,
  Input,
  Loader,
  Segment,
  Table,
  Dropdown,
  Grid,
  Icon,
  Label,
} from "semantic-ui-react";
import { formatTime } from "../../settings/format";
import { put, post } from "../../utils/api";
import { copyToClipboard } from "../../utils/util";
import SearchHigherComponent from "../SearchHigherComponent";

function UpdateUserRoles({ selectedUser, update, close }) {
  const [value, setValue] = useState(selectedUser.roles);

  const roleList = [
    { key: "MARKET_MAKER", value: "MARKET_MAKER", text: "MARKET_MAKER" },
    { key: "P2P_MAKER", value: "P2P_MAKER", text: "P2P_MAKER" },
  ];

  const _handleUpdateRole = () => {
    put(
      `/user-service/user/update-role`,
      {
        id: selectedUser.id,
        roles: value.filter((item) => item !== ""),
      },
      () => {
        update();
        toast.success("Update user roles successful");
      }
    );
  };

  return (
    <Dimmer page active>
      <Segment style={{ width: 400 }}>
        <Header>Update roles for user</Header>
        <Dropdown
          options={roleList}
          search
          clearable
          multiple
          selection
          placeholder="Select role"
          onChange={(e, { value }) => setValue(value)}
          value={value}
          style={{ marginBottom: "25px", width: "260px" }}
        />
        <br />
        <Button negative style={{ width: 130 }} onClick={close}>
          Cancel
        </Button>
        <Button positive style={{ width: 130 }} onClick={_handleUpdateRole}>
          Update
        </Button>
      </Segment>
    </Dimmer>
  );
}

function UserList({ data, onReload }) {
  const history = useHistory();
  const [selectedUser, setSelectedUser] = useState(null);

  if (data) {
    return (
      <>
        <Segment vertical textAlign="right" style={{ marginTop: "20px" }}>
          <Grid>
            <Grid.Column computer={8} textAlign="left">
              <Header>List Users</Header>
            </Grid.Column>
            <Grid.Column computer={8}>
              <p>Total: {data.itemCount}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment loading={!data} vertical>
          <Table celled striped selectable compact="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
                <Table.HeaderCell>Roles</Table.HeaderCell>
                <Table.HeaderCell>GA</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Join time</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data &&
                data.items.map((u, i) => (
                  <Table.Row key={i}>
                    <Table.HeaderCell>#{u.id}</Table.HeaderCell>
                    <Table.Cell className="table_cell_copyhand">
                      <Link to={`/user-detail/${u.id}`}>{u.email}</Link>
                      <Link to="#">
                        {" "}
                        <i
                          aria-hidden="true"
                          className="copy disabled icon teal"
                          onClick={() => copyToClipboard(u.email)}
                        ></i>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{u.countryCode}</Table.Cell>
                    <Table.Cell>{u.level}</Table.Cell>
                    <Table.Cell>{u.roles.toString()}</Table.Cell>
                    <Table.Cell>{u.gaEnable ? "ON" : "OFF"}</Table.Cell>
                    <Table.Cell>{u.status}</Table.Cell>
                    <Table.Cell>{formatTime(u.joinTime)}</Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => setSelectedUser(u)}>
                        Update roles
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              {data && data.itemCount === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={6}>No records found.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>
        {selectedUser && (
          <UpdateUserRoles
            close={() => setSelectedUser(null)}
            update={onReload}
            selectedUser={selectedUser}
          />
        )}
      </>
    );
  } else {
    return <Loader active />;
  }
}

export default SearchHigherComponent(UserList, {
  endpoint: `/user-service/user/list`,
  filterBy: ["id", "email", "status", "from", "to"],
  component: "user",
  exportLink: "/user-service/user/export",
});
