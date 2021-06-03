import React from "react";
import { Button, Form, Header, Segment, Select } from "semantic-ui-react";
import StakingProductFrom from "./StakingProductFrom";

function CreateStakingProduct() {
  return (
    <>
      <Header>Create staking product</Header>
      <StakingProductFrom />
    </>
  );
}

export default CreateStakingProduct;
