import { combineReducers } from "redux";
import { ManagerReducer } from "./managerReducer";
import { SettingReducer } from "./settingReducer";

const rootReducer = combineReducers({
  setting: SettingReducer,
  manager: ManagerReducer,
});

export default rootReducer;
