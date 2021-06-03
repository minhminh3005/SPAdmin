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
  Loader,
  Segment,
  Table,
} from "semantic-ui-react";
import { SHOW_POPUP, SHOW_VIEWER } from "../../../redux/constant";
import { WALLET_ADMIN_API } from "../../../settings";
import { SectionType } from "../../../settings/constants";
import { post, put, _delete } from "../../../utils/api";
import BannerForm from "./Form";
import "./style.css";

function Notification() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [notifications, setNotifications] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleGetNotification() {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      orderBy: "index",
      filters: {
        type: SectionType.NOTIFICATION.key,
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

  function handleEditBanner(item) {
    setOpenCreateForm(true);
    setCurrentBanner(item);
  }

  function handleDeleteNotification(item) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete notification?",
        callback: () => {
          setIsProcessing(true);
          _delete(
            `${lang}/cms-service/post/${item.id}`,
            null,
            () => {
              setIsProcessing(false);
              handleGetNotification();
              toast.success("Delete notification success.");
            },
            (error) => {
              setIsProcessing(false);
              toast.error(`Delete notification fail. ${error.msg}`);
            },
            WALLET_ADMIN_API
          );
        },
      },
    });
  }

  function handleUpdate(item) {
    put(
      `${lang}/cms-service/banner`,
      {
        ...item,
        isActive: item ? 1 : 0,
        highlight: item.highlight ? 1 : 0,
      },
      () => {
        handleGetNotification();
        setIsProcessing(false);
      },
      (error) => {
        setIsProcessing(false);
      },
      WALLET_ADMIN_API
    );
  }

  function handleSwapUp(item1, item2) {
    handleUpdate({
      ...item1,
      index: item2.index,
    });
    handleUpdate({
      ...item2,
      index: item1.index,
    });
  }

  useEffect(() => {
    handleGetNotification();
  }, [lang]);

  return (
    <div className="banner-list custom-page">
      <Segment>
        <span className="title">
          <span>Notification management</span>
          <Button color="green" onClick={() => setOpenCreateForm(true)}>
            Add new
          </Button>
        </span>
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
              <Table.HeaderCell>Redirect</Table.HeaderCell>
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
                      <a
                        href={item.redirectUrl}
                        target="_blank"
                        className="ellipsis"
                      >
                        {item.redirectUrl}
                      </a>
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
                        <IconButton onClick={() => handleEditBanner(item)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          <span className="tooltip-title">Delete banner</span>
                        }
                      >
                        <IconButton
                          onClick={() => handleDeleteNotification(item)}
                        >
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
      <Drawer open={openCreateForm} anchor="right">
        <BannerForm
          data={currentBanner}
          onCloseForm={() => {
            setOpenCreateForm(false);
            setCurrentBanner(null);
          }}
          onSubmitSuccess={() => {
            handleGetNotification();
          }}
        />
      </Drawer>
    </div>
  );
}

export default Notification;
