import React, { useState } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { post } from "../../utils/api";
import SwapMarketForm from "./SwapMarketForm";

function CreateSwapMarket() {
  return (
    <>
      <Header>Create Swap Market</Header>
      <SwapMarketForm />
    </>
  );
}

export default CreateSwapMarket;
