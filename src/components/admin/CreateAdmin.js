import React from "react";
import { Header, Segment } from "semantic-ui-react";
import AdminForm from "./AdminForm";

function CreateAdmin() {
  return (
    <>
      <Header>Create New Admin</Header>
      <AdminForm />
    </>
  );
}

export default CreateAdmin;
