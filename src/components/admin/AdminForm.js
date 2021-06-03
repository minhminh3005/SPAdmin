/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { post, put } from "../../utils/api";

function AdminForm({ data, callback }) {
  const [roles, setRoles] = useState(null);
  const [role, setRole] = useState(data ? data.role : "DEV");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    !roles &&
      post(`/admin-service/role/list`, {}, (data) => {
        const temp = [];
        data.forEach((item) =>
          temp.push({
            key: item.code,
            value: item.code,
            text: item.name,
          })
        );
        setRoles(temp);
      });
  }, [roles]);

  const _handleSubmit = (e) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    const isActive = e.target.isActive.checked;
    if (email.trim() === "") {
      toast.error("Please enter email");
    } else if (!data && password.trim().length < 8) {
      toast.error("Please enter password > 8 character");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Are you create/update admin ?",
          callback: () => {
            if (data) {
              put(
                `/admin-service/admin`,
                {
                  id: data.id,
                  role,
                  isActive,
                },
                () => {
                  toast("Update admin successfully");
                  callback();
                }
              );
            } else {
              post(
                `/admin-service/admin`,
                {
                  email,
                  password,
                  role,
                  isActive,
                },
                () => {
                  toast("Create admin successfully");
                  history.push("/admin/list");
                }
              );
            }
          },
        },
      });
    }
    // console.log(email, password, role, isActive);
  };

  return (
    roles && (
      <Form onSubmit={_handleSubmit}>
        <Form.Input
          label="Email"
          id="email"
          name="email"
          defaultValue={data ? data.email : ""}
          disabled={data !== undefined}
          placeholder="Please enter email"
          required
        />
        <Form.Input
          label="Password"
          id="password"
          name="password"
          type="password"
          defaultValue={data ? data.password : ""}
          disabled={data !== undefined}
          placeholder="Please enter password"
          required
        />
        <Form.Dropdown
          options={roles}
          selection
          value={role}
          search
          onChange={(e, { value }) => setRole(value)}
        />
        <Form.Checkbox
          label="Active"
          defaultChecked={data ? data.isActive : false}
          name="isActive"
          id="isActive"
        />
        <Button>{data ? "Update" : "Create"}</Button>
      </Form>
    )
  );
}

export default AdminForm;
