import { useEffect } from "react";
import { Container, Grid, Segment } from "semantic-ui-react";
import { checkFeature, checkScope } from "../../settings";
import { get } from "../../utils/api";
import FundStatistic from "./FundStatistic";
import ReferralStatistic from "./ReferralStatistic";
import StakingStatistic from "./StakingStatistic";
import StartupStatistic from "./StartupStatistic";
import SwapStatistic from "./SwapStatistic";
import UserStatistic from "./UserStatistic";

function Dashboard() {
  return (
    <>
      <UserStatistic />
      <ReferralStatistic />
      <br/>
      <br/>
      {checkScope(["ADMIN_FULL"]) && (
        <>
          <FundStatistic />
          <br/>
          <br/>
          {checkFeature("SWAP") && <SwapStatistic />}
          {/* {checkFeature("STAKING") && <StakingStatistic />} */}
          <br/>
          <br/>
          {checkFeature("STARTUP") && <StartupStatistic />}
        </>
      )}
    </>
  );
}

export default Dashboard;
