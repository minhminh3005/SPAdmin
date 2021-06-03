import {
  CLOSE_POPUP,
  SHOW_POPUP,
  CHANGE_LANGUAGE,
  SHOW_VIEWER,
  CLOSE_VIEWER,
} from "./constant";

const initialState = {
  isShowPopup: false,
  popupData: null,
  lang: "us",
  showViewer: false,
  viewerData: null,
};

export const SettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POPUP:
      return { ...state, isShowPopup: true, popupData: action.payload };
    case CLOSE_POPUP:
      return { ...state, isShowPopup: false, popupData: null };
    case CHANGE_LANGUAGE:
      return { ...state, lang: action.payload };
    case SHOW_VIEWER:
      return { ...state, showViewer: true, viewerData: action.payload };
    case CLOSE_VIEWER:
      return { ...state, showViewer: false, viewerData: null };
    default:
      return { ...state };
  }
};
