import { CHANGE_LANGUAGE } from "../redux/constant";

export const HandleChangeLanguage = (lang) => (dispatch) => {
  dispatch({ type: CHANGE_LANGUAGE, payload: lang });
};
