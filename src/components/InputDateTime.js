import React from "react";
import { Input } from "@material-ui/core";
import MaskedInput from "react-text-mask";

export default function InputDateTime({
  onChange,
  placeholder,
  id,
  defaultValue,
  required
}) {
  return (
    <Input
      placeholder={placeholder ? placeholder : ""}
      name="textmask"
      id={id ? id : ""}
      inputComponent={TextMaskCustom}
      className="custom-input date ui fluid input"
      onChange={(value) => (onChange ? onChange(value.target.value) : "")}
      defaultValue={defaultValue ? defaultValue : ""}
      required={required ? required : ''}
    />
  );
}

var mask = function (rawValue) {
  // add logic to generate your mask array
  // const dayRegex = /[0-3]/;
  // const dayRegex1 = rawValue.substr(0, 1) === "3" ? /[0-1]/ : /[0-9]/;
  // const monthRegex = /[0-1]/;
  // const monthRegex1 = rawValue.substr(3, 1) === "1" ? /[0-2]/ : /[0-9]/;
  const dayRegex = /[0-3]/;
  const dayRegex1 = rawValue.substr(8, 1) === "3" ? /[0-1]/ : /[0-9]/;
  const monthRegex = /[0-1]/;
  const monthRegex1 = rawValue.substr(5, 1) === "1" ? /[0-2]/ : /[0-9]/;

  const hourRegex = /[0-2]/;
  const hourRegex1 = rawValue.substr(11, 1) === "2" ? /[0-3]/ : /[0-9]/;
  const minuteRegex = /[0-6]/;
  const minuteRegex1 = rawValue.substr(14, 1) === "6" ? /[0]/ : /[0-9]/;
  // return [
  //   dayRegex,
  //   dayRegex1,
  //   "/",
  //   monthRegex,
  //   monthRegex1,
  //   "/",
  //   /[1-9]/,
  //   /\d/,
  //   /\d/,
  //   /\d/,
  // ];
  return [
    /[1-9]/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    monthRegex,
    monthRegex1,
    "-",
    dayRegex,
    dayRegex1,
    " ",
    hourRegex,
    hourRegex1,
    ":",
    minuteRegex,
    minuteRegex1,
  ];
};

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      // onCh
      mask={mask}
      placeholderChar={"_"}
      showMask={false}
      keepCharPositions={true}
    />
  );
}
