import React from "react";
import { Header, Segment } from "semantic-ui-react";
import MarketForm from "./MarketForm";

function CreateMarket() {
  return (
    <>
      <Header>Create Trade Market</Header>
      <MarketForm action="create"/>
    </>
  );
}

export default CreateMarket;
