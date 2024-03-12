import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button, Form } from "antd";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Formfield, InputField, Logintext } from "../styles/Styles";
import { EmailClient } from "@azure/communication-email";

export default function SignUpForm({ emailPattern }) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deniedDomains, setDeniedDomains] = useState([]);
  const [signUpEmailData, setSignUpEmailData] = useState(null);
  const navigate = useNavigate();

  const fetchDeniedDomains = async () => {
    try {
      const endPoint =
        "https://api.contentstack.io/v3/content_types/denied_domains/entries";
      const headers = {
        api_key: "blt6f0f282d20bbe00b",
        authorization: "cs126192b9f72c7fcf7ec544c3",
      };
      const response = await axios.get(endPoint, { headers });
      setDeniedDomains(response.data.entries);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDeniedDomains();
  }, []);

  useEffect(() => {
    const fetchSignUpEmailData = async () => {
      try {
        const data = {
          query: `query FetchEmailContents {
            all_emails(where: {select_type: "Sign Up"}) {
              total
              items {
                title
                select_type
                email_subject
                sender_email
                bcc
                email_message {
                  json
                }
              }
            }
          }`,
        };
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://graphql.contentstack.com/stacks/blt6f0f282d20bbe00b?environment=prod",
          headers: {
            access_token: "cs534278b3e38a059d0cd52cdc",
            "Content-Type": "application/json",
          },
          data: JSON.stringify(data),
        };
        const response = await axios.request(config);
        setSignUpEmailData(response.data.data.all_emails.items[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSignUpEmailData();
  }, []);

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const emailDomain = values.title.split("@")[1];
      const deniedDomainsList = deniedDomains.map((entry) => entry.title);
      if (deniedDomainsList.includes(emailDomain)) {
        throw new Error("Only professional emails are allowed");
      }

      const existingUserResponse = await axios.get(
        `https://api.contentstack.io/v3/content_types/application_user/entries?locale=en-us&title=${values.title}`,
        {
          headers: {
            api_key: "blt6f0f282d20bbe00b",
            authorization: "cs126192b9f72c7fcf7ec544c3",
          },
        }
      );
      if (existingUserResponse.data.entries.length > 0) {
        throw new Error("This email is already registered.");
      }

      const endPoint =
        "https://api.contentstack.io/v3/content_types/application_user/entries?locale=en-us";

      const payload = {
        entry: {
          user_name: values.user_name,
          company_name: values.company_name,
          title: values.title,
          contact_number: values.contact_number,
        },
      };
      const headers = {
        api_key: "blt6f0f282d20bbe00b",
        authorization: "cs126192b9f72c7fcf7ec544c3",
      };
      const res = await axios.post(endPoint, payload, { headers });

      const connectionString =
        "endpoint=https://mutare-communication.unitedstates.communication.azure.com/;accesskey=w5Mih2Q6SSM/m4aIp5YvFdnpb45Lj/yrZEEfji7e8TYMcP2aCPh/vHSAj9vfrDAkjjsIBTBbgWtE1CjykdjqxQ==";
      const client = new EmailClient(connectionString);

      const emailMessage = {
        senderAddress: signUpEmailData?.sender_email,
        content: {
          subject: signUpEmailData?.email_subject,
          html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script
                src="https://kit.fontawesome.com/fab1f8bdcb.js"
                crossorigin="anonymous"
              ></script>
              <title>Email Template</title>
            </head>
            <body>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #dcf0ec;
                "
              >
                <div
                  style="
                    background-color: #ffffff;
                    margin-top: 5%;
                    margin-bottom: 5%;
                    width: 70%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                  "
                >
                <img
                src="https://images.contentstack.io/v3/assets/blt6f0f282d20bbe00b/blt58e0bed74aba1c39/65dcad6b6e7edbf719b4ec54/WhatsApp_Image_2024-02-08_at_17.16.53.jpeg"
                style="object-fit: cover; padding-top: 20px"
                alt="ChemAId Logo"
                width="158px"
              />
              <hr style="height: 1px; border: none; background-color: #3ac1cb" />
              <div style="padding-left: 30px; padding-right: 30px;">
                <p
                  style="
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 36px;
                    opacity: 80%;
                  "
                >
                  Dear <strong>${values.user_name}</strong>,
                </p>
                <p
                style="
                font-size: 14px;
                font-weight: 400;
                opacity: 80%;
                line-height: 20px;
              "
                >
                  ${signUpEmailData?.email_message?.json?.children[2]?.children[0]?.text}
                </p>
      
                <div
                  style="display: flex; align-items: center; justify-content: center"
                >
                  <div style="background-color: #eef0f8; padding: 3px 20px">
                    <p
                      id="textToCopy"
                      style="font-size: 16px; font-weight: 400; opacity: 40%"
                    >
                      <i class="fa-solid fa-lock"></i>
                      ${res.data.entry.uid}
                    </p>
                  </div>
      
                  <button
                    onclick="copyText()"
                    style="
                      font-size: 16px;
                      font-weight: 500;
                      color: #ffffff;
                      border: none;
                      background-color: #3ac1cb;
                      padding: 20px;
                      cursor: pointer;
                    "
                  >
                    <i class="fa-regular fa-copy"></i> Copy
                  </button>
                </div>      
                <p
                  style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  "
                >
                  ${signUpEmailData?.email_message?.json?.children[6]?.children[0]?.text}
                </p>
                <p
                style="
                  font-size: 14px;
                  font-weight: 400;
                  opacity: 80%;
                  line-height: 20px;
                "
              >
                ${signUpEmailData?.email_message?.json?.children[8]?.children[0]?.text}
              </p>
                <ul>
                  <li style="display: flex; flex-direction: row;">
                    <p style="
                    font-size: 14px;
                    opacity: 80%;
                    line-height: 20px;
                    padding-right: 10px;
                  "><strong>${signUpEmailData?.email_message?.json?.children[9]?.children[0]?.children[0]?.children[0]?.text}</strong></p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${signUpEmailData?.email_message?.json?.children[9]?.children[0]?.children[0]?.children[1]?.text}</p>
                  </li>
                  <li style="display: flex; flex-direction: row;">
                    <p style="
                    font-size: 14px;
                    opacity: 80%;
                    line-height: 20px;
                    padding-right: 10px;
                  "><strong>${signUpEmailData?.email_message?.json?.children[9]?.children[1]?.children[0]?.children[0]?.text}</strong></p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${signUpEmailData?.email_message?.json?.children[9]?.children[1]?.children[0]?.children[1]?.text}</p>
                  </li>
                  <li style="display: flex; flex-direction: row;">
                    <p style="
                    font-size: 14px;
                    opacity: 80%;
                    line-height: 20px;
                    padding-right: 10px;
                  "><strong>${signUpEmailData?.email_message?.json?.children[9]?.children[2]?.children[0]?.children[0]?.text}</strong></p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${signUpEmailData?.email_message?.json?.children[9]?.children[2]?.children[0]?.children[1]?.text}<strong>${signUpEmailData?.email_message?.json?.children[9]?.children[2]?.children[0]?.children[2]?.text}</strong></p>
                  </li>
                </ul>
                <p style="
                font-size: 14px;
                opacity: 80%;
                line-height: 20px;
              "><strong>${signUpEmailData?.email_message?.json?.children[10]?.children[0]?.text}</strong>${signUpEmailData?.email_message?.json?.children[10]?.children[1]?.text}</p>
                <p style="
                font-size: 14px;
                font-weight: 400;
                opacity: 80%;
                line-height: 20px;
              ">${signUpEmailData?.email_message?.json?.children[11]?.children[0]?.text}</p>
                <p style="
                font-size: 14px;
                font-weight: 400;
                opacity: 80%;
                line-height: 20px;
              ">${signUpEmailData?.email_message?.json?.children[12]?.children[0]?.text}</p>
                <p style="
                font-size: 14px;
                font-weight: 400;
                opacity: 80%;
                line-height: 20px;
              ">${signUpEmailData?.email_message?.json?.children[14]?.children[0]?.text}</p>
                <p style="
                font-size: 14px;
                font-weight: 400;
                opacity: 80%;
                line-height: 20px;
              ">${signUpEmailData?.email_message?.json?.children[15]?.children[0]?.text}</p>
                <p style="
                font-size: 14px;
                opacity: 80%;
                line-height: 20px;
              "><strong>${signUpEmailData?.email_message?.json?.children[15]?.children[2]?.text}</strong></p>
                <p
                  style="
                    font-size: 15px;
                    font-weight: 400;
                    opacity: 60%;
                    text-align: center;
                    line-height: 22.5px;
                  "
                >
                2023 CHEM&#8226;AID<sup>TM</sup>&#9135; All rights reserved.
                </p>
              </div>
                </div>
              </div>
              <script>
                  function copyText() {
                  const textToCopy = document.getElementById("textToCopy").innerText;
                  navigator.clipboard.writeText(textToCopy)
                  .then(() => {
                  alert('Copied to clipboard!');
                  })
                  .catch((error) => {
                  console.error('Unable to copy:', error);
                  alert('Failed to copy text!');
                  });
                  }
              </script>
            </body>
          </html>
          `,
        },
        recipients: {
          to: [{ address: values.title }],
          bcc: [
            // { address: "admin@mutare.group" },
            { address: signUpEmailData.bcc },
          ],
        },
      };

      const poller = await client.beginSend(emailMessage);
      await poller.pollUntilDone();

      toast.success(
        "User registered successfully. Please check your mail for token"
      );
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Formfield
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSignup}
        emailPattern={emailPattern}
      >
        <Form.Item
          name="user_name"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
          ]}
        >
          <InputField
            autoComplete="off"
            prefix={
              <FontAwesomeIcon icon={faUser} style={{ color: "#BBBBBB" }} />
            }
            type="text"
            placeholder="Full Name"
            className="boldPlaceholder"
          />
        </Form.Item>
        <Form.Item
          name="company_name"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
          ]}
        >
          <InputField
            autoComplete="off"
            prefix={
              <FontAwesomeIcon icon={faBuilding} style={{ color: "#BBBBBB" }} />
            }
            type="text"
            placeholder="Company Name"
            className="boldPlaceholder"
          />
        </Form.Item>
        <Form.Item
          name="contact_number"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
          ]}
        >
          <PhoneInput
            inputStyle={{
              height: 44,
              width: "100%",
              borderColor: "none",
              boxShadow: "0 0 0 1px rgba(22, 119, 255, 0.2)",
              "&::focus": {
                borderColor: "#1677ff",
                boxShadow: "0 0 0 1px rgba(22, 119, 255, 0.2)",
              },
            }}
            // buttonStyle={{
            //   borderColor: "#1677ff",
            //   borderRightColor: "none",
            // }}
            country={"us"}
            value={phoneNumber}
            onChange={(text) => setPhoneNumber(text)}
            className="boldPlaceholder"
          />
        </Form.Item>
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "This field is required!",
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
        <Form.Item>
          <Button
            disabled={loading ? true : false}
            htmlType="submit"
            className="login-form-button"
            block
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${loading ? "#BEC8C8" : "#3AC1CB"}`,
              color: "#FFFFFF",
              borderStyle: "none",
              paddingTop: "5%",
              paddingBottom: "5%",
              textTransform: "uppercase",
            }}
          >
            <Logintext>
              Sign up
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
          </Button>
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
