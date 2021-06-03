import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  Form,
  Header,
  Segment,
  Tab,
  Table,
} from "semantic-ui-react";
import { post } from "../../utils/api";
import { StatusCode } from "../../settings/constants";
import UserVerificationModal from "./UserVerificationModal";
import CustomPagination from "../CustomPagination";
import PendingVerification from "./PendingVerification";
import VerificationHistory from "./VerificationHistory";

function VerifyList() {
  const panes = [
    {
      menuItem: "Pending verification",
      render: () => <PendingVerification />,
    },
    {
      menuItem: "History",
      render: () => <VerificationHistory />,
    },
  ];
  return (
    <>
      <Header>Verifications</Header>
      <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
    </>
  );
}

export default VerifyList;
