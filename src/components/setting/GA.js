import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Header, Image, Segment } from "semantic-ui-react";
import { CLOSE_POPUP, SHOW_POPUP } from "../../redux/constant";
import { get, put } from "../../utils/api";

function GA() {
  const [gaEnable, setGaEnable] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    get(`/admin-service/admin/profile`, (data) => {
      setGaEnable(data.gaEnable);
      if (!qrCode && !data.gaEnable) {
        get(`/admin-service/admin/ga`, (data) => setQrCode(data));
      }
    });
  });

  const _handleTurnOffGA = (e) => {
    const password = e.target.password.value;
    const gaCode = e.target.gaCode.value;
    if (password.length < 1) {
      toast.error("Please enter your password");
    } else if (gaCode.length !== 6) {
      toast.error("Google authenticator code not valid");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Turn off Google authenticator",
          callback: () => {
            put(
              `/admin-service/admin/ga`,
              {
                gaCode,
                password,
                enable: false,
              },
              () => {
                toast("Turn off Google authenticator successfully");
              }
            );
          },
        },
      });
    }
  };

  const _handleTurnOnGA = (e) => {
    const password = e.target.password.value;
    const gaCode = e.target.gaCode.value;
    if (password.length < 1) {
      toast.error("Please enter your password");
    } else if (gaCode.length !== 6) {
      toast.error("Google authenticator code not valid");
    } else {
      dispatch({
        type: SHOW_POPUP,
        payload: {
          content: "Turn on Google authenticator",
          callback: () => {
            put(
              `/admin-service/admin/ga`,
              {
                gaCode,
                password,
                enable: true,
              },
              () => {
                toast("Turn on Google authenticator successfully");
              }
            );
          },
        },
      });
    }
  };

  if (gaEnable) {
    return (
      <>
        <Header>Turn Off Google Authenticator</Header>
        <Form onSubmit={_handleTurnOffGA}>
          <Form.Input
            type="password"
            label="Password"
            placeholder="Please enter your password"
            id="password"
            name="password"
            style={{ width: 330 }}
            required
          />
          <Form.Input
            label="Google authenticator code"
            placeholder="Please enter Google authenticator code"
            id="gaCode"
            name="gaCode"
            style={{ width: 330 }}
            required
          />
          <Button>Confirm</Button>
        </Form>
      </>
    );
  } else {
    return (
      <>
        <Header>Turn On Google Authenticator</Header>
        <Segment
          compact
          textAlign="center"
          loading={loading}
          style={{ minHeight: 300, minWidth: 300 }}
        >
          {qrCode && (
            <>
              <Image
                src={qrCode.qrCodeSetupImageUrl}
                size="medium"
                onLoad={() => setLoading(false)}
              />
              <p>{qrCode.manualEntryKey}</p>
            </>
          )}
        </Segment>
        <Form onSubmit={_handleTurnOnGA}>
          <Form.Input
            type="password"
            label="Password"
            placeholder="Please enter your password"
            id="password"
            name="password"
            style={{ width: 330 }}
          />
          <Form.Input
            label="Google authenticator code"
            placeholder="Please enter Google authenticator code"
            id="gaCode"
            name="gaCode"
            style={{ width: 330 }}
          />
          <Button>Confirm</Button>
        </Form>
      </>
    );
  }
}

export default GA;
