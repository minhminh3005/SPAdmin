import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Segment,
  Container,
} from "semantic-ui-react";
import { get, post } from "../../utils/api";
import { toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { checkFeature, checkScope } from "../../settings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    marginBottom: "20px",
    alignItems: "center"
  },
}));

function Command() {
  const classes = useStyles();

  const [resultByAddress, setResultByAddress] = useState(null);
  const [resultByTxId, setResultByTxId] = useState(null);
  const [email, setEmail] = useState("");
  const [coin, setCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [errorE, setErrorE] = useState("");
  const [errorC, setErrorC] = useState("");
  const [errorA, setErrorA] = useState("");
  const [optionsCoin, setOptionsCoin] = useState([]);
  const [emailOption, setEmailOption] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { manager } = useSelector((state) => state);
  const { fundStatistic } = manager;

  useEffect(() => {
    if (fundStatistic) {
      const _options = [];
      fundStatistic.statistics.map((item) => {
        // if (item.isActive) {
        _options.push({
          key: item.coin,
          value: item.coin,
          text: item.coin,
        });
      });
      setOptionsCoin(_options);
    };
  }, [fundStatistic]);

  useEffect(() => {
    get("/fund-service/fund/get-emails", (data) => _setEmailOption(data));
  }, []);

  const _setEmailOption = (data) => {
    let _option = [];
    data.map((item) => {
      _option.push({
        key: item,
        value: item,
        text: item,
      });
      setEmailOption(_option);
    });
  };

  const _onAddFund = (value) => {
    if (coin && email && amount) {
      setIsSubmit(true);
      post("/fund-service/fund/add-balance-for-user", value, () => {
        toast("Add fund successful");
        setIsSubmit(false);
        setEmail("");
        setCoin("");
        setAmount("");
        setErrorC("");
        setErrorE("");
        setErrorA("");
      });
    };
    if (email) {
      setErrorE("");
    };
    if (coin) {
      setErrorC("");
    }
    if(amount) {
      setErrorA("");
    }
    if (!email) {
      setErrorE("Please select email");
    };
    if (!coin) {
      setErrorC("Please select coin");
    };
    if(!amount) {
      setErrorA("Please select amount");
    }
  };

  const _searchByAddress = (e) => {
    get(
      `/fund-service/fund/get-user-by-address?address=${e.target.address.value}&addressTag=${e.target.addressTag.value}`,
      (data) => setResultByAddress(data)
    );
  };

  const _searchByTxHash = (e) => {
    get(
      `/fund-service/fund/get-user-by-txid?txId=${e.target.txId.value}`,
      (data) => setResultByTxId(data)
    );
  };

  return (
    <Segment vertical loading={isSubmit}>
      <Header>Command</Header>
      <Grid columns="2">
        <Grid.Column>
          <Form onSubmit={_searchByAddress}>
            <Form.Input
              label="Search by Wallet address"
              placeholder="Enter address"
              id="address"
            />
            <Form.Input
              placeholder="Enter address tag"
              id="addressTag"
            />
            <Button>Search</Button>

          </Form>
          {resultByAddress && (
            <Segment>
              <Header>Users</Header>
              {resultByAddress.userId === 0 ? (
                <p>Not found</p>
              ) : (
                <Link
                  to={`/user-detail/${resultByAddress.userId}`}
                  target="_blank"
                >
                  {resultByAddress.userId}
                </Link>
              )}
            </Segment>
          )}
        </Grid.Column>
        <Grid.Column>
          <Form onSubmit={_searchByTxHash}>
            <Form.Input
              label="Search by Transaction hash"
              placeholder="Enter transaction hash"
              id="txId"
            />
            <Button>Search</Button>
          </Form>
          {resultByTxId && (
            <Segment>
              <Header>Users</Header>
              {resultByTxId.map((item, index) =>
                item === 0 ? (
                  <p key={index}>Not found</p>
                ) : (
                  <Link to={`/user-detail/${item}`} key={index}>
                    {item}{" "}
                  </Link>
                )
              )}
            </Segment>
          )}
        </Grid.Column>
      </Grid>
      <Divider />
      {checkScope(["FUND_FULL"]) &&  <>
      <Header>Add fund to Email</Header>
      <Grid columns={2}>
        <Grid.Column>
          <Form onSubmit={() => _onAddFund({coin, email, amount})}>
            <Form.Select
              style={{ marginTop: "3px" }}
              placeholder="Select email"
              value={email}
              options={emailOption}
              onChange={(e, { value }) => setEmail(value)}
              clearable
              selectOnBlur={false}
            />
            {errorE ? <div className={classes.root}>
              <Alert severity="error" id="alert_commamd">Please select email</Alert>
            </div> : null}
            <Form.Select
              placeholder="Select coin"
              value={coin}
              options={optionsCoin}
              onChange={(e, { value }) => setCoin(value)}
              clearable
              selectOnBlur={false}
            />
            {errorC ? <div className={classes.root}>
              <Alert severity="error" id="alert_commamd">Please select coin</Alert>
            </div> : null}
            <Form.Input
              placeholder="Enter Amount"
              value={amount}
              type="number"
              onChange={(e, { value }) => setAmount(value)}
            />
            {errorA ? <div className={classes.root}>
              <Alert severity="error" id="alert_commamd">Please select amount</Alert>
            </div> : null}
            <Button >
              Add Fund
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
       </>
      }
     
    </Segment>
  );
}

export default Command;
