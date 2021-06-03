import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dimmer, Header, Segment } from "semantic-ui-react";
import { CLOSE_POPUP } from "../redux/constant";

function CustomPopup() {
  const { setting } = useSelector((state) => state);
  const { isShowPopup, popupData } = setting;
  const dispatch = useDispatch();

  const _onClose = () => dispatch({ type: CLOSE_POPUP });
  const _onSubmit = () => {
    popupData.callback();
    dispatch({ type: CLOSE_POPUP });
  };

  return (
    <Dimmer page active={isShowPopup}>
      <Segment style={{ width: 350, color: "#000" }} textAlign="left">
        <Segment vertical>
          <Header>Notification</Header>
        </Segment>
        <Segment vertical textAlign="left">
          {popupData && popupData.content}
        </Segment>
        <Segment vertical textAlign="right">
          <Button negative onClick={_onClose}>
            Cancel
          </Button>
          <Button positive onClick={_onSubmit}>
            Yes, I sure
          </Button>
        </Segment>
      </Segment>
    </Dimmer>
  );
}

export default CustomPopup;
