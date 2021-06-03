import { logout } from "../utils/auth";
import { API } from "../settings";
import { getAccessToken } from "./auth";
import { toast } from "react-toastify";
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const imageURL = "https://s3.spexchange.io";

export function get(endpoint, successCallback, errorCallback, api) {
  myFetch("GET", endpoint, undefined, successCallback, errorCallback, api);
}

export function post(endpoint, body, successCallback, errorCallback, api) {
  myFetch("POST", endpoint, body, successCallback, errorCallback, api);
}

export function put(endpoint, body, successCallback, errorCallback, api) {
  myFetch("PUT", endpoint, body, successCallback, errorCallback, api);
}

export function _delete(endpoint, body, successCallback, errorCallback, api) {
  myFetch("DELETE", endpoint, body, successCallback, errorCallback, api);
}

export const alertError = (error) => {
  toast.error(error.code + (error.msg ? ": " + error.msg : ""));
};

function myFetch(method, endpoint, body, successCallback, errorCallback, api) {
  let url = (api ? api : API) + endpoint;

  body = JSON.stringify(body);

  let headers = defaultHeaders;
  // console.log(getAccessToken())
  headers["Authorization"] = "bearer " + getAccessToken();

  let response = null;

  if (body === undefined)
    response = fetch(url, {
      method: method,
      headers: headers,
    });
  else {
    response = fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
  }
  handleResponse(response, successCallback, errorCallback);
}

const handleResponse = (response, successCallback, errorCallback) => {
  response.then((r) => {
    if (r.status == 200) {
      if (successCallback) {
        r.json().then((result) => {
          if (result.success) {
            successCallback(result.data);
          } else {
            if (errorCallback) {
              errorCallback(result.error);
            } else {
              alertError(result.error);
            }
          }
        });
      }
    } else if (r.status == 404) {
      if (errorCallback) errorCallback({ msg: "" });
    } else if (r.status == 403) {
      throwError(null, "Forbidden");
    } else if (r.status == 401) {
      throwError(null, "Unauthorized");
      logout();
    } else if (r.status == 500) {
      throwError(null, "Internal server error");
    } else if (r.status == 502) {
      throwError(null, "Service unavailable");
    } else if (r.status == 526) {
      throwError(null, "Please connect to VPN");
    } else {
      throwError(null, "Undefined");
    }
  });
};

const throwError = (errorCallback, message) => {
  if (errorCallback) errorCallback(message);
  else showError(message);
};

const showError = (message) => {
  toast.error("ERR: " + message);
};
