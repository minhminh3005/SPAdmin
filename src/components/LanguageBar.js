import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Flag } from "semantic-ui-react";
import { HandleChangeLanguage } from "../actions/settingActions";
import { CHANGE_LANGUAGE } from "../redux/constant";
import { LANGUAGE_SELECTED } from "../settings/constants";
import { objToArray } from "../utils/util";

const LanguageOptions = {
  us: {
    countrycode: "us",
    langCode: "us",
    label: "English",
  },
  vi: {
    countrycode: "vn",
    langCode: "vi",
    label: "Việt Nam",
  },
};

function LanguageBar() {
  const { setting } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { lang } = setting;
  const [languageSelected, setLanguageSelected] = useState(LanguageOptions.us);

  function handleSelectLang(lang) {
    dispatch(HandleChangeLanguage(lang.langCode));
    window.localStorage.setItem(LANGUAGE_SELECTED, lang.langCode);
  }

  useEffect(() => {
    const localLang = window.localStorage.getItem(LANGUAGE_SELECTED);
    if (localLang) {
      handleSelectLang(LanguageOptions[localLang]);
    }
  }, []);

  useEffect(() => {
    setLanguageSelected(LanguageOptions[lang]);
  }, [lang]);

  return languageSelected ? (
    <Dropdown
      className="language-bar"
      text={
        <span>
          <Flag name={languageSelected.countrycode} />
          <span>{languageSelected.label}</span>
        </span>
      }
    >
      <Dropdown.Menu>
        {objToArray(LanguageOptions).map((item, i) => (
          <Dropdown.Item
            key={i}
            icon={<Flag name={item.countrycode} />}
            text={item.label}
            onClick={() => handleSelectLang(item)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    ""
  );
}

export default LanguageBar;
