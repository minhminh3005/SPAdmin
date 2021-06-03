import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form } from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { put } from "../../utils/api";

function CreateScope({ data, callback }) {
  const dispatch = useDispatch();

  const _onSubmit = (e) => {
    const { name, code } = data;
    const newScope = e.target.newScope.value;
    const scopes = data.scopes + "," + newScope;
    if (newScope.trim() === "") {
      toast.error("Please enter scopes");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Are you create new scope ?",
          callback: () => {
            put(
              `/admin-service/role`,
              {
                name,
                code,
                Scopes: scopes,
              },
              () => {
                toast.success("Create scope successfully");
                callback();
              }
            );
          },
        },
      });
    }
  };

  return (
    <Form onSubmit={_onSubmit}>
      <Form.Input
        label="New scope"
        placeholder="Enter new scope"
        id="newScope"
      />
      <Button>Create</Button>
    </Form>
  );
}

export default CreateScope;
