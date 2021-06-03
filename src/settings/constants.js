export const ErrorCode = {
  EMAIL_OTP_REQUIRED: "EMAIL_OTP_REQUIRED",
  GACODE_REQUIRED: "GACODE_REQUIRED",
};

export const EXTERNAL = "EXTERNAL";
export const INTERNAL = "INTERNAL";
export const FETCH_COIN_LIST = "FETCH_COIN_LIST";
export const FETCH_FUND_STATISTIC = "FETCH_FUND_STATISTIC";
export const FETCH_STAKING_PRODUCTS = "FETCH_STAKING_PRODUCTS";
export const FETCH_PENDING_WITHDRAWS = "FETCH_PENDING_WITHDRAWS";
export const FETCH_KYC = "FETCH_KYC";
export const FETCH_IDPRODUCT = "FETCH_IDPRODUCT";
export const LANGUAGE_SELECTED = "LANGUAGE_SELECTED";

export const SectionType = {
  FAQ: {
    key: "FAQ",
    value: "FAQ",
    text: "FAQ",
  },
  NOTIFICATION: {
    key: "NOTIFICATION",
    value: "NOTIFICATION",
    text: "NOTIFICATION",
  },
};

export const UserRoles = [
  { key: "MARKET_MAKER", value: "MARKET_MAKER", text: "MARKET_MAKER" },
];

export const PriceTypes = [
  { key: "FIXED_PRICE", value: "FIXED_PRICE", text: "FIXED_PRICE" },
  { key: "BINANCE", value: "BINANCE", text: "BINANCE" },
  { key: "SPEXCHANGE", value: "SPEXCHANGE", text: "SPEXCHANGE" },
];

export const STARTUP_TYPE = [
  { key: "EASYBUY", value: "EASYBUY", text: "EASYBUY" },
  { key: "IEO", value: "IEO", text: "IEO" },
  { key: "SPECIAL", value: "SPECIAL", text: "SPECIAL" },
];

export const SELL_MODE = [
  { key: "DIRECTLY", value: "DIRECTLY", text: "DIRECTLY" },
  { key: "BID", value: "BID", text: "BID" },
];

export const TRADE_TYPE = [
  { key: "MAJOR", value: "MAJOR", text: "MAJOR" },
  { key: "GENERAL", value: "GENERAL", text: "GENERAL" },
  { key: "DEFI", value: "DEFI", text: "DEFI" },
  { key: "NFT", value: "NFT", text: "NFT" },
];
export const SUPPORTED_RESOLUTIONS = [
  { key: "1", value: "1", text: "1" },
  { key: "5", value: "5", text: "5" },
  { key: "15", value: "15", text: "15" },
  { key: "30", value: "30", text: "30" },
  { key: "60", value: "60", text: "60" },
  { key: "120", value: "120", text: "120" },
  { key: "240", value: "240", text: "240" },
  { key: "D", value: "D", text: "D" },
  { key: "W", value: "W", text: "W" },
  { key: "M", value: "M", text: "M" },
];
export const MARKET_TAG = [
  { key: "NEW", value: "NEW", text: "New" },
  { key: "UPCOMING", value: "UPCOMING", text: "Upcoming" },
  { key: "HOT", value: "HOT", text: "Hot" },
];
export const IS_SHARE = [
  { key: "NOT_SHARE", value: "NOT_SHARE", text: "NOT_SHARE" },
  { key: "BINANCE", value: "BINANCE", text: "BINANCE" },
];

export const StatusCode = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  EXTERNAL: "EXTERNAL",
  INTERNAL: "INTERNAL",
  ADMIN: "ADMIN",
  NEW: "NEW",
  ACTIVE: "ACTIVE",
  BLOCK: "BLOCK",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  WAITING_CONFIRM: "WAITING_CONFIRM",
  APPROVED: "APPROVED",
  CONFIRMING: "CONFIRMING",
  CANCELED: "CANCELED",
  FAILED: "FAILED",
  BLOCKED: "BLOCKED",
  CLOSED: "CLOSED",
  OPEN: "OPEN",
};
