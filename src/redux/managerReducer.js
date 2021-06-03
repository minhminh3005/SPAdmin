import {
  FETCH_COIN_LIST,
  FETCH_FUND_STATISTIC,
  FETCH_KYC,
  FETCH_PENDING_WITHDRAWS,
  FETCH_STAKING_PRODUCTS,
  FETCH_IDPRODUCT,
} from "../settings/constants";

const initialState = {
  coinList: null,
  fundStatistic: null,
  stakingProducts: null,
  withdraws: null,
  KYC: null,
  idProductList: null,
};

export const ManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_KYC:
      return { ...state, KYC: action.payload };
    case FETCH_PENDING_WITHDRAWS:
      return { ...state, withdraws: action.payload };
    case FETCH_STAKING_PRODUCTS:
      return { ...state, stakingProducts: action.payload };
    case FETCH_FUND_STATISTIC:
      return { ...state, fundStatistic: action.payload };
    case FETCH_COIN_LIST:
      return { ...state, coinList: action.payload };
    case FETCH_IDPRODUCT:
      return { ...state, idProductList: action.payload };
    default:
      return { ...state };
  }
};
