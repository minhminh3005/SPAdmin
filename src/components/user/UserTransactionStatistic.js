import React from "react";
import { Label, Segment } from "semantic-ui-react";

function UserTransactionStatistic() {
  return (
    <Segment vertical>
      <Label>Deposit: </Label>
      <Label>Withdraw: </Label>
      <Label>Swap: </Label>
      <Label>Staking: </Label>
      <Label>: </Label>
      <Label>Deposit: </Label>
    </Segment>
  );
}

export default UserTransactionStatistic;
