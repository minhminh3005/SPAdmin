import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Confirm, Form, Header, Segment } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { put } from "../../utils/api";
import { logout } from "../../utils/auth";

function ChangePassword() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const _handleChangePassword = (e) => {
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (oldPassword.trim() === "") {
      toast.error("Please input old password");
    } else if (newPassword.trim().length < 8) {
      toast.error("Please input new password > 8 character");
    } else if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password not match");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Change password ?",
          callback: () => {
            put(
              `/admin-service/admin/change-pwd`,
              {
                oldPassword,
                password: newPassword,
                device: "admin",
              },
              () => {
                toast("Change password successfully");
                setTimeout(() => {
                  logout();
                }, 1000);
              }
            );
          },
        },
      });
    }
  };

  return (
    <>
      <Header>Change password</Header>
      <Form onSubmit={_handleChangePassword}>
        <Form.Input
          label="Old password"
          name="oldPassword"
          id="oldPassword"
          type="password"
          required
        />
        <Form.Input
          label="New password"
          name="newPassword"
          id="newPassword"
          type="password"
          required
        />
        <Form.Input
          label="Confirm password"
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          required
        />
        <Button>Confirm</Button>
      </Form>
      <Confirm open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default ChangePassword;
