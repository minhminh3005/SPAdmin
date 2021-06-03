import {
  ClickAwayListener,
  Drawer,
  Grow,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@material-ui/core";
import {
  BurstMode,
  Check,
  Close,
  Delete,
  Edit,
  ImageSearch,
  MoreVert,
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
  List,
  ListItem,
  Loader,
  MenuItem,
  Segment,
  Table,
} from "semantic-ui-react";
import { SHOW_POPUP, SHOW_VIEWER } from "../../../redux/constant";
import { WALLET_ADMIN_API } from "../../../settings";
import { post, put, _delete } from "../../../utils/api";
import BannerForm from "./Form";
import "./style.css";

function BannerList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { lang } = setting;
  const [banners, setBanners] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  function handleGetBanner() {
    let param = {
      page: 1,
      pageSize: 200,
      search: "",
      orderBy: "index",
    };
    setIsProcessing(true);
    post(
      `${lang}/cms-service/banner/list`,
      param,
      (result) => {
        setBanners(result.items);
        setIsProcessing(false);
      },
      () => {
        setIsProcessing(false);
      },
      WALLET_ADMIN_API
    );
  }

  function handleViewImage(imageUrl) {
    dispatch({
      type: SHOW_VIEWER,
      payload: {
        imageUrl: imageUrl,
      },
    });
  }

  function handleEditBanner(item) {
    setOpenCreateForm(true);
    setCurrentBanner(item);
  }

  function handleDeleteBanner(item) {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: "Delete banner?",
        callback: () => {
          setIsProcessing(true);
          _delete(
            `${lang}/cms-service/banner/${item.id}`,
            null,
            () => {
              setIsProcessing(false);
              handleGetBanner();
            },
            () => {
              setIsProcessing(false);
            },
            WALLET_ADMIN_API
          );
        },
      },
    });
  }

  function handleSwap(item1, item2) {
    setAnchorEl(null);
    if (!item1 || !item2) return;
    setIsProcessing(true);
    put(
      `${lang}/cms-service/swap-index-banner`,
      {
        ids: [item1.id, item2.id],
      },
      () => {
        handleGetBanner();
        setIsProcessing(false);
        toast.success("Swap banner success.");
      },
      (error) => {
        setIsProcessing(false);
        toast.error(`Swap banner fail. ${error.msg}`);
      },
      WALLET_ADMIN_API
    );
  }
  function handleOpenMenu(e, index) {
    setAnchorEl(e.currentTarget);
    setCurrentIndex(index);
  }
  function handleCloseMenu() {
    setAnchorEl(null);
  }

  useEffect(() => {
    handleGetBanner();
  }, [lang]);

  return (
    <div className="banner-list custom-page">
      <Segment>
        <span className="title">
          <span>Banner management</span>
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
          <Table singleLine>
            <Table.Header>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Index</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Redirect</Table.HeaderCell>
              <Table.HeaderCell>Highlight</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {banners ? (
                banners.map((item, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>#{item.id}</Table.Cell>
                    <Table.Cell>{item.index}</Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        title={
                          <span className="tooltip-title">{item.name}</span>
                        }
                      >
                        <span className="ellipsis">{item.name}</span>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="d-fex-cs">
                        <img
                          src={item.imageUrl}
                          style={{ height: 40, cursor: "pointer" }}
                          onClick={() => handleViewImage(item.imageUrl)}
                        />
                      </span>
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
                        {item.highlight ? (
                          <Check className="green" />
                        ) : (
                          <Close className="red" />
                        )}
                      </span>
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
                        <IconButton onClick={() => handleDeleteBanner(item)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {/* <IconButton onClick={(e) => handleOpenMenu(e, i)}>
                        <MoreVert />
                      </IconButton> */}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row></Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        {banners ? (
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {currentIndex > 0 ? (
              <MenuItem
                onClick={() =>
                  handleSwap(banners[currentIndex - 1], banners[currentIndex])
                }
              >
                <VerticalAlignTop /> Bring top
              </MenuItem>
            ) : (
              ""
            )}
            {currentIndex < banners.length - 1 ? (
              <MenuItem
                onClick={() =>
                  handleSwap(banners[currentIndex + 1], banners[currentIndex])
                }
              >
                <VerticalAlignBottom /> Bring bottom
              </MenuItem>
            ) : (
              ""
            )}
          </Menu>
        ) : (
          ""
        )}
      </Segment>
      <Drawer open={openCreateForm} anchor="right">
        <BannerForm
          data={currentBanner}
          onCloseForm={() => {
            setOpenCreateForm(false);
            setCurrentBanner(null);
          }}
          onSubmitSuccess={() => {
            handleGetBanner();
          }}
        />
      </Drawer>
    </div>
  );
}

export default BannerList;
