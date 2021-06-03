import { toast } from "react-toastify";
import { Header } from "semantic-ui-react";
import React from "react";

export const objToUrlParams = (obj) => {
  var str = "";
  for (var key in obj) {
    if (str != "") {
      str += "&";
    }
    if (!Array.isArray(obj[key])) {
      str += key + "=" + encodeURIComponent(obj[key]);
    } else {
      for (let i = 0; i < obj[key].length; i++) {
        const element = obj[key][i];
        if (i > 0) {
          str += "&";
        }
        str += key + "=" + encodeURIComponent(element);
      }
    }
  }

  return `?${str}`;
};

export const objFromUrlParams = (search) => {
  if (!search) return {};

  search = search.replace("?", "");

  return JSON.parse(
    '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
};
export const objToArray = (obj) => {
  var keys = Object.keys(obj);
  var arr = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    arr.push(obj[key]);
  }
  return arr;
};

export const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  toast("Copied", 300);
  document.body.removeChild(el);
};

export const round = (value, fix) => {
  if (isNaN(value)) return "";

  value = parseFloat(value);

  var valueAsString = value + "";
  var prefix =
    valueAsString.indexOf(".") >= 0
      ? valueAsString.split(".")[0].length + 1
      : valueAsString.length;

  return parseFloat((value + "").substring(0, fix + prefix));
};

export const getDecimal = (value, byPrice) => {
  value = Math.abs(value);
  var valueAsString = value + "";
  if (valueAsString.indexOf("e") >= 0) {
    return 8;
  } else {
    if (byPrice) {
      if (byPrice > 10000) return 5;
      if (byPrice > 1000) return 4;
      if (byPrice > 100) return 3;
      return 2;
    } else {
      if (value > 1000) return 2;
      if (value > 1) return 4;
      if (value > 0.1) return 5;
      if (value > 0.01) return 6;
      if (value > 0.001) return 7;
      return 8;
    }
  }
};

export const formatCurrency = (value, fix, isRoundDown, byPrice) => {
  if (!value || value === 0 || Math.abs(value) < 0.000000001) return "0.00";
  var decimal = fix ? fix : getDecimal(value, byPrice);

  if (isRoundDown) {
    value = round(value, decimal);
  } else value = round(value, decimal + 1);
  var result = value.toFixed(decimal).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return result;
};

export function convertToInternationalCurrencySystem(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
      // : Math.abs(Number(labelValue)) >= 1.0e+3

      // ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

      Math.abs(Number(labelValue));
}

export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

export function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();
  str = removeVietnameseTones(str);

  var from = "·/-,:;";
  var to = "______";

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");

  return str;
}
