import { Drawer, Icon, IconButton, Link, Tooltip } from "@material-ui/core";
import {
  BurstMode,
  Check,
  Close,
  Delete,
  Edit,
  FileCopy,
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
import { post, put, _delete } from "../../../utils/api";
import { copyToClipboard } from "../../../utils/util";
import BannerForm from "./Form";
import "./style.css";

function SectionList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [sections, setSections] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleGetSection() {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      orderBy: "index",
    };
    setIsProcessing(true);
    post(
      `${lang}/cms-service/section/list`,
      param,
      (result) => {
        setSections(result.items);
        setIsProcessing(false);
      },
      () => {
        setIsProcessing(false);
      },
      WALLET_ADMIN_API
    );
  }

  function hanldeEditSection(item) {
    setOpenCreateForm(true);
    setCurrentSection(item);
  }

  function hanldeDeleteSection(item) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete section?",
        callback: () => {
          setIsProcessing(true);
          _delete(
            `${lang}/cms-service/section/${item.id}`,
            null,
            () => {
              setIsProcessing(false);
              handleGetSection();
              toast.success("Delete section success.");
            },
            (error) => {
              setIsProcessing(false);
              toast.error(`Delete section fail. ${error.msg}`);
            },
            WALLET_ADMIN_API
          );
        },
      },
    });
  }

  useEffect(() => {
    handleGetSection();
  }, [lang]);

  return (
    <div className="section-list custom-page">
      <Segment>
        <span className="title">
          <span>Section management</span>
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
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {sections ? (
                sections.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>#{item.id}</Table.Cell>
                    <Table.Cell>{item.index}</Table.Cell>
                    <Table.Cell>
                      <span>{item.name}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="d-fex-cs">
                        <span className="ellipsis">{item.slug}</span>
                      </span>
                    </Table.Cell>
                    <Table.Cell>{item.type}</Table.Cell>
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
                          <span className="tooltip-title">Edit section</span>
                        }
                      >
                        <IconButton onClick={() => hanldeEditSection(item)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          <span className="tooltip-title">Delete section</span>
                        }
                      >
                        <IconButton onClick={() => hanldeDeleteSection(item)}>
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
          data={currentSection}
          onCloseForm={() => {
            setOpenCreateForm(false);
            setCurrentSection(null);
          }}
          onSubmitSuccess={() => {
            handleGetSection();
          }}
        />
      </Drawer>
    </div>
  );
}

export default SectionList;
