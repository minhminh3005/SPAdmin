import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";
import { SHOW_POPUP } from "../../redux/constant";
import { put } from "../../utils/api";

function SendAirdrop(props) {
  const dispatch = useDispatch();
  const { manager } = useSelector((state) => state);
  const { fundStatistic, stakingProducts } = manager;
  const { userEmail, onReload } = props;
  const [openForm, setOpenForm] = useState(false);
  const [coinOptions, setCoinOptions] = useState([]);
  const [currentCoin, setCurrentCoin] = useState(null);
  const [coinError, setCoinError] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(userEmail);
  }, [userEmail]);

  useEffect(() => {
    if (fundStatistic) {
      var list = [];
      fundStatistic.statistics.map((item) =>
        list.push({
          key: item.coin,
          value: item.coin,
          text: item.coin,
        })
      );
      setCoinOptions(list);
    }
  }, [fundStatistic]);

  function handleSubmit() {
    if (!currentCoin) {
      setCoinError(true);
      return;
    }
    dispatch({
      type: SHOW_POPUP,
      payload: {
        content: `Send ${amount}${currentCoin} for ${email} ?`,
        callback: () => {
          put(
            `/user-service/user/add-airdrop`,
            {
              email,
              amount,
              type: "Airdrop",
              coin: currentCoin,
            },
            () => {
              toast.success("Send airdrop successful");
              if (onReload) onReload();
              setOpenForm(false);
            },
            (error) => {
              console.log(error);
              toast.error(`Send airdrop fail.\n${error.code}`);
            }
          );
        },
      },
    });
  }

  return (
    <>
      <Button color="teal" onClick={() => setOpenForm(true)}>
        Send airdrop
      </Button>
      <Modal
        size={"mini"}
        open={openForm}
        closeOnDimmerClick={false}
        onClose={() => setOpenForm(false)}
      >
        <Modal.Header>Send Airdrop</Modal.Header>
        <Modal.Content>
          <Form onSubmit={() => handleSubmit()}>
            <Form.Dropdown
              options={coinOptions}
              clearable
              selection
              search
              placeholder="Coin"
              value={currentCoin}
              onChange={(e, { value }) => {
                setCurrentCoin(value);
                setCoinError(false);
              }}
              label="Select coin"
              required
              error={
                coinError
                  ? {
                      content: "Please select coin",
                    }
                  : null
              }
            />
            <Form.Input
              labelPosition="right"
              type="number"
              placeholder="Amount"
              action={currentCoin ? currentCoin : "-/-"}
              label="Amount"
              required
              value={amount}
              onChange={(e, value) =>
                setAmount(parseFloat(value.value) >= 0 ? value.value : "")
              }
            ></Form.Input>
            <Form.Input
              type="text"
              placeholder="example@gmail.com"
              label="Email"
              required
              value={email}
              onChange={(e, value) => setEmail(value.value)}
            ></Form.Input>
            <Form.Field>
              <Button type="button" onClick={() => setOpenForm(false)}>
                Close
              </Button>
              <Button type="submit" positive onClick={() => handleSubmit()}>
                Send
              </Button>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default SendAirdrop;
