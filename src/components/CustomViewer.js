import { IconButton, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dimmer, Header, Segment } from "semantic-ui-react";
import { SHOW_VIEWER, CLOSE_VIEWER } from "../redux/constant";

function CustomViewer() {
  const { setting } = useSelector((state) => state);
  const { showViewer, viewerData } = setting;
  const dispatch = useDispatch();

  const _onClose = () => dispatch({ type: CLOSE_VIEWER });

  return (
    <Modal open={showViewer} className="custom-viewer">
      <div className="content-viewer">
        <IconButton onClick={() => _onClose()}>
          <Close />
        </IconButton>
        <img src={viewerData ? viewerData.imageUrl : ""} />
      </div>
    </Modal>
  );
}

export default CustomViewer;
