import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { checkFeature, checkScope } from "../settings";
import { get, post } from "../utils/api";
import { logout } from "../utils/auth";
import Collapse from "@material-ui/core/Collapse";

function CustomMenu() {
  const history = useHistory();
  const [activeItem, setActiveItem] = useState(history.location.pathname);
  const location = useLocation();
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const [open3, setOpen3] = React.useState(true);
  const [open4, setOpen4] = React.useState(true);
  const [open5, setOpen5] = React.useState(true);
  const [open6, setOpen6] = React.useState(true);
  const [open7, setOpen7] = React.useState(true);
  const [open8, setOpen8] = React.useState(true);
  const [open9, setOpen9] = React.useState(true);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const _handleItemClick = (e) => {
    setActiveItem(e);
    history.push(e);
  };

  return (
    <Menu vertical className="custom-menu">
      <Menu.Item id="menu_spexchange" style={{ height: "50px" }}>
        <Link to="/">
          <img
            src="/img/spexchange.png"
            alt="spexchange"
            style={{ height: "30px", marginTop: "-5px" }}
          />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header
          // active={activeItem === "overview"}
          onClick={() => setOpen1(!open1)}
        >
          Overview
          {open1 ? (
            <i aria-hidden="true" className="angle up disabled icon"></i>
          ) : (
            <i aria-hidden="true" className="angle down disabled icon"></i>
          )}
        </Menu.Header>
        <Collapse in={open1} timeout="auto" unmountOnExit>
          <Menu.Menu>
            <Menu.Item
              name="User"
              active={activeItem === "/overview/user"}
              onClick={() => _handleItemClick("/overview/user")}
            />
            {checkScope(["ADMIN_FULL"]) && (
              <>
                <Menu.Item
                  name="Fund"
                  active={activeItem === "/overview/fund"}
                  onClick={() => _handleItemClick("/overview/fund")}
                />
                {checkFeature("SWAP") && (
                  <Menu.Item
                    name="Swap"
                    active={activeItem === "/overview/swap"}
                    onClick={() => _handleItemClick("/overview/swap")}
                  />
                )}
                <Menu.Item
                  name="Trade"
                  active={activeItem === "/trade/overview"}
                  onClick={() => _handleItemClick("/trade/overview")}
                />
                {checkFeature("STARTUP") && (
                  <Menu.Item
                    name="Startup"
                    active={activeItem === "/overview/startup"}
                    onClick={() => _handleItemClick("/overview/startup")}
                  />
                )}
              </>
            )}
          </Menu.Menu>
        </Collapse>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header onClick={() => setOpen2(!open2)}>
          User
          {open2 ? (
            <i aria-hidden="true" className="angle up disabled icon"></i>
          ) : (
            <i aria-hidden="true" className="angle down disabled icon"></i>
          )}
        </Menu.Header>
        <Collapse in={open2} timeout="auto" unmountOnExit>
          <Menu.Menu>
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="overview"
                active={activeItem === "/overview/user"}
                onClick={() => _handleItemClick("/overview/user")}
              />
            )}
            {checkScope(["USER_FULL", "USER_READ"]) && (
              <Menu.Item
                name="All users"
                active={activeItem === "/user/list"}
                onClick={() => _handleItemClick("/user/list")}
              />
            )}

            {checkScope(["USER_FULL", "USER_READ", "KYC_FULL"]) && (
              <>
                <Menu.Item
                  name="verifications"
                  active={activeItem === "/user/verifications"}
                  onClick={() => _handleItemClick("/user/verifications")}
                />
                <Menu.Item
                  name="Address Verifications"
                  active={activeItem === "/user/address-verifications"}
                  onClick={() =>
                    _handleItemClick("/user/address-verifications")
                  }
                />
                <Menu.Item
                  name="Command"
                  active={activeItem === "/overview/command"}
                  onClick={() => _handleItemClick("/overview/command")}
                />
              </>
            )}
          </Menu.Menu>
        </Collapse>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header onClick={() => setOpen3(!open3)}>
          Fund
          {open3 ? (
            <i aria-hidden="true" className="angle up disabled icon"></i>
          ) : (
            <i aria-hidden="true" className="angle down disabled icon"></i>
          )}
        </Menu.Header>
        <Collapse in={open3} timeout="auto" unmountOnExit>
          <Menu.Menu>
            {checkScope(["COIN_READ", "COIN_FULL"]) && (
              <Menu.Menu>
                <Menu.Item
                  name="All coins"
                  active={activeItem === "/coin/list"}
                  onClick={() => _handleItemClick("/coin/list")}
                />
              </Menu.Menu>
            )}
            {checkScope(["DEPOSIT_READ"]) && (
              <Menu.Menu>
                <Menu.Item
                  name="Deposits history"
                  active={activeItem === "/deposit/list"}
                  onClick={() => _handleItemClick("/deposit/list")}
                />
              </Menu.Menu>
            )}
            {checkScope(["COIN_READ", "COIN_FULL"]) && (
              <Menu.Menu>
                <Menu.Item
                  name="Transactions"
                  active={activeItem === "/coin/transaction"}
                  onClick={() => _handleItemClick("/coin/transaction")}
                />
              </Menu.Menu>
            )}
            {checkScope(["WITHDRAW_READ", "WITHDRAW_FULL"]) && (
              <>
                <Menu.Menu>
                  <Menu.Item
                    name="withdrawals"
                    active={activeItem === "/withdraw/list"}
                    onClick={() => _handleItemClick("/withdraw/list")}
                  />
                </Menu.Menu>
                <Menu.Menu>
                  <Menu.Item
                    active={activeItem === "/withdraw/pending"}
                    onClick={() => _handleItemClick("/withdraw/pending")}
                  >
                    Pending Withdraws
                  </Menu.Item>
                </Menu.Menu>
                <Menu.Menu>
                  <Menu.Item
                    active={activeItem === "/withdraw/approve"}
                    onClick={() => _handleItemClick("/withdraw/approve")}
                  >
                    Approve Withdraws
                  </Menu.Item>
                </Menu.Menu>
              </>
            )}
            {checkScope(["AIRDROP"]) && (
              <Menu.Item
                name="airdrops"
                active={activeItem === "/user/airdrop"}
                onClick={() => _handleItemClick("/user/airdrop")}
              />
            )}
          </Menu.Menu>
        </Collapse>
      </Menu.Item>
      {checkScope(["ADMIN_FULL"]) && (
        <Menu.Item>
          <Menu.Header onClick={() => setOpen4(!open4)}>
            Trade
            {open4 ? (
              <i aria-hidden="true" className="angle up disabled icon"></i>
            ) : (
              <i aria-hidden="true" className="angle down disabled icon"></i>
            )}
          </Menu.Header>
          <Collapse in={open4} timeout="auto" unmountOnExit>
            <Menu.Menu>
              <Menu.Item
                name="Overview"
                active={activeItem === "/trade/overview"}
                onClick={() => _handleItemClick("/trade/overview")}
              />
              <Menu.Item
                name="Markets"
                active={activeItem === "/trade/markets"}
                onClick={() => _handleItemClick("/trade/markets")}
              />
              {checkScope(["KYC_FULL"]) && (
                <>
                  <Menu.Item
                    name="Open Orders"
                    active={activeItem === "/user/openorder"}
                    onClick={() => _handleItemClick("/user/openorder")}
                  />
                  <Menu.Item
                    name="Orders History"
                    active={activeItem === "/user/orderhistory"}
                    onClick={() => _handleItemClick("/user/orderhistory")}
                  />
                </>
              )}
            </Menu.Menu>
          </Collapse>
        </Menu.Item>
      )}
      {checkFeature("SWAP") && (
        <Menu.Item>
          <Menu.Header onClick={() => setOpen5(!open5)}>
            Swap
            {open5 ? (
              <i aria-hidden="true" className="angle up disabled icon"></i>
            ) : (
              <i aria-hidden="true" className="angle down disabled icon"></i>
            )}
          </Menu.Header>
          <Collapse in={open5} timeout="auto" unmountOnExit>
            <Menu.Menu>
              {checkScope(["SWAP_READ"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="list"
                    active={activeItem === "/swap/list"}
                    onClick={() => _handleItemClick("/swap/list")}
                  />
                </Menu.Menu>
              )}
              {checkScope(["SWAP_MARKET_FULL", "SWAP_MARKET_READ"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="markets"
                    active={activeItem === "/swap/market"}
                    onClick={() => _handleItemClick("/swap/market")}
                  />
                </Menu.Menu>
              )}
              {checkScope(["SWAP_PRODUCT_READ", "SWAP_PRODUCT_FULL"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="products"
                    active={activeItem === "/swap/product"}
                    onClick={() => _handleItemClick("/swap/product")}
                  />
                </Menu.Menu>
              )}
            </Menu.Menu>
          </Collapse>
        </Menu.Item>
      )}
      {checkFeature("STAKING") && (
        <Menu.Item>
          <Menu.Header onClick={() => setOpen6(!open6)}>
            Staking
            {open6 ? (
              <i aria-hidden="true" className="angle up disabled icon"></i>
            ) : (
              <i aria-hidden="true" className="angle down disabled icon"></i>
            )}
          </Menu.Header>
          <Collapse in={open6} timeout="auto" unmountOnExit>
            <Menu.Menu>
              {checkScope(["STAKING_READ"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="All Stakings"
                    active={activeItem === "/staking/transaction"}
                    onClick={() => _handleItemClick("/staking/transaction")}
                  />
                </Menu.Menu>
              )}
              {checkScope(["STAKING_READ"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="Redeems"
                    active={activeItem === "/staking/reedems"}
                    onClick={() => _handleItemClick("/staking/reedems")}
                  />
                </Menu.Menu>
              )}
              {checkScope(["STAKING_PRODUCT_FULL", "STAKING_PRODUCT_READ"]) && (
                <Menu.Menu>
                  <Menu.Item
                    name="products"
                    active={activeItem === "/staking/product"}
                    onClick={() => _handleItemClick("/staking/product")}
                  />
                </Menu.Menu>
              )}
            </Menu.Menu>
          </Collapse>
        </Menu.Item>
      )}
      {checkFeature("STARTUP") && checkScope(["PRESALE_FULL", "PRESALE_READ"]) && (
        <Menu.Item>
          <Menu.Header onClick={() => setOpen7(!open7)}>
            Startup
            {open7 ? (
              <i aria-hidden="true" className="angle up disabled icon"></i>
            ) : (
              <i aria-hidden="true" className="angle down disabled icon"></i>
            )}
          </Menu.Header>
          <Collapse in={open7} timeout="auto" unmountOnExit>
            <Menu.Menu>
              {checkScope(["ADMIN_FULL"]) && (
                <Menu.Item
                  name="overview"
                  active={activeItem === "/overview/startup"}
                  onClick={() => _handleItemClick("/overview/startup")}
                />
              )}
              <Menu.Item
                name="transactions"
                active={activeItem === "/startup/list"}
                onClick={() => _handleItemClick("/startup/list")}
              />
              <Menu.Item
                name="Products"
                active={activeItem === "/startup/products"}
                onClick={() => _handleItemClick("/startup/products")}
              />
            </Menu.Menu>
          </Collapse>
        </Menu.Item>
      )}
      {checkScope(["TRADE_FULL"]) && (
        <Menu.Item style={{ padding: "6px 14px" }}>
          <Menu.Menu>
            <Menu.Item
              name="Volume Bot"
              active={activeItem === "/bot/volume-bot-list"}
              onClick={() => _handleItemClick("/bot/volume-bot-list")}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "black",
                paddingBottom: "8px",
              }}
            />
          </Menu.Menu>
        </Menu.Item>
      )}
      <Menu.Item>
        <Menu.Header onClick={() => setOpen8(!open8)}>
          System Setting
          {open8 ? (
            <i aria-hidden="true" className="angle up disabled icon"></i>
          ) : (
            <i aria-hidden="true" className="angle down disabled icon"></i>
          )}
        </Menu.Header>
        <Collapse in={open8} timeout="auto" unmountOnExit>
          <Menu.Menu>
            {checkScope(["ROLE_FULL", "ROLE_READ"]) && (
              <Menu.Item
                name="All roles"
                active={activeItem === "/role/list"}
                onClick={() => _handleItemClick("/role/list")}
              />
            )}
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="All administrators"
                active={activeItem === "/admin/list"}
                onClick={() => _handleItemClick("/admin/list")}
              />
            )}
          </Menu.Menu>
        </Collapse>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header onClick={() => setOpen9(!open9)}>
          CMS
          {open9 ? (
            <i aria-hidden="true" className="angle up disabled icon"></i>
          ) : (
            <i aria-hidden="true" className="angle down disabled icon"></i>
          )}
        </Menu.Header>
        <Collapse in={open9} timeout="auto" unmountOnExit>
          <Menu.Menu>
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="Banner"
                active={activeItem === "/cms/banner"}
                onClick={() => _handleItemClick("/cms/banner")}
              />
            )}
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="Section"
                active={activeItem === "/cms/section"}
                onClick={() => _handleItemClick("/cms/section")}
              />
            )}
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="Notification"
                active={activeItem === "/cms/notification"}
                onClick={() => _handleItemClick("/cms/notification")}
              />
            )}
            {checkScope(["ADMIN_FULL"]) && (
              <Menu.Item
                name="FAQ"
                active={activeItem === "/cms/faq"}
                onClick={() => _handleItemClick("/cms/faq")}
              />
            )}
          </Menu.Menu>
        </Collapse>
      </Menu.Item>
      <Menu.Item
        id="menu_option"
        name="change-password"
        active={activeItem === "/change-password"}
        onClick={() => _handleItemClick("/change-password")}
      >
        Change password
      </Menu.Item>
      <Menu.Item
        id="menu_option"
        name="Google authenticator"
        active={activeItem === "/setting/ga"}
        onClick={() => _handleItemClick("/setting/ga")}
      />
      <Menu.Item
        id="menu_option"
        onClick={() => {
          logout();
          window.localStorage.removeItem("SCOPES");
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
}

export default CustomMenu;
