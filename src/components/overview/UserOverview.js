import React from "react";
import ReferralStatistic from "../dashboard/ReferralStatistic";
import UserStatistic from "../dashboard/UserStatistic";

function UserOverview() {
  return (
    <div>
      <UserStatistic />
      <ReferralStatistic />
    </div>
  );
}

export default UserOverview;
