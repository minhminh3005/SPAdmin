import React from "react";
import { Header, Segment } from "semantic-ui-react";
import CoinForm from "./CoinForm";

function CreateCoin() {
  return (
    <>
      <Header>Create New Coin</Header>
      <CoinForm />
    </>
  );
}

export default CreateCoin;
