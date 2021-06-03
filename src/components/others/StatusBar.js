import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Grid, Label, Segment } from "semantic-ui-react";
import { WALLET_ADMIN } from "../../settings";
import { post } from "../../utils/api";
import { Decrypt, getAccessToken } from "../../utils/auth";

function StatusBar() {
  const { manager } = useSelector((state) => state);
  const { withdraws, KYC } = manager;
  const [addressVerificationCount, setAddressVerificationCount] = useState(0);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (mounted) {
      post(
        `/user-service/address-verification/list`,
        {
          page: 1,
          pageSize: 1,
          filters: {
            status: "PENDING",
          },
        },
        (data) => setAddressVerificationCount(data.itemCount)
      );
    }
    return () => setMounted(false);
  }, [mounted]);

  return (
    <Segment style={{ marginBottom: 0 }} className="status-bar" color="red">
      <Grid>
        <Grid.Column computer={10}>
          {withdraws && withdraws.itemCount > 0 && (
            <Link to="/withdraw/pending">
              <Label color="red" circular>
                {withdraws.itemCount}
              </Label>{" "}
              withdraw pending for confirm
            </Link>
          )}
          {KYC && KYC.itemCount > 0 && (
            <Link to="/user/verifications">
              <Label color="yellow" circular>
                {KYC.itemCount}
              </Label>{" "}
              KYC pending
            </Link>
          )}
          {addressVerificationCount > 0 && (
            <Link to="/user/address-verifications">
              <Label color="yellow" circular>
                {addressVerificationCount}
              </Label>{" "}
              address verification(s) pending
            </Link>
          )}
        </Grid.Column>
        <Grid.Column computer={6} textAlign="right">
          <Link
            to="#"
            onClick={() =>
              window.open(
                WALLET_ADMIN + "login-by-token?token=" + getAccessToken()
              )
            }
          >
            Go to Wallet admin
          </Link>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default StatusBar;
