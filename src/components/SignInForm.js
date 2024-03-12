import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Form } from "antd";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Buttonfield,
  ForgotToken,
  Formfield,
  InputField,
  Logintext,
} from "../styles/Styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/actions/userAction";

export default function SignInForm({ emailPattern }) {
  const [loading, setLoading] = useState(false);
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const base_url = "api.contentStack.io";
  const content_type = "application_user";

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleSignin = async (values) => {
    setLoading(true);
    const loginEndpoint = `https://${base_url}/v3/content_types/${content_type}/entries`;
    const headers = {
      api_key: "blt6f0f282d20bbe00b",
      authorization: "cs126192b9f72c7fcf7ec544c3",
    };
    try {
      const response = await axios.get(loginEndpoint, { headers });
      const data = response.data.entries;
      const foundUser = data.find(
        (item) => item.uid === values.token && item.title === values.title
      );
      if (foundUser) {
        if (foundUser.blocked) {
          toast.error("User is blocked! Please contact support.");
        } else {
          setInvalidAttempts(0);
          toast.success("User logged in successfully");
          dispatch(setUserData(foundUser));
          localStorage.setItem("userData", JSON.stringify(foundUser));
          const uniqueId = generateRandomString(8);
          const payload = {
            entry: {
              title: uniqueId,
              user_name: values.title,
            },
          };
          const endpoint = `https://${base_url}/v3/content_types/visit_log/entries`;
          await axios.post(endpoint, payload, { headers });
        }
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        const invalidEmail = data.find(
          (item) => item.uid === values.token && item.title !== values.title
        );
        const invalidToken = data.find(
          (item) => item.uid !== values.token && item.title === values.title
        );
        if (invalidToken) {
          if (invalidAttempts >= 4) {
            toast.error("5 invalid attempts! User blocked");
            const blockedUser = data.find(
              (item) => item.title === values.title
            );
            if (blockedUser) {
              const payload = {
                entry: {
                  blocked: (blockedUser.blocked = true),
                },
              };
              await axios.put(
                `https://${base_url}/v3/content_types/${content_type}/entries/${blockedUser.uid}`,
                payload,
                { headers }
              );
            }
            return;
          } else {
            setInvalidAttempts((prevAttempts) => prevAttempts + 1);
            toast.error("Token is invalid!");
          }
        } else {
          if (invalidEmail) {
            toast.error("Email Not Found!");
          } else {
            toast.error("User not found!");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const forgotToken = async () => {
    navigate("/forget");
  };

  return (
    <>
      <Formfield
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSignin}
        emailPattern={emailPattern}
      >
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "This email is invalid!",
            },
          ]}
        >
          <InputField
            autoComplete="off"
            prefix={
              <FontAwesomeIcon icon={faEnvelope} style={{ color: "#BBBBBB" }} />
            }
            type="email"
            placeholder="Email Address"
            className="boldPlaceholder"
          />
        </Form.Item>

        <Form.Item
          name="token"
          rules={[
            {
              required: true,
              message: "Please enter your Token!",
            },
          ]}
        >
          <InputField
            autoComplete="off"
            prefix={
              <FontAwesomeIcon icon={faLock} style={{ color: "#BBBBBB" }} />
            }
            type="text"
            placeholder="Enter Token"
            className="boldPlaceholder"
          />
        </Form.Item>

        <Form.Item>
          <ForgotToken
            onClick={forgotToken}
            onMouseOver={(e) => (e.currentTarget.style.color = "#1B1B1B")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1B1B1B")}
          >
            Forgot Token
          </ForgotToken>
        </Form.Item>

        <Form.Item>
          <Buttonfield
            disabled={loading ? true : false}
            htmlType="submit"
            className="login-form-button"
            block
            style={{
              backgroundColor: `${loading ? "#BEC8C8" : "#3AC1CB"}`,
              color: "#FFFFFF",
            }}
          >
            <Logintext>
              Login
              {!loading ? (
                <></>
              ) : (
                <Spinner
                  animation="border"
                  role="status"
                  size="sm"
                  style={{ marginLeft: "10px" }}
                />
              )}
            </Logintext>
          </Buttonfield>
        </Form.Item>
      </Formfield>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        pauseOnHover={false}
      />
    </>
  );
}
