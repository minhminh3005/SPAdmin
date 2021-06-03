import React, { useState } from "react";
import {
  ClickAwayListener,
  Grow,
  Input,
  Paper,
  Popper,
} from "@material-ui/core";
import "../style/scss/Vendors/custom-color-picker.css";
import { ArrowDropDown } from "@material-ui/icons";
import { SketchPicker } from "react-color";

export default function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [textColor, setTextColor] = useState("#fff");

  function handleClose() {
    setOpen(false);
    setAnchorEl(null);
  }
  function handleOpen(e) {
    setOpen(true);
    setAnchorEl(e.currentTarget);
  }
  function handleSelect(color) {
    if (onChange) onChange(color);
    setOpen(false);
    setAnchorEl(null);
    if (color && color.rgb) {
      if (color.rgb.r < 50 && color.rgb.g < 50 && color.rgb.b < 50) {
        setTextColor("#000");
      } else {
        setTextColor("#fff");
      }
    }
  }
  return (
    <div className="custom-color-picker">
      <div
        className="value"
        onClick={(e) => handleOpen(e)}
        style={{ background: value, color: textColor }}
      >
        {value ? value : <span>Select color</span>}
        <ArrowDropDown />
      </div>
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        disablePortal
        style={{ zIndex: 1000000 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <div className="picker">
                  <SketchPicker
                    color={value ? value : "#ffffff"}
                    onChangeComplete={(color) => handleSelect(color)}
                  />
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
