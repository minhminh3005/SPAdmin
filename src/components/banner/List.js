import { FormGroup } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { Button, Form, Grid, Icon } from "semantic-ui-react";
import Alert from "@material-ui/lab/Alert";
import "./style.css";
import { post } from "../../utils/api";

function BannerForm({ data }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectUrlError, setRedirectUrlError] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function handleCreate() {
    var isValid = true;
    if (!name || name.length <= 0) {
      setNameError(true);
      isValid = false;
    }
    if (!imageUrl || imageUrl.length <= 0) {
      setImageUrlError(true);
      isValid = false;
    }
    if (!redirectUrl || redirectUrl.length <= 0) {
      setRedirectUrlError(true);
      isValid = false;
    }
    // if (isValid) {
    //   post;
    // }
  }

  function handleNameChange(value) {
    setName(value);
    setNameError(false);
  }
  function handleImageUrlChange(value) {
    setImageUrl(value);
    setImageUrlError(false);
  }
  function handleRedirectUrlChange(value) {
    setRedirectUrl(value);
    setRedirectUrlError(false);
  }

  return (
    <div className="banner-form custom-page">
      <div className="segment">
        <label className="title">
          <span>{data ? "Update banner" : "Create banner"}</span>
        </label>
        <div className="segment-content">
          <Grid>
            <Grid.Column computer={8}>
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Name"
                    step="any"
                    value={name}
                    onChange={(e, { value }) => handleNameChange(value)}
                    placeholder="Banner name"
                  />
                </Form.Group>
                {nameError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input banner name.
                  </Alert>
                ) : (
                  ""
                )}

                <Form.Group widths="equal">
                  <Form.Input
                    label="Image URL"
                    step="any"
                    value={imageUrl}
                    onChange={(e, { value }) => handleImageUrlChange(value)}
                    placeholder="https://...."
                  />
                </Form.Group>
                {imageUrlError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input image url.
                  </Alert>
                ) : (
                  ""
                )}
                <Form.Group widths="equal">
                  <Form.Input
                    label="Redirect URL"
                    step="any"
                    value={redirectUrl}
                    onChange={(e, { value }) => handleRedirectUrlChange(value)}
                    placeholder="https://...."
                  />
                </Form.Group>
                {redirectUrlError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input redirect url.
                  </Alert>
                ) : (
                  ""
                )}
                <Form.Group widths="equal" style={{ marginTop: "30px" }}>
                  <Form.Checkbox
                    label="High light"
                    checked={isHighlight}
                    onChange={(e, { checked }) => setIsHighlight(checked)}
                  />
                  <Form.Checkbox
                    label="Active"
                    checked={isActive}
                    onChange={(e, { checked }) => setIsActive(checked)}
                  />
                </Form.Group>
                <Form.Group widths="equal" style={{ marginTop: 30 }}>
                  <Form.Button
                    type="button"
                    primary
                    onClick={() => handleCreate()}
                  >
                    Create
                  </Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column computer={8}>
              <div className="image-box">
                {imageUrl && imageUrl.length < 30 ? (
                  <div className="icon">
                    <Icon name="image"></Icon>
                  </div>
                ) : (
                  ""
                )}
                <div
                  className="img"
                  style={{ background: `url(${imageUrl})` }}
                />
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default BannerForm;
