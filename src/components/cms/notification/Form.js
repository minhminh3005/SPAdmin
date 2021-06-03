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
import { stringToSlug } from "../../../utils/util";
import { SectionType } from "../../../settings/constants";

function NotificationForm({ data, onCloseForm, onSubmitSuccess }) {
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [slug, setSlug] = useState("");

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);

  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectUrlError, setRedirectUrlError] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState("");

  function handleSubmit() {
    var isValid = true;
    if (!name || name.length <= 0) {
      setNameError(true);
      isValid = false;
    }
    if (!title || title.length <= 0) {
      setTitleError(true);
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
          content: isEdit ? "Update notification?" : "Add new notification?",
          callback: () => {
            setProcessing(true);
            let param = {
              name: name,
              title: title,
              slug: slug,
              type: SectionType.NOTIFICATION.key,
              redirectUrl: redirectUrl,
              index: notificationIndex,
              isActive: isActive ? 1 : 0,
            };
            if (isEdit) {
              put(
                `${lang}/cms-service/post`,
                {
                  ...param,
                  id: data.id,
                },
                () => {
                  toast.success("Update notification success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Update notification Fail! ${error.msg}`);
                  setProcessing(false);
                },
                WALLET_ADMIN_API
              );
            } else {
              post(
                `${lang}/cms-service/post`,
                param,
                () => {
                  toast.success("Add notification success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Add notification Fail! ${error.msg}`);
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
    setSlug(stringToSlug(value));
    setNameError(false);
  }

  function handleTitleChange(value) {
    setTitle(value);
    setTitleError(false);
  }

  function handleRedirectUrlChange(value) {
    setRedirectUrl(value);
    setRedirectUrlError(false);
  }
  function handleIndexChange(value) {
    setNotificationIndex(value);
  }

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setName(data.name);
      setTitle(data.title);
      setSlug(stringToSlug(data.title));
      setRedirectUrl(data.redirectUrl);
      setIsActive(data.isActive);
      setNotificationIndex(data.index);
    }
    return () => setIsEdit(false);
  }, [data]);

  return (
    <div className="notification-form wrawer-content custom-page">
      <div className="segment">
        {processing ? (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        ) : (
          ""
        )}
        <label className="title">
          <span>{isEdit ? "Update notification" : "Create notification"}</span>
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
                    placeholder="Notification name"
                  />
                </Form.Group>
                {nameError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input notification name.
                  </Alert>
                ) : (
                  ""
                )}

                <Form.Group widths="equal">
                  <Form.Input
                    label="Slug"
                    step="any"
                    value={slug}
                    placeholder="Slug name"
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Input
                    label="Title"
                    step="any"
                    value={title}
                    onChange={(e, { value }) => handleTitleChange(value)}
                    placeholder="Title"
                  />
                </Form.Group>
                {titleError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input title.
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
                <Form.Group widths="equal">
                  <Form.Input
                    label="Index"
                    step="any"
                    value={notificationIndex}
                    onChange={(e, { value }) => handleIndexChange(value)}
                    placeholder="Index"
                  />
                </Form.Group>

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

export default NotificationForm;
