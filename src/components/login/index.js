import { useEffect, useState } from "react";
import { setAccessToken, setScopes } from "../../utils/auth";
import { alertError, get, post } from "../../utils/api";
import { ErrorCode } from "../../settings/constants";
import {
  Button,
  Container,
  Dimmer,
  Form,
  Loader,
  Modal,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import { objFromUrlParams } from "../../utils/util";
import { useHistory } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [gaCode, setGaCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [isShowOtp, setIsShowOtp] = useState(false);
  const [isShowGA, setIsShowGA] = useState(false);

  const urlParam = objFromUrlParams(window.location.search);
  
  const login = () => {
    if (!email || !password) return;
    setSuccess(true);
    post(
      "/admin-service/admin/login",
      {
        email,
        password,
        emailOtp,
        gaCode,
        device: "Trusted Device",
      },
      (data) => {
        setAccessToken(data.accessToken);
        setTimeout(() => {
          get(`/admin-service/admin/profile`, (data) => {
            window.localStorage.setItem("SCOPES", data.scopes);
            window.location.reload();
          });
        }, 1000);
      },
      (error) => {
        setSuccess(false);
        if (error.code == ErrorCode.EMAIL_OTP_REQUIRED) {
          setIsShowGA(false);
          setIsShowOtp(true);
          toast("Please enter Email OTP");
        } else if (error.code == ErrorCode.GACODE_REQUIRED) {
          setIsShowGA(true);
          setIsShowOtp(false);
          toast("Please enter GA Code");
        } else alertError(error);
      }
    );
  };

  useEffect(() => {
    if (urlParam && urlParam.token) {
      setAccessToken(urlParam.token);
      setSuccess(true);
      setTimeout(() => {
        get(
          `/admin-service/admin/profile`,
          (data) => {
            window.localStorage.setItem("SCOPES", data.scopes);
            window.location.href = "/";
            setSuccess(false);
          },
          () => {
            setSuccess(false);
          }
        );
      }, 1000);
    }
  }, [urlParam]);

  return (
    <>
      <Dimmer page active={success}>
        <Loader />
      </Dimmer>
      <Modal open size="mini">
        <Modal.Header>
          <Container textAlign="center">Login</Container>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
            <Form.Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
            />
            {isShowOtp && (
              <Form.Group widths="equal">
                <Form.Input
                  placeholder="Enter OTP in your email"
                  onChange={(e) => setEmailOtp(e.target.value)}
                />
              </Form.Group>
            )}
            {isShowGA && (
              <Form.Input
                type="text"
                placeholder="GA Code (Optional)"
                onChange={(e) => setGaCode(e.target.value)}
              />
            )}
            <Button variant="primary" onClick={() => login()} fluid>
              Login
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
}
