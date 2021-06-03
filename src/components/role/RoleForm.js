import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Form,
} from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { post, put } from "../../utils/api";

function RoleForm({ data, callback, fullScopes }) {
  const dispatch = useDispatch();
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    const scopes = [];
    if (data) {
      fullScopes.split(",").map((item) => {
        if (data.scopes.includes(item)) {
          scopes.push({
            scope: item,
            checked: true,
          });
        } else {
          scopes.push({
            scope: item,
            checked: false,
          });
        }
        return false;
      });
    } else {
      fullScopes.split(",").map((item) => {
        scopes.push({
          scope: item,
          checked: false,
        });
        return false;
      });
    }
    setScopes(scopes);
  }, [data]);

  const _handleSubmit = (e) => {
    const tempScopes = [];
    scopes.map((item) => {
      if (item.checked) tempScopes.push(item.scope);
      return false;
    });

    const name = e.target.name.value;
    const code = e.target.code.value;

    if (name.trim() === "") {
      toast.error("Please enter role name");
    } else if (code.trim() === "") {
      toast.error("Please enter role code");
    } else if (tempScopes.toString().trim() === "") {
      toast.error("Please enter scopes");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Are you create/update role ?",
          callback: () => {
            if (data) {
              put(
                `/admin-service/role`,
                {
                  name,
                  code,
                  Scopes: tempScopes.toString(),
                },
                () => {
                  toast.success("Update role successfully");
                  callback();
                }
              );
            } else {
              post(
                `/admin-service/role`,
                {
                  name,
                  code,
                  Scopes: tempScopes.toString(),
                },
                () => {
                  toast.success("Create role successfully");
                  callback();
                }
              );
            }
          },
        },
      });
    }
  };

  return (
    <Form onSubmit={_handleSubmit}>
      <Form.Input
        label="Name"
        id="name"
        name="name"
        defaultValue={data ? data.name : ""}
        placeholder="Please enter name"
        required
      />
      <Form.Input
        label="Code"
        id="code"
        name="code"
        defaultValue={data ? data.code : ""}
        placeholder="Please enter code"
        required
      />
      <Form.Field>
        <label>Scopes</label>
        {scopes.map((item, index) => (
          <div key={index}>
            <Checkbox
              label={item.scope}
              checked={item.checked}
              onChange={(e, { checked }) => {
                item.checked = checked;
                setScopes([...scopes]);
              }}
            />
          </div>
        ))}
      </Form.Field>
      <Button>{data ? "Update" : "Create"}</Button>
    </Form>
  );
}

export default RoleForm;
