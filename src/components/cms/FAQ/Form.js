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
import { Editor } from "@tinymce/tinymce-react";
import { useHistory, useParams } from "react-router";

function FAQForm({ data, onCloseForm, onSubmitSuccess }) {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;

  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [sectionID, setSectionID] = useState(null);
  const [sectionIDError, setSectionIDError] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [slug, setSlug] = useState("");

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);

  const [sections, setSections] = useState([]);

  const [htmlContent, setHtmlContent] = useState("");

  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [questionIndex, setQuestionIndex] = useState("");

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
    if (!sectionID) {
      setSectionIDError(true);
      isValid = false;
    }

    if (isValid) {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: isEdit ? "Update question?" : "Add new question?",
          callback: () => {
            setProcessing(true);
            const section = sections.find((item) => item.id === sectionID);
            let param = {
              name: name,
              title: title,
              slug: slug,
              type: section ? section.type : "",
              isActive: isActive ? 1 : 0,
              sectionId: sectionID,
              htmlContent: htmlContent,
              index: questionIndex,
            };
            if (isEdit) {
              param = {
                ...currentQuestion,
                name: name,
                title: title,
                slug: slug,
                sectionId: sectionID,
                type: section ? section.type : "",
                isActive: isActive ? 1 : 0,
                htmlContent: htmlContent,
                index: questionIndex,
              };
              put(
                `${lang}/cms-service/post`,
                {
                  ...param,
                  id: currentQuestion.id,
                },
                () => {
                  toast.success("Update question success!");
                  setProcessing(false);
                },
                (error) => {
                  toast.error(`Update question Fail! ${error.msg}`);
                  setProcessing(false);
                },
                WALLET_ADMIN_API
              );
            } else {
              post(
                `${lang}/cms-service/post`,
                param,
                () => {
                  toast.success("Add question success!");
                  setProcessing(false);
                },
                (error) => {
                  toast.error(`Add question Fail! ${error.msg}`);
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

  function handleGetSection() {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      isDesc: true,
      filters: {
        type: SectionType.FAQ.key,
      },
    };
    post(
      `${lang}/cms-service/section/list`,
      param,
      (result) => {
        result.items.map((item) => {
          item.key = item.id;
          item.value = item.id;
          item.text = item.name;
        });
        setSections(result.items);
      },
      null,
      WALLET_ADMIN_API
    );
  }

  function handleGetPostById(id) {
    if (id) {
      setProcessing(true);
      post(
        `${lang}/cms-service/post/list`,
        {
          page: 1,
          pageSize: 1,
          filters: {
            id: parseInt(id),
          },
        },
        (result) => {
          if (result) {
            const item = result.items[0];
            if (item) {
              setCurrentQuestion(item);
              setName(item.name);
              setTitle(item.title);
              setSectionID(item.sectionId);
              setHtmlContent(item.htmlContent);
              setSlug(item.slug);
              setIsEdit(true);
              setIsActive(item.isActive);
              setQuestionIndex(item.index);
            } else {
              setIsEdit(false);
            }
          }
          setProcessing(false);
        },
        () => {
          setProcessing(false);
        },
        WALLET_ADMIN_API
      );
    }
  }

  function handleSectionChange(value) {
    setSectionID(value);
    setSectionIDError(false);
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
  function handleIndexChange(value) {
    setQuestionIndex(value);
  }

  useEffect(() => {
    handleGetPostById(id);
  }, [id]);

  useEffect(() => {
    handleGetSection();
  }, [lang]);

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
          <span>{isEdit ? "Update question" : "Create question"}</span>
        </label>
        <div className="segment-content">
          <Form widths="equal">
            <Form.Group>
              <Form.Select
                label="Section"
                placeholder="Select section"
                options={sections}
                selectOnBlur={false}
                onChange={(e, { value }) => handleSectionChange(value)}
                value={sectionID}
              />
              <Form.Input
                label="Index"
                step="any"
                value={questionIndex}
                onChange={(e, { value }) => handleIndexChange(value)}
                placeholder="Index"
              />
            </Form.Group>
            {sectionIDError ? (
              <Alert style={{ marginBottom: 15 }} severity="error">
                Please select section.
              </Alert>
            ) : (
              ""
            )}
            <Form.Group widths="equal">
              <Form.Input
                label="Name"
                step="any"
                value={name}
                onChange={(e, { value }) => handleNameChange(value)}
                placeholder="Question name"
              />
            </Form.Group>
            {nameError ? (
              <Alert style={{ marginBottom: 15 }} severity="error">
                Please input question name.
              </Alert>
            ) : (
              ""
            )}
            <Form.Group widths="equal">
              <Form.Input
                label="Slug"
                step="any"
                value={slug}
                placeholder="Slug"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                label="Title"
                step="any"
                value={title}
                onChange={(e, { value }) => handleTitleChange(value)}
                placeholder="Question title"
              />
            </Form.Group>
            {titleError ? (
              <Alert style={{ marginBottom: 15 }} severity="error">
                Please input question title.
              </Alert>
            ) : (
              ""
            )}
          </Form>
          <span
            style={{ margin: "10px 0px", display: "block", fontWeight: "bold" }}
          >
            Question Content
          </span>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={htmlContent}
            onEditorChange={(newValue, editor) => {
              setHtmlContent(newValue);
            }}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "fullscreen undo redo | bold italic underline | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter  | pagebreak |  emoticons |   preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
              toolbar_sticky: false,
              toolbar_mode: "sliding",
              contextmenu: "link image imagetools table configurepermanentpen",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />

          <Form.Checkbox
            label="Active"
            style={{ marginTop: 30 }}
            checked={isActive}
            onChange={(e, { checked }) => setIsActive(checked)}
          />
          <Form>
            <Form.Group style={{ marginTop: 30 }}>
              <Form.Button
                type="button"
                onClick={() => history.replace("/cms/faq")}
              >
                Cancel
              </Form.Button>
              <Form.Button type="button" primary onClick={() => handleSubmit()}>
                Save
              </Form.Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default FAQForm;
