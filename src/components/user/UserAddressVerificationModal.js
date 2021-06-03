import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  Modal,
  Popup,
  Segment,
} from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { API, checkScope, USER_API } from "../../settings";
import { formatDate, formatTime } from "../../settings/format";
import { get, put } from "../../utils/api";
import ZoomImage from "../ZoomImage";

function UserAddressVerificationModal({ data, callback }) {
  const [notice, setNotice] = useState("");
  const dispatch = useDispatch();
  const [imageWantZoom, setImageWantZoom] = useState(null);
  const [sameUser, setSameUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setImageWantZoom(null);
    if (data) {
      get(`/user-service/identity-verification/${data.id}`, (data) =>
        setUserInfo(data)
      );
      get(`/user-service/photo/${data.id}/${data.photo}`, (data) => {
        setImageWantZoom(`data:image/${data.extension};base64,${data.base64}`);
      });
    }
  }, [data]);

  const _handleConfirm = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Verify user id = ${data.id} ?`,
        callback: () => {
          put(
            `/user-service/address-verification`,
            {
              id: data.id,
              status: "VERIFIED",
              notice,
            },
            () => {
              toast(data.email + "is verified");
              callback();
            }
          );
        },
      },
    });
  };

  const _handleReject = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Reject user id = ${data.id}`,
        callback: () => {
          put(
            `/user-service/address-verification`,
            {
              id: data.id,
              status: "REJECTED",
              notice,
            },
            () => {
              toast(data.email + "is rejected");

              callback();
            }
          );
        },
      },
    });
  };

  let totalSameUser = {};
  if (sameUser) {
    const warning = sameUser.filter((element) => element.point > 3).length;
    const danger = sameUser.filter((element) => element.point > 5).length;
    if (danger > 0) {
      totalSameUser.type = "danger";
      totalSameUser.total = danger;
    } else if (warning > 0) {
      totalSameUser.type = "warning";
      totalSameUser.total = warning;
    }
  }

  return (
    <Dimmer active={data !== null} page>
      <Segment
        style={{
          color: "#000",
          width: "100vw",
          overflow: "auto",
          height: "100vh",
        }}
      >
        {data && (
          <Segment basic textAlign="left">
            <Icon
              name="x"
              onClick={callback}
              size="large"
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                right: 10,
                zIndex: 1001,
                opacity: 0.7,
              }}
            />
            <Segment basic vertical>
              <Grid celled>
                <Grid.Column width="6">
                  <h3>
                    #{data.id} - {data.status}
                    {totalSameUser.type && (
                      <>
                        {" "}
                        -{" "}
                        <Label
                          color={
                            totalSameUser.type === "warning" ? "orange" : "red"
                          }
                        >
                          <Header inverted> {totalSameUser.total}</Header>
                        </Label>{" "}
                        matched profiles
                      </>
                    )}
                  </h3>
                  <p>KYC date: {formatDate(data.time)}</p>
                  <p>KYC Address: {data.home}</p>
                  <hr/>
                  <p>Email: {data.email}</p>
                  <p>
                    Full name: {userInfo.lastName} {userInfo.middleName}{" "}
                    {userInfo.firstName}
                  </p>
                  <p>
                    {userInfo.idType} number: {userInfo.idCode}
                  </p>
                  <p>Birthday: {formatDate(userInfo.dateOfBirth)}</p>
                  <p>Address: {userInfo.residentialAddress}</p>
                  <p>City: {userInfo.city}</p>
                  <p>Country: {userInfo.nationality}</p>
                  <p>Postal code: {userInfo.postalCode}</p>
                  {checkScope(["KYC_FULL"]) && (
                    <Segment vertical>
                      <Header>Verification Form</Header>
                      <Segment vertical basic>
                        <Input
                          placeholder="Here is your notice"
                          onChange={(e, { value }) => setNotice(value)}
                          fluid
                        />
                      </Segment>
                      <Segment textAlign="right" basic vertical>
                        <Button
                          onClick={_handleReject}
                          negative
                          style={{ width: 100 }}
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={_handleConfirm}
                          positive
                          style={{ marginLeft: "2em", width: 100 }}
                        >
                          Confirm
                        </Button>
                      </Segment>
                    </Segment>
                  )}
                </Grid.Column>
                <Grid.Column width="10">
                  {imageWantZoom && <ZoomImage image={imageWantZoom} />}
                </Grid.Column>
              </Grid>
            </Segment>
            {/* <Grid columns={2}>
              <Grid.Column>
                <Segment>
                  <Header>Top matched profiles</Header>
                  <div>
                    {sameUser &&
                      sameUser.map((item, index) => (
                        <Popup
                          trigger={
                            <Link
                              to={`/user/verification-detail/${item.id}`}
                              target="_blank"
                            >
                              <Button
                                style={{ marginBottom: "0.2em" }}
                                color={
                                  item.point > 5
                                    ? "red"
                                    : item.point > 3
                                    ? "orange"
                                    : null
                                }
                              >
                                {item.email} | {item.point}
                              </Button>
                            </Link>
                          }
                          content={item.notes.join(", ")}
                          basic
                          inverted
                          style={{
                            opacity: 0.9,
                          }}
                        />
                      ))}
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column></Grid.Column>
            </Grid> */}
          </Segment>
        )}
      </Segment>
    </Dimmer>
  );
}

export default UserAddressVerificationModal;
