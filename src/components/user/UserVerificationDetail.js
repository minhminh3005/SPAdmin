import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Dimmer,
  Form,
  Grid,
  Header,
  Image,
  Segment,
} from "semantic-ui-react";
import { formatDate } from "../../settings/format";
import { get, post } from "../../utils/api";
import ZoomImage from "../ZoomImage";

function UserVerificationDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [frontPhoto, setFrontPhoto] = useState("");
  const [backPhoto, setBackPhoto] = useState("");
  const [selfiePhoto, setSelfiePhoto] = useState("");
  const [imageWantZoom, setImageWantZoom] = useState(null);

  useEffect(() => {
    post(
      `/user-service/identity-verification/list`,
      {
        page: 1,
        pageSize: 1,
        filters: {
          id,
        },
      },
      (res) => {
        const data = res.items[0];
        setData(data);
        get(`/user-service/photo/${data.id}/${data.frontPhoto}`, (data) => {
          setFrontPhoto(`data:image/${data.extension};base64,${data.base64}`);
          setImageWantZoom(
            `data:image/${data.extension};base64,${data.base64}`
          );
        });
        get(`/user-service/photo/${data.id}/${data.backPhoto}`, (data) =>
          setBackPhoto(`data:image/${data.extension};base64,${data.base64}`)
        );
        get(`/user-service/photo/${data.id}/${data.selfiePhoto}`, (data) =>
          setSelfiePhoto(`data:image/${data.extension};base64,${data.base64}`)
        );
      }
    );
  }, [id]);

  return (
    <Dimmer page active>
      {data && (
        <Segment
          textAlign="left"
          style={{
            color: "#000",
            width: "100vw",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <Segment basic vertical>
            <Grid celled>
              <Grid.Column width="6">
                <h3>
                  #{data.id} - {data.status}
                </h3>
                <p>KYC date: {formatDate(data.time)}</p>
                <p>Email: {data.email}</p>
                <p>
                  Full name: {data.lastName} {data.middleName} {data.firstName}
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
        </Segment>
      )}
    </Dimmer>
  );
}

export default UserVerificationDetail;
