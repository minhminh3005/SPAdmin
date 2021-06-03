import React, { useEffect, useState } from "react";
import { Button, Form, Header, Segment, Select } from "semantic-ui-react";
import { post } from "../../utils/api";
import SwapProductForm from "./SwapProductForm";

function CreateProduct() {
  return (
    <>
      <Header>Create Swap Product</Header>
      <SwapProductForm />
    </>
  );
}

export default CreateProduct;
