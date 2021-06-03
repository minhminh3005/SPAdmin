import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import BannerList from "./banner/List";
import PostEditor from "./post/Editor";
import LanguageBar from "../LanguageBar";
import SectionList from "./section/List";
import Notification from "./notification/List";
import FAQ from "./FAQ/List";
import FAQForm from "./FAQ/Form";

export default function CMS() {
  const dispatch = useDispatch();

  return (
    <Segment vertical basic>
      <LanguageBar />
      <Switch>
        {/* ==============================Banner============================ */}
        <Route path="/cms/banner" component={BannerList} />

        {/* ==============================Section============================ */}
        <Route path="/cms/section" component={SectionList} />

        {/* ==============================Notification============================ */}
        <Route path="/cms/notification" component={Notification} />

        {/* ==============================FAQ============================ */}
        <Route path="/cms/faq/create" component={FAQForm} />
        <Route path="/cms/faq/update/:id" component={FAQForm} />
        <Route path="/cms/faq" component={FAQ} />

        {/* ==============================Post============================ */}
        <Route path="/cms/post/editor" component={PostEditor} />
      </Switch>
    </Segment>
  );
}
