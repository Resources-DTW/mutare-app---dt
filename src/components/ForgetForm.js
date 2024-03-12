import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button, Form } from "antd";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formfield, InputField, Logintext } from "../styles/Styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EmailClient } from "@azure/communication-email";
import { jsonToHtml } from "@contentstack/json-rte-serializer";

export default function ForgetForm({ emailPattern }) {
  const [loading, setLoading] = useState(false);
  const [forgotEmailData, setForgotEmailData] = useState(null);
  const navigate = useNavigate();

  const base_url = "api.contentStack.io";
  const content_type = "application_user";

  useEffect(() => {
    const fetchForgotEmailData = async () => {
      try {
        const data = {
          query: `query FetchEmailContents {
            all_emails(where: {select_type: "Forgot Token"}) {
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
        setForgotEmailData(response.data.data.all_emails.items[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchForgotEmailData();
  }, []);

  const handleSendToken = async (values) => {
    setLoading(true);
    const loginEndpoint = `https://${base_url}/v3/content_types/${content_type}/entries`;
    const headers = {
      api_key: "blt6f0f282d20bbe00b",
      authorization: "cs126192b9f72c7fcf7ec544c3",
    };
    try {
      const response = await axios.get(loginEndpoint, { headers });
      const data = response.data.entries;

      const foundUser = data.some((item) => item.title === values.title);
      const userData = response.data.entries.find(
        (entry) => entry.title === values.title
      );
      toast.success("Token sent successfully");
      setTimeout(() => {
        navigate("/");
      }, 1000);
      if (foundUser || userData) {
        const { user_name, uid } = userData;
        const connectionString =
          "endpoint=https://mutare-communication.unitedstates.communication.azure.com/;accesskey=w5Mih2Q6SSM/m4aIp5YvFdnpb45Lj/yrZEEfji7e8TYMcP2aCPh/vHSAj9vfrDAkjjsIBTBbgWtE1CjykdjqxQ==";
        const client = new EmailClient(connectionString);

        const emailMessage = {
          senderAddress: forgotEmailData?.sender_email,
          content: {
            subject: forgotEmailData?.email_subject,
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
                      Dear <strong>${user_name}</strong>,
                    </p>
                    <p
                      style="
                      font-size: 14px;
                      font-weight: 400;
                      line-height: 20px;
                      opacity: 80%;
                      "
                    >
                      ${forgotEmailData?.email_message?.json?.children[4]?.children[0]?.text}
                      ${forgotEmailData?.email_message?.json?.children[5]?.children[0]?.text}
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
                          ${uid}
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
                     ${forgotEmailData?.email_message?.json?.children[9]?.children[0]?.text}
                     ${forgotEmailData?.email_message?.json?.children[10]?.children[0]?.text}
                    </p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${forgotEmailData?.email_message?.json?.children[12]?.children[0]?.text}</p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${forgotEmailData?.email_message?.json?.children[13]?.children[0]?.text}</p>
                    <p style="
                    font-size: 14px;
                    font-weight: 400;
                    opacity: 80%;
                    line-height: 20px;
                  ">${forgotEmailData?.email_message?.json?.children[14]?.children[0]?.text}</p>
                    <p
                      style="
                        font-size: 15px;
                        font-weight: 400;
                        opacity: 60%;
                        text-align: center;
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
            
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = textToCopy;
            
                document.body.appendChild(tempTextArea);
            
                tempTextArea.select();
                tempTextArea.setSelectionRange(0, 99999); // For mobile devices
            
                document.execCommand('copy');
            
                document.body.removeChild(tempTextArea);
            
                alert('Copied to clipboard!');
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
              { address: forgotEmailData?.bcc },
            ],
          },
        };

        const poller = await client.beginSend(emailMessage);
        await poller.pollUntilDone();
      } else {
        toast.error("Email is invalid!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
        onFinish={handleSendToken}
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
              Submit
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
