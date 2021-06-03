import {
  FETCH_COIN_LIST,
  FETCH_FUND_STATISTIC,
  FETCH_KYC,
  FETCH_PENDING_WITHDRAWS,
  FETCH_STAKING_PRODUCTS,
  FETCH_IDPRODUCT,
} from "../settings/constants";
import { ENDPOINT_KYC_LIST } from "../settings/links";
import { get, post } from "../utils/api";

export const _getFundStatistic = () => (dispatch) => {
  get(`/fund-service/fund/statistic`, (data) => {
    dispatch({ type: FETCH_FUND_STATISTIC, payload: data });
  });
};

export const _getCoinList = () => (dispatch) => {
  post(`/fund-service/coin/list`, { pageSize: 1000 }, (data) =>
    dispatch({ type: FETCH_COIN_LIST, payload: data })
  );
};

export const _getStakingProducts = () => (dispatch) => {
  post(`/staking-service/product/list`, {}, (data) =>
    dispatch({ type: FETCH_STAKING_PRODUCTS, payload: data })
  );
};

export const _getWithdraws = ({ page = 1, pageSize = 10, filters = {} }) => (
  dispatch
) => {
  post(`/fund-service/withdraw/list`, { page, pageSize, filters }, (data) =>
    dispatch({ type: FETCH_PENDING_WITHDRAWS, payload: data })
  );
};

export const _getKYC = ({ page = 1, pageSize = 10, filters = {} }) => (
  dispatch
) => {
  post(ENDPOINT_KYC_LIST, { page, pageSize, filters }, (data) =>
    dispatch({ type: FETCH_KYC, payload: data })
  );
};

export const _getIdProduct = (value) => (dispatch) => {
  dispatch({ type: FETCH_IDPRODUCT, payload: value });
};
