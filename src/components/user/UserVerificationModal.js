import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Dimmer,
  Dropdown,
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
  Select,
  TextArea,
} from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { API, checkScope, USER_API } from "../../settings";
import { formatDate, formatTime } from "../../settings/format";
import { get, put } from "../../utils/api";
import ZoomImage from "../ZoomImage";

const reason = [
  {
    key: 0,
    value: 0,
    text:
      "Vui lòng thực hiện chụp hình bằng Camera sau / Please take a photo by rear camera.",
  },
  {
    key: 1,
    value: 1,
    text:
      "Hình ảnh thông tin giấy tờ tùy thân không rõ / Identity information not clear",
  },
  {
    key: 2,
    value: 2,
    text:
      "Thông tin giấy tờ tùy thân không chính xác / Identity information wrong.",
  },
  {
    key: 3,
    value: 3,
    text:
      "Vui lòng cung cấp thông tin bằng tiếng Anh / Please provide information by English",
  },
  {
    key: 4,
    value: 4,
    text:
      "Hình ảnh không chân thật, vui lòng không dùng ứng dụng chụp ảnh từ bên thứ 3 / Please do not use Selfie applications for photos.",
  },
  {
    key: 5,
    value: 5,
    text: `Vui lòng kèm giấy note vào cả 3 mục KYC / Please add Paper Note to all 3 KYC pictures.`,
  },
  {
    key: 6,
    value: 6,
    text: `Thông tin cá nhân đã được đăng ký / Identity information was used/dupplicate.`,
  },

  {
    key: 7,
    value: 7,
    text:
      "Vui lòng ăn mặc lịch sự khi chụp hình KYC / Please wear formal clothes when taking pictures for KYC.",
  },
  {
    key: 8,
    value: 8,
    text: "Hình ảnh giấy note không rõ ràng / Paper Note was unclear.",
  },
  {
    key: 9,
    value: 9,
    text:
      "Thông tin trên giấy note không chính xác / Paper Note information was wrong.",
  },
  {
    key: 10,
    value: 10,
    text: "Khác. / Other.",
  },
];

function UserVerificationModal({ data, callback }) {
  const [notice, setNotice] = useState("");
  const [frontPhoto, setFrontPhoto] = useState("");
  const [backPhoto, setBackPhoto] = useState("");
  const [selfiePhoto, setSelfiePhoto] = useState("");
  const dispatch = useDispatch();
  const [imageWantZoom, setImageWantZoom] = useState(null);
  const [sameUser, setSameUser] = useState(null);
  const [otherReason, setOtherReason] = useState("");

  useEffect(() => {
    setFrontPhoto("");
    setBackPhoto("");
    setSelfiePhoto("");
    setImageWantZoom(null);
    if (data) {
      get(`/user-service/photo/${data.id}/${data.frontPhoto}`, (data) => {
        setFrontPhoto(`data:image/${data.extension};base64,${data.base64}`);
        setImageWantZoom(`data:image/${data.extension};base64,${data.base64}`);
      });
      get(`/user-service/photo/${data.id}/${data.backPhoto}`, (data) =>
        setBackPhoto(`data:image/${data.extension};base64,${data.base64}`)
      );
      get(`/user-service/photo/${data.id}/${data.selfiePhoto}`, (data) =>
        setSelfiePhoto(`data:image/${data.extension};base64,${data.base64}`)
      );
      get(`/user-service/identity-verification/scan/${data.id}`, (data) =>
        setSameUser(data)
      );
    }
  }, [data]);
  useEffect(() => {
    if (notice === 10) {
      setOtherReason("");
    }
  }, [notice]);

  const _handleConfirm = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Verify user id = ${data.id} ?`,
        callback: () => {
          put(
            `/user-service/identity-verification`,
            {
              id: data.id,
              status: "VERIFIED",
              notice: "",
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
    var note = "";
    if (notice && reason[notice]) {
      if (notice === 10) {
        note = otherReason;
      } else {
        note = reason[notice].text;
      }
    }
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Reject user id = ${data.id}`,
        callback: () => {
          console.log("note", note);
          put(
            `/user-service/identity-verification`,
            {
              id: data.id,
              status: "REJECTED",
              notice: note,
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
                  <p>Email: {data.email}</p>
                  <p>
                    Full name: {data.lastName} {data.middleName}{" "}
                    {data.firstName}
                  </p>
                  <p>
                    {data.idType} number: {data.idCode}
                  </p>
                  <p>Birthday: {formatDate(data.dateOfBirth)}</p>
                  <p>Address: {data.residentialAddress}</p>
                  <p>City: {data.city}</p>
                  <p>Country: {data.nationality}</p>
                  <p>Postal code: {data.postalCode}</p>
                  <div style={{ display: "flex" }}>
                    <Segment
                      basic
                      vertical
                      loading={!frontPhoto}
                      compact
                      onClick={() => setImageWantZoom(frontPhoto)}
                    >
                      <p>Front ID Card</p>
                      <Image
                        src={frontPhoto}
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          marginRight: 10,
                          cursor: "pointer",
                        }}
                      />
                    </Segment>
                    <Segment
                      basic
                      vertical
                      loading={!backPhoto}
                      compact
                      onClick={() => setImageWantZoom(backPhoto)}
                    >
                      <p>Back ID Card</p>
                      <Image
                        src={backPhoto}
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          marginRight: 10,
                          cursor: "pointer",
                        }}
                      />
                    </Segment>
                    <Segment
                      basic
                      vertical
                      loading={!selfiePhoto}
                      compact
                      onClick={() => setImageWantZoom(selfiePhoto)}
                    >
                      <p>Selfie photo</p>
                      <Image
                        src={selfiePhoto}
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </Segment>
                  </div>
                </Grid.Column>
                <Grid.Column width="10">
                  {imageWantZoom && <ZoomImage image={imageWantZoom} />}
                </Grid.Column>
              </Grid>
            </Segment>
            <Grid columns={2}>
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
              <Grid.Column>
                {checkScope(["KYC_FULL"]) && (
                  <Segment>
                    <Header>Verification Form</Header>
                    <Segment vertical basic>
                      <Dropdown
                        selection
                        onChange={(e, { value }) => setNotice(value)}
                        value={notice}
                        fluid
                        search
                        placeholder="Here is your notice"
                        options={reason}
                        clearable
                        renderLabel={(item) => (
                          <span>
                            {item.value}. {item.text}
                          </span>
                        )}
                        selectOnBlur={false}
                      />
                    </Segment>
                    {notice === 10 ? (
                      <Form>
                        <TextArea
                          placeholder="Lý do/Reason"
                          style={{ minHeight: "200px" }}
                          onChange={(e, value) => setOtherReason(value.value)}
                        />
                      </Form>
                    ) : (
                      ""
                    )}
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
            </Grid>
            {/* <ZoomImage
              image={imageWantZoom}
              callback={() => setImageWantZoom(null)}
            /> */}
          </Segment>
        )}
      </Segment>
    </Dimmer>
  );
}

export default UserVerificationModal;
