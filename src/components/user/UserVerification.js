import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Image, Input, Segment } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { API, checkScope, USER_API } from "../../settings";
import { formatDate, formatTime } from "../../settings/format";
import { get, put } from "../../utils/api";

function RotateImage({ image }) {
  const [degree, setDegree] = useState(0);

  return (
    <div>
      <Image
        src={image ? image : null}
        style={{
          width: 300,
          height: 300,
          transform: `rotate(${degree}deg)`,
          objectFit: "contain",
          backgroundColor: "#f8f9fa",
        }}
      />
      {/* <Button
        onClick={() => setDegree(degree + 90)}
        style={{ marginTop: "1em" }}
      >
        Rotate
      </Button> */}
    </div>
  );
}

function UserVerification() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState("");
  const [frontPhoto, setFrontPhoto] = useState("");
  const [backPhoto, setBackPhoto] = useState("");
  const [selfiePhoto, setSelfiePhoto] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    !data && get(`/user-service/identity-verification/${id}`, (data) => setData(data));
  });

  if (data) {
    get(`/user-service/photo/${id}/${data.frontPhoto}`, (data) =>
      setFrontPhoto(`data:image/${data.extension};base64,${data.base64}`)
    );
    get(`/user-service/photo/${id}/${data.backPhoto}`, (data) =>
      setBackPhoto(`data:image/${data.extension};base64,${data.base64}`)
    );
    get(`/user-service/photo/${id}/${data.selfiePhoto}`, (data) =>
      setSelfiePhoto(`data:image/${data.extension};base64,${data.base64}`)
    );
  }

  const _handleConfirm = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Verify user id = ${id} ?`,
        callback: () => {
          put(
            `/user-service/identity-verification`,
            {
              id: id,
              status: "VERIFIED",
              notice,
            },
            () => {
              toast(data.email + "is verified");
              get(`/user-service/identity-verification/${id}`, (data) => setData(data));
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
        content: `Reject user id = ${id} ?`,
        callback: () => {
          put(
            `/user-service/identity-verification`,
            {
              id: id,
              status: "REJECTED",
              notice,
            },
            () => {
              toast(data.email + "is rejected");
              get(`/user-service/identity-verification/${id}`, (data) => setData(data));
            }
          );
        },
      },
    });
  };

  return data ? (
    <>
      <Form>
        <Form.Group widths="equal">
          <Form.Field>#{data.id}</Form.Field>
          <Form.Field>Email: {data.email}</Form.Field>
          <Form.Field>Status: {data.status}</Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            Full name: {data.lastName} {data.middleName} {data.firstName}
          </Form.Field>
          <Form.Field>
            {data.idType} number: {data.idCode}
          </Form.Field>
          <Form.Field>Birthday: {formatDate(data.dateOfBirth)}</Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            Address: {data.residentialAddress} {data.city} {data.nationality}
          </Form.Field>
          <Form.Field>Postal code: {data.postalCode}</Form.Field>
          <Form.Field></Form.Field>
        </Form.Group>
      </Form>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Segment basic vertical loading={!frontPhoto} compact>
          <p>Front ID Card</p>
          <RotateImage image={frontPhoto} />
        </Segment>
        <Segment basic vertical loading={!backPhoto} compact>
          <p>Back ID Card</p>
          <RotateImage image={backPhoto} />
        </Segment>
        <Segment basic vertical loading={!selfiePhoto} compact>
          <p>Selfie photo</p>
          <RotateImage image={selfiePhoto} />
        </Segment>
      </div>

      {/* {checkScope(["KYC_FULL"]) && (
        <Segment vertical>
          <Segment vertical basic>
            <Input
              placeholder="Here is your notice"
              fluid
              onChange={(e, { value }) => setNotice(value)}
            />
          </Segment>
          <Button
            onClick={_handleConfirm}
            disabled={data.status === "VERIFIED"}
            positive
          >
            Confirm
          </Button>
          <Button onClick={_handleReject} negative>
            Reject
          </Button>
        </Segment>
      )} */}
    </>
  ) : (
    <Segment>Not send verification</Segment>
  );
}

export default UserVerification;
