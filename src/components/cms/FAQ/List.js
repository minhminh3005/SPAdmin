import { Drawer, Icon, IconButton, Link, Tooltip } from "@material-ui/core";
import {
  BurstMode,
  Check,
  Close,
  Delete,
  Edit,
  ImageSearch,
  Search,
  VerticalAlignBottom,
  VerticalAlignTop,
} from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Loader,
  Segment,
  Table,
} from "semantic-ui-react";
import { SHOW_POPUP, SHOW_VIEWER } from "../../../redux/constant";
import { WALLET_ADMIN_API } from "../../../settings";
import { SectionType } from "../../../settings/constants";
import { post, put, _delete } from "../../../utils/api";
import { objToArray } from "../../../utils/util";
import BannerForm from "./Form";
import "./style.css";

function FAQ() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [notifications, setNotifications] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sections, setSections] = useState([]);
  const [sectionID, setSectionID] = useState(null);

  function handleGetSection() {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      orderBy: "index",
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

  function handleSectionChange(value) {
    setSectionID(value);
    handleGetNotification(value);
  }

  function handleGetNotification(section) {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      orderBy: "index",
      filters: {
        type: SectionType.FAQ.key,
        sectionId: section ? section : null,
      },
    };
    setIsProcessing(true);
    post(
      `${lang}/cms-service/post/list`,
      param,
      (result) => {
        setNotifications(result.items);
        setIsProcessing(false);
      },
      () => {
        setIsProcessing(false);
      },
      WALLET_ADMIN_API
    );
  }

  function handleDeleteQuestion(item) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete question?",
        callback: () => {
          setIsProcessing(true);
          _delete(
            `${lang}/cms-service/post/${item.id}`,
            null,
            () => {
              setIsProcessing(false);
              handleGetNotification();
              toast.success("Delete question success.");
            },
            (error) => {
              setIsProcessing(false);
              toast.error(`Delete question fail. ${error.msg}`);
            },
            WALLET_ADMIN_API
          );
        },
      },
    });
  }

  useEffect(() => {
    handleGetNotification();
    handleGetSection();
  }, [lang]);

  return (
    <div className="banner-list custom-page">
      <Segment>
        <span className="title">
          <span>FAQ management</span>
          <Button color="green" onClick={() => history.push("/cms/faq/create")}>
            Add new
          </Button>
        </span>
        <div className="filter w-50pc ">
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                label="Section"
                placeholder="Select section"
                options={sections}
                selectOnBlur={false}
                onChange={(e, { value }) => handleSectionChange(value)}
                value={sectionID}
                clearable
              />
            </Form.Group>
          </Form>
        </div>
        <div className="segment-content">
          {isProcessing ? (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          ) : (
            ""
          )}
          <Table>
            <Table.Header>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Index</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {notifications ? (
                notifications.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>#{item.id}</Table.Cell>
                    <Table.Cell>{item.index}</Table.Cell>
                    <Table.Cell>
                      <span className="ellipsis">{item.name}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        title={
                          <span className="tooltip-title">{item.title}</span>
                        }
                      >
                        <span className="ellipsis">{item.title}</span>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        title={
                          <span className="tooltip-title">{item.slug}</span>
                        }
                      >
                        <span className="ellipsis">{item.slug}</span>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <span>
                        {item.isActive ? (
                          <Check className="green" />
                        ) : (
                          <Close className="red" />
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell textAlign="right" anchor="top">
                      <Tooltip
                        title={
                          <span className="tooltip-title">Edit banner</span>
                        }
                      >
                        <IconButton
                          onClick={() =>
                            history.push(`/cms/faq/update/${item.id}`)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          <span className="tooltip-title">Delete banner</span>
                        }
                      >
                        <IconButton onClick={() => handleDeleteQuestion(item)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row></Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </Segment>
    </div>
  );
}

export default FAQ;
