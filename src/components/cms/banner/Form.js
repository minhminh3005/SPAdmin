import { Divider, FormGroup } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dimmer, Form, Grid, Icon, Loader } from "semantic-ui-react";
import Alert from "@material-ui/lab/Alert";
import "./style.css";
import { post, put } from "../../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_POPUP } from "../../../redux/constant";
import { toast } from "react-toastify";
import { WALLET_ADMIN_API } from "../../../settings";

function BannerForm({ data, onCloseForm, onSubmitSuccess }) {
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectUrlError, setRedirectUrlError] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bannerIndex, setBannerIndex] = useState("");
  const [imageSize, setImageSize] = useState([]);

  function handleSubmit() {
    var isValid = true;
    if (!name || name.length <= 0) {
      setNameError(true);
      isValid = false;
    }
    if (!imageUrl || imageUrl.length <= 0 || imageUrlError) {
      setImageUrlError(true);
      isValid = false;
    }
    if (!redirectUrl || redirectUrl.length <= 0) {
      setRedirectUrlError(true);
      isValid = false;
    }
    if (isValid) {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: isEdit ? "Update banner?" : "Add new banner?",
          callback: () => {
            setProcessing(true);
            let param = {
              name: name,
              imageUrl: imageUrl,
              redirectUrl: redirectUrl,
              highlight: isHighlight ? 1 : 0,
              isActive: isActive ? 1 : 0,
              index: bannerIndex,
            };
            if (isEdit) {
              put(
                `${lang}/cms-service/banner`,
                {
                  ...param,
                  id: data.id,
                },
                () => {
                  toast.success("Update banner success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Update banner Fail! ${error.msg}`);
                  setProcessing(false);
                },
                WALLET_ADMIN_API
              );
            } else {
              post(
                `${lang}/cms-service/banner`,
                param,
                () => {
                  toast.success("Add banner success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Add banner Fail! ${error.msg}`);
                  setProcessing(false);
                },
                WALLET_ADMIN_API
              );
            }
          },
        },
      });
    }
  }
  function handleNameChange(value) {
    setName(value);
    setNameError(false);
  }
  function handleImageUrlChange(value) {
    handleCheckSize(value);
    setImageUrl(value);
    setImageUrlError(false);
    setImageSize([]);
  }
  function handleRedirectUrlChange(value) {
    setRedirectUrl(value);
    setRedirectUrlError(false);
  }
  function handleIndexChange(value) {
    setBannerIndex(value);
  }

  function handleCheckSize(image) {
    const img = new Image();
    img.onload = function () {
      setImageSize([this.width, this.height]);
      if (this.width != 1270 || this.height != 720) {
        setImageUrlError(true);
        return false;
      }
    };
    img.src = image;
  }

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setName(data.name);
      setImageUrl(data.imageUrl);
      setRedirectUrl(data.redirectUrl);
      setIsActive(data.isActive);
      setIsHighlight(data.highlight);
      setBannerIndex(data.index);
    }
    return () => setIsEdit(false);
  }, [data]);

  return (
    <div className="banner-form wrawer-content custom-page">
      <div className="segment">
        {processing ? (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        ) : (
          ""
        )}
        <label className="title">
          <span>{isEdit ? "Update banner" : "Create banner"}</span>
        </label>
        <div className="segment-content">
          <Grid>
            <Grid.Column computer={16}>
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
                    label={
                      <>
                        <label>Image URL</label>
                        <p style={{ opacity: "0.5" }}>
                          Please insert the correct size image. Only accept size
                          [1270x720 pixel]
                        </p>
                      </>
                    }
                    step="any"
                    value={imageUrl}
                    onChange={(e, { value }) => handleImageUrlChange(value)}
                    placeholder="https://...."
                  />
                </Form.Group>
                {imageUrlError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Image url or image size is incorrect.
                  </Alert>
                ) : (
                  ""
                )}
                {imageUrl && imageUrl.length > 30 ? (
                  <div className="image-box">
                    {imageSize.length > 0 ? (
                      <div className="image-size">
                        {`${imageSize[0]} x ${imageSize[1]} px`}
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className="img"
                      style={{ background: `url(${imageUrl})` }}
                    />
                  </div>
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

                <Form.Group widths="equal">
                  <Form.Input
                    label="Index"
                    step="any"
                    value={bannerIndex}
                    onChange={(e, { value }) => handleIndexChange(value)}
                    placeholder="Index"
                  />
                </Form.Group>
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
                <Form.Group style={{ marginTop: 30 }}>
                  <Form.Button
                    type="button"
                    onClick={() => (onCloseForm ? onCloseForm() : null)}
                  >
                    Cancel
                  </Form.Button>
                  <Form.Button
                    type="button"
                    primary
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default BannerForm;
