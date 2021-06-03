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
import { objToArray, stringToSlug } from "../../../utils/util";
import { SectionType } from "../../../settings/constants";

function SectionForm({ data, onCloseForm, onSubmitSuccess }) {
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [slug, setSlug] = useState("");

  const [type, setType] = useState(null);
  const [typeError, setTypeError] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [sectionIndex, setSectionIndex] = useState("");

  function handleSubmit() {
    var isValid = true;
    if (!name || name.length <= 0) {
      setNameError(true);
      isValid = false;
    }

    if (!type) {
      setTypeError(true);
      isValid = false;
    }

    if (isValid) {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: isEdit ? "Update section?" : "Add new section?",
          callback: () => {
            setProcessing(true);
            let param = {
              name: name,
              slug: slug,
              type: type,
              isActive: isActive ? 1 : 0,
              index: sectionIndex,
            };
            if (isEdit) {
              put(
                `${lang}/cms-service/section`,
                {
                  ...param,
                  id: data.id,
                },
                () => {
                  toast.success("Update section success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Update section Fail! ${error.msg}`);
                  setProcessing(false);
                },
                WALLET_ADMIN_API
              );
            } else {
              post(
                `${lang}/cms-service/section`,
                param,
                () => {
                  toast.success("Add section success!");
                  setProcessing(false);
                  if (onSubmitSuccess) onSubmitSuccess();
                  onCloseForm();
                },
                (error) => {
                  toast.error(`Add section Fail! ${error.msg}`);
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

  function handleTypeChange(value) {
    setType(value);
    setTypeError(false);
  }
  function handleIndexChange(value) {
    setSectionIndex(value);
  }

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setName(data.name);
      setSlug(stringToSlug(data.name));
      setType(data.type);
      setIsActive(data.isActive);
      setSectionIndex(data.index);
    }
    return () => setIsEdit(false);
  }, [data]);

  return (
    <div className="section-form wrawer-content custom-page">
      <div className="segment">
        {processing ? (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        ) : (
          ""
        )}
        <label dataclassName="title">
          <span>{isEdit ? "Update section" : "Create section"}</span>
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
                    placeholder="Section name"
                  />
                </Form.Group>
                {nameError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please input section name.
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
                  <Form.Select
                    label="Type"
                    placeholder="Select type"
                    options={objToArray(SectionType)}
                    selectOnBlur={false}
                    onChange={(e, { value }) => handleTypeChange(value)}
                    defaultValue={type}
                    value={type}
                    disabled={isEdit === true}
                  />
                </Form.Group>
                {typeError ? (
                  <Alert style={{ marginBottom: 15 }} severity="error">
                    Please select section type.
                  </Alert>
                ) : (
                  ""
                )}
                <Form.Group widths="equal">
                  <Form.Input
                    label="Index"
                    step="any"
                    value={sectionIndex}
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

export default SectionForm;
