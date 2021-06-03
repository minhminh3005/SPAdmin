import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "./style/css";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import UserList from "./components/user/UserList";
import UserOpenOrder from "./components/user/UserOpenOrder";
import UserOderHistory from "./components/user/UserOrderHistory";
import { isLoggedIn } from "./utils/auth";
import CustomMenu from "./components/CustomMenu";
import { Grid, Segment } from "semantic-ui-react";
import VerifyList from "./components/user/VerifyList";
import SwapList from "./components/swap/SwapList";
import SwapProduct from "./components/swap/SwapProduct";
import CreateProduct from "./components/swap/CreateProduct";
import SwapMarket from "./components/swap/SwapMarket";
import CreateSwapMarket from "./components/swap/CreateSwapMarket";
import StakingList from "./components/staking/StakingList";
import ReedemLists from "./components/staking/ReedemLists";
import StakingProduct from "./components/staking/StakingProduct";
import OverviewStaking from "./components/staking/OverviewStaking";
import CreateStakingProduct from "./components/staking/CreateStakingProduct";
import CoinList from "./components/coin/CoinList";
import CreateCoin from "./components/coin/CreateCoin";
import DepositList from "./components/deposit/DepositList";
import WithdrawList from "./components/withdraw/WithdrawList";
import UserDetail from "./components/user/UserDetail";
import UserVerification from "./components/user/UserVerification";
import CoinStatistic from "./components/coin/CoinStatistic";
import ChangePassword from "./components/setting/ChangePassword";
import ListRole from "./components/role/ListRole";
import AdminList from "./components/admin/AdminList";
import PendingWithdraws from "./components/withdraw/PendingWithdraws";
import CreateAdmin from "./components/admin/CreateAdmin";
import CreateRole from "./components/role/CreateRole";
import GA from "./components/setting/GA";
import { useDispatch } from "react-redux";
import CustomPopup from "./components/CustomPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserVerificationDetail from "./components/user/UserVerificationDetail";
import ApproveWithdraws from "./components/withdraw/ApproveWithdraws";
import {
  _getCoinList,
  _getFundStatistic,
  _getKYC,
  _getWithdraws,
  _getStakingProducts,
} from "./actions/managerActions";
import StartupList from "./components/startup/StartupList";
import StartupProducts from "./components/startup/StartupProducts";
import CreateStartupProduct from "./components/startup/CreateStartupProduct";
import StatusBar from "./components/others/StatusBar";
import UserOverview from "./components/overview/UserOverview";
import FundOverview from "./components/overview/FundOverview";
import SwapOverview from "./components/overview/SwapOverview";
import StakingOverview from "./components/overview/StakingOverview";
import StartupOverview from "./components/overview/StartupOverview";
import Command from "./components/overview/Command";
import { checkFeature, checkScope } from "./settings";
import AddressVerifications from "./components/user/AddressVerifications";
import Markets from "./components/trade/Markets";
import CreateMarket from "./components/trade/CreateMarket";
import UserAirdrop from "./components/user/UserAirdrop";
import TradeOverview from "./components/trade/TradeOverview";
import CoinTransaction from "./components/coin/CoinTransaction";
import BotVolumeForm from "./components/bot/BotVolumeForm";
import BotVolumeList from "./components/bot/BotVolumeList";
import AddBotVolume from "./components/bot/AddBotVolume";
import PostEditor from "./components/cms/post/Editor";
import BannerForm from "./components/cms/banner/Form";
import BannerList from "./components/cms/banner/List";
import LanguageBar from "./components/LanguageBar";
import CMS from "./components/cms";
import CustomViewer from "./components/CustomViewer";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(_getFundStatistic());
      dispatch(_getCoinList());
      if (checkFeature("STAKING")) dispatch(_getStakingProducts());
      dispatch(_getWithdraws({ filters: { status: "PENDING" } }));
      dispatch(_getKYC({ filters: { status: "PENDING" } }));
    }
  }, [dispatch]);

  return isLoggedIn() ? (
    <Router>
      <StatusBar />
      <div className="App">
        <CustomMenu />
        <div className="content">
          <Segment vertical basic>
            <Switch>
              {/*=========================OVERVIEW==========================  */}
              <Route path="/overview/startup" component={StartupOverview} />
              <Route path="/overview/staking" component={StakingOverview} />
              <Route path="/overview/swap" component={SwapOverview} />
              <Route path="/overview/user" component={UserOverview} />
              <Route path="/overview/fund" component={FundOverview} />z
              {/* ==========================USER============================= */}
              <Route path="/user/verifications">
                {" "}
                <VerifyList />{" "}
              </Route>
              <Route
                path="/user/address-verifications"
                component={AddressVerifications}
              />
              <Route path="/user/list">
                <UserList />
              </Route>
              <Route
                path="/user/verification-detail/:id"
                component={UserVerificationDetail}
              />
              <Route
                path="/user/verifications/:id"
                component={UserVerification}
              />
              <Route path="/user-detail/:id" component={UserDetail} />
              <Route path="/user/airdrop" component={UserAirdrop} />
              <Route path="/overview/command" component={Command} />
              {/* ==========================FUND============================ */}
              <Route path="/coin/detail/:name" component={CoinStatistic} />
              <Route path="/coin/list" component={CoinList} />
              <Route path="/coin/create" component={CreateCoin} />
              <Route path="/coin/transaction" component={CoinTransaction} />
              <Route path="/deposit/list" component={DepositList} />
              <Route path="/withdraw/list" component={WithdrawList} />
              <Route path="/withdraw/pending" component={PendingWithdraws} />
              <Route path="/withdraw/approve" component={ApproveWithdraws} />
              {/* ===========================TRADE============================= */}
              <Route path="/trade/create-market" component={CreateMarket} />
              <Route path="/trade/overview" component={TradeOverview} />
              <Route path="/trade/markets" component={Markets} />
              <Route path="/user/openorder">
                {" "}
                <UserOpenOrder />{" "}
              </Route>
              <Route path="/user/orderhistory">
                <UserOderHistory />
              </Route>
              {/* =============================SWAP============================= */}
              <Route path="/user/openorder">
                {" "}
                <UserOpenOrder />{" "}
              </Route>
              <Route path="/user/orderhistory">
                <UserOderHistory />
              </Route>
              {/* =============================SWAP============================= */}
              <Route path="/swap/list">
                {" "}
                <SwapList />{" "}
              </Route>
              <Route path="/swap/product" component={SwapProduct} />
              <Route path="/swap/market" component={SwapMarket} />
              <Route path="/swap/create-product" component={CreateProduct} />
              <Route path="/swap/create-market" component={CreateSwapMarket} />
              {/* =================================STAKING========================= */}
              <Route path="/staking/transaction" component={StakingList} />
              <Route path="/staking/reedems" component={ReedemLists} />
              <Route path="/staking/product" component={StakingProduct} />
              <Route
                path="/staking/create-product"
                component={CreateStakingProduct}
              />
              {/* ================================STARTUP============================== */}
              <Route
                path="/startup/create-product"
                component={CreateStartupProduct}
              />
              <Route path="/startup/products" component={StartupProducts} />
              <Route path="/startup/list" component={StartupList} />
              <Route path="/bot/volume-bot-form" component={BotVolumeForm} />
              <Route path="/bot/volume-bot-list" component={BotVolumeList} />
              <Route path="/bot/add-volume-bot" component={AddBotVolume} />
              {/* ==============================SYSTEM SETTING============================ */}
              <Route path="/role/create" component={CreateRole} />
              <Route path="/admin/create" component={CreateAdmin} />
              <Route path="/admin/list" component={AdminList} />
              <Route path="/change-password" component={ChangePassword} />
              <Route path="/setting/ga" component={GA} />
              <Route path="/role/list" component={ListRole} />
              {/* ==============================CMS============================ */}
              <Route path="/cms/*" component={CMS} />
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </Segment>
        </div>
      </div>
      <ToastContainer />
      <CustomPopup />
      <CustomViewer />
    </Router>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}
