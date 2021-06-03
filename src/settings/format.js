module.exports = {
  formatAmount: (str) => {
    str += "";
    const deleteText = str.replace(/[^\d.]/g, ""); //clear text
    const x = deleteText.split(".");
    let x1 = x[0];
    const x2 = x[1];
    const x3 = x.length > 1 ? "." + x2.slice(0, 8) : "";
    if (!x1) x1 = "0";
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1,$2");
    }
    let result = (x1 + x3).replace(/^0+(?!\.|$)/, "").replace(/^\./, "");
    return result;
  },
  formatAmountInput: (str) => {
    str += "";
    const deleteText = str.replace(/[^\d.]/g, ""); //clear text
    const x = deleteText.split(".");
    let x1 = x[0];
    const x2 = x[1];
    const x3 = x.length > 1 ? "." + x2.slice(0, 8) : "";
    if (!x1) x1 = "0";
    let result = (x1 + x3).replace(/^0+(?!\.|$)/, "").replace(/^\./, "");
    return result;
  },
  formatMoney: (str) => {
    str += "";
    const deleteText = str.replace(/[^\d.]/g, ""); //clear text
    const x = deleteText.split(".");
    let x1 = x[0];
    const x2 = x[1];
    const x3 = x.length > 1 ? "." + x2.slice(0, 2) : "";
    if (!x1) x1 = "0";
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1,$2");
    }
    let result = (x1 + x3).replace(/^0+(?!\.|$)/, "").replace(/^\./, "");
    return result;
  },
  deleteText: (str) => {
    str += "";
    const deleteText = str.replace(/[^\d.]/g, ""); //clear text
    return deleteText;
  },
  formatDate: (time) => {
    const temp = new Date(time);
    var dateString =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + temp.getDate()).slice(-2);
    return dateString;
  },
  formatTime: (time) => {
    const temp = new Date(time);
    var dateString =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + temp.getDate()).slice(-2) +
      " " +
      ("0" + temp.getHours()).slice(-2) +
      ":" +
      ("0" + temp.getMinutes()).slice(-2) +
      ":" +
      ("0" + temp.getSeconds()).slice(-2);
    return dateString;
  },

};

