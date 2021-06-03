import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Header, Label, Segment, Tab } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { checkFeature, checkScope } from "../../settings";
import { get, _delete, put } from "../../utils/api";
import SendAirdrop from "./SendAirdrop";
import UserAddress from "./UserAddress";
import UserDeposit from "./UserDeposit";
import UserFundLogs from "./UserFundLogs";
import UserFunds from "./UserFunds";
import UserLoginActivity from "./UserLoginActivity";
import UserNotes from "./UserNotes";
import UserOrders from "./UserOrders";
import UserReferrals from "./UserReferrals";
import UserStaking from "./UserStaking";
import UserSwap from "./UserSwap";
import UserTransactions from "./UserTransaction";
import UserTransactionStatistic from "./UserTransactionStatistic";
import UserVerification from "./UserVerification";
import UserWithdraw from "./UserWithdraw";

function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    get(
      `/user-service/user/${id}`,
      (data) => setData(data),
      (error) => console.error(error)
    );
  }, [id]);

  const panes = [
    {
      menuItem: checkScope(["FUND_READ_BY_USER"]) ? "Funds" : null,
      render: () => <UserFunds />,
    },
    {
      menuItem: "Verification",
      render: () => <UserVerification />,
    },
    {
      menuItem: "Affiliates",
      render: () => <UserReferrals />,
    },
    {
      menuItem: "Activity",
      render: () => <UserLoginActivity />,
    },
    {
      menuItem: checkScope(["DEPOSIT_READ_BY_USER"]) ? "Deposits" : null,
      render: () => <UserDeposit />,
    },
    {
      menuItem: checkScope(["DEPOSIT_READ_BY_USER"]) ? "Withdraws" : null,
      render: () => <UserWithdraw />,
    },
    {
      menuItem:
        checkScope(["SWAP_READ_BY_USER"]) && checkFeature("SWAP")
          ? "Swaps"
          : null,
      render: () => <UserSwap />,
    },
    {
      menuItem:
        checkScope(["STAKING_READ_BY_USER"]) && checkFeature("STAKING")
          ? "Stakings"
          : null,
      render: () => <UserStaking />,
    },
    {
      menuItem:   checkScope(["ADMIN_FULL"]) ? "Transactions" : null,
      render: () => <UserTransactions />,
    },
    {
      menuItem: checkScope(["ADMIN_FULL"]) ? "Fund logs" : null,
      render: () => <UserFundLogs />,
    },
    {
      menuItem: checkScope(["ADMIN_FULL"]) ? "Logs" : null,
      render: () => <UserNotes />,
    },
    {
      menuItem: checkScope(["ADMIN_FULL"]) ? "Addresses" : null,
      render: () => <UserAddress />,
    },
  ];

  const _handleUpdateStatus = () => {
    if (data.status === "ACTIVE") {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Block user id = " + id + " ?",
          callback: () => {
            _delete(`/user-service/user/disable/${id}`, {}, () =>
              get(`/user-service/user/${id}`, (data) => {
                toast("User is blocked");
                setData(data);
              })
            );
          },
        },
      });
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Unblock user id = " + id + " ?",
          callback: () => {
            put(`/user-service/user/active/${id}`, {}, () => {
              toast("User is unblocked");
              get(`/user-service/user/${id}`, (data) => setData(data));
            });
          },
        },
      });
    };
  };

  const _handleUpdateBlockedWithdraw = () => {
    if (data.blockedWithdraw === false) {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Block Withdraw id = " + id + " ?",
          callback: () => {
            put(`/user-service/user/update-blocked-withdraw`, {
              id,
              blockedWithdraw: true,
            }, () =>
              get(`/user-service/user/${id}`, (data) => {
                toast("User is blocked withdraw");
                setData(data);
              })
            );
          },
        },
      });
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Unblock user id = " + id + " ?",
          callback: () => {
            put(`/user-service/user/update-blocked-withdraw`, {
              id,
              blockedWithdraw: false,
            }, () => {
              toast("User is unblocked withdraw");
              get(`/user-service/user/${id}`, (data) => setData(data));
            });
          },
        },
      });
    }
  }

  const _handleDisableGA = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Disable Google authenticator user id = " + id + " ?",
        callback: () => {
          put(`/user-service/user/disable-ga/${id}`, {}, () => {
            toast("Disable GA success");

            get(`/user-service/user/${id}`, (data) => setData(data));
          });
        },
      },
    });
  };

  return data ? (
    <>
      <Header>User Detail</Header>
      <Segment vertical basic>
        <Label>ID: #{data.id}</Label>
        <Label>Email: {data.email}</Label>
        <Label color="green">Verify level: {data.verifyLevel}</Label>
        <Label>Status: {data.status}</Label>
        <Label>Google Authenticator: {data.gaEnable ? "ON" : "OFF"}</Label>
        <Label>Withdraw: {data.blockedWithdraw == false ? "UNBLOCKED" : "BLOCK"}</Label>
      </Segment>
      {checkScope(["USER_FULL"]) && (
        <>
          <Segment vertical basic>
            <Button
              positive={data.status === "BLOCK"}
              negative={data.status === "ACTIVE"}
              onClick={_handleUpdateStatus}
              disabled={data.status === "NEW"}
            >
              {data.status === "ACTIVE" ? "Block User" : "Unblock User"}
            </Button>
            <Button
              positive={data.blockedWithdraw === true || data.blockedWithdraw === null}
              negative={data.blockedWithdraw === false}
              onClick={_handleUpdateBlockedWithdraw}
              disabled={data.blockedWithdraw === ""}
            >
              {data.blockedWithdraw === false ? "Block Withdraw" :  "Unblock Withdraw"}
            </Button>
            <Button onClick={_handleDisableGA}>
              Disable Google Authenticator
            </Button>
            <SendAirdrop userEmail={data.email} />
          </Segment>
        </>
      )}
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </>
  ) : null;
}

export default UserDetail;
