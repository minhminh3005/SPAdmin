import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment, Table } from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { checkScope } from "../../settings";
import { post, _delete } from "../../utils/api";
import RightBar from "../others/RightBar";
import CreateScope from "./CreateScope";
import RoleForm from "./RoleForm";

function ListRole() {
  const [roles, setRoles] = useState(null);
  const [role, setRole] = useState(null);
  const dispatch = useDispatch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateScopeForm, setShowCreateScopeForm] = useState(false);

  useEffect(() => {
    !roles && post(`/admin-service/role/list`, {}, (data) => setRoles(data));
  }, [roles]);

  const _handleDelete = (code) => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete role " + code + " ?",
        callback: () => {
          _delete(`/admin-service/role?code=${code}`, {}, () => {
            toast("Delete role successfully");
            post(`/admin-service/role/list`, {}, (data) => setRoles(data));
          });
        },
      },
    });
  };

  const _callback = () => {
    post(`/admin-service/role/list`, {}, (data) => setRoles(data));
    setRole(null);
    setShowCreateForm(false);
    setShowCreateScopeForm(false);
  };

  return (
    roles && (
      <Segment basic vertical>
        <Segment vertical>
          <Header>List Roles</Header>
        </Segment>
        {checkScope(["ROLE_FULL"]) && (
          <Segment vertical>
            <Button onClick={() => setShowCreateForm(true)}>Create Role</Button>
            <Button onClick={() => setShowCreateScopeForm(true)}>
              Create Scope
            </Button>
          </Segment>
        )}
        <Header>List Roles</Header>
        <Table
          celled
          selectable
          compact="very"
          basic="very"
          singleLine
          unstackable
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Scopes</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {roles.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.code}</Table.Cell>
                <Table.Cell>
                  <div className="address">{item.scopes.toString()}</div>
                </Table.Cell>
                <Table.Cell className="toolbar">
                  {checkScope(["ROLE_FULL"]) && (
                    <>
                      <Link to="#" onClick={() => setRole(item)}>
                        <Icon name="edit outline" circular inverted />
                      </Link>
                      <Link to="#" onClick={() => _handleDelete(item.code)}>
                        <Icon name="cancel" circular inverted />
                      </Link>
                    </>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <RightBar visible={role !== null} close={() => setRole(null)}>
          <Header>Edit Role Detail</Header>
          {role && (
            <RoleForm
              action="edit"
              data={role}
              callback={_callback}
              fullScopes={roles.filter((item) => item.code === "DEV")[0].scopes}
            />
          )}
        </RightBar>
        <RightBar
          visible={showCreateForm}
          close={() => setShowCreateForm(false)}
        >
          <Header>Create Role</Header>
          <RoleForm
            callback={_callback}
            fullScopes={roles.filter((item) => item.code === "DEV")[0].scopes}
          />
        </RightBar>
        <RightBar
          visible={showCreateScopeForm}
          close={() => setShowCreateScopeForm(false)}
        >
          <Header>Create Scope</Header>
          <CreateScope
            callback={_callback}
            data={roles.filter((item) => item.code === "DEV")[0]}
          />
        </RightBar>
      </Segment>
    )
  );
}

export default ListRole;
