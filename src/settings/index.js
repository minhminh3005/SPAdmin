import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon } from "semantic-ui-react";

export const USER_API = "https://spwalletapi.spdev.co";

const Local = {
  API: "https://spexchangegererapi.spdev.co",
  WALLET_ADMIN: "https://spwalletgerer.spdev.co/",
  WALLET_ADMIN_API: "https://spwalletgererapi.spdev.co/",
};
const Productions = {
  API: "/api",
  WALLET_ADMIN: "https://gerer.spwallet.org/",
  WALLET_ADMIN_API: "https://gerer.spwallet.org/api",
};
const isProduction =
  window.location.hostname.indexOf("gerer.spexchange.io") >= 0;

// export const API = "/api";
// export const WALLET_ADMIN = "https://gerer.spwallet.org/";

export const API = isProduction ? Productions.API : Local.API;
export const WALLET_ADMIN = isProduction
  ? Productions.WALLET_ADMIN
  : Local.WALLET_ADMIN;

export const WALLET_ADMIN_API = isProduction
  ? Productions.WALLET_ADMIN_API
  : Local.WALLET_ADMIN_API;

export const ACCESS_TOKEN_KEY = "CBt3gpbqeMdWPNG1";
export const DEVICE_KEY = "uU5tEUmAgvBWArsv";
export const SCOPES_KEY = "AhBcmvr1EkMdPnL5";

export function checkScope(array) {
  if (array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const scopes = window.localStorage.getItem("SCOPES");
      if (scopes) {
        if (scopes.split(",").includes(element)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getLinkProfile(id, email) {
  return <Link to={`/user-detail/${id}`}>{email}</Link>;
}

export function formatAddress(string) {
  if (string)
    return (
      <div>
        {string.slice(0, 10) + "..." + string.slice(string.length - 10)}
        <Icon
          className="copy teal disabled"
          onClick={() => {
            toast.success("Copied");
            navigator.clipboard.writeText(string);
          }}
          style={{
            cursor: "pointer",
            fontSize: "1em",
            marginLeft: 5,
            zIndex: 1001,
          }}
        />
      </div>
    );
  else return null;
}

export function getLinkHash(data) {
  if (data) {
    const { type, network, txId } = data;
    if (txId) {
      if (type === "EXTERNAL") {
        let address = null;
        if (network === "TRC20") {
          address = `https://tronscan.org/#/transaction/${txId}`;
        }
        if (network === "ERC20" || network === "ETH") {
          address = `https://etherscan.io/tx/${txId}`;
        }
        if (network === "BTC") {
          address = `https://www.blockchain.com/btc/tx/${txId}`;
        }
        return (
          <>
            <a href={address} target="_blank" rel="noreferrer">
              {data.txId.slice(0, 10) +
                "..." +
                data.txId.slice(data.txId.length - 10)}
            </a>
            <Icon
              name="copy outline"
              onClick={() => {
                toast.success("Copied");
                navigator.clipboard.writeText(txId);
              }}
              style={{
                cursor: "pointer",
                fontSize: "1.2em",
                marginLeft: 5,
                zIndex: 1001,
              }}
            />
          </>
        );
      } else {
        return formatAddress(txId);
      }
    } else return null;
  } else {
    return null;
  }
}

export function checkFeature(feature) {
  const list = ["STAKING", "STARTUP", "SWAP"];
  if (list.includes(feature)) return true;
  else return false;
}
