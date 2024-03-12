import axios from "axios";
import React, { useEffect, useState } from "react";
import { AlertBox } from "../styles/Styles";
import { Alert } from "antd";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import ReactHtmlParser from "react-html-parser";

export default function AlertMessage({ currentPage }) {
  const [data, setData] = useState([]);
  // const [shouldDisplayAlert, setShouldDisplayAlert] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          query: `query AllTrueMessages {
                all_messages(where: {active: true}) {
                  total
                  items {
                    active
                    message_type
                    message {
                      json
                    }
                  }
                }
              }`,
          variables: { entry_uid: "blte63b2ff6f6414d8e" },
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
        setData(response.data.data.all_messages);
        // console.log(response.data.data.all_messages);
        // const isAlertDismissed = sessionStorage.getItem("isAlertDismissed");
        // if (isAlertDismissed) {
        //   setShouldDisplayAlert(false);
        // }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);
  // const handleCloseAlert = () => {
  //   sessionStorage.setItem("isAlertDismissed", "true");
  //   setShouldDisplayAlert(false);
  // };

  return (
    <div>
      {data && data.items && data.items.length > 0 && (
        <Alert
          message={
            <AlertBox>
              <b>{data?.items[0]?.message_type}</b>
              <div style={{ marginBottom: -16 }}>
                {ReactHtmlParser(jsonToHtml(data?.items[0]?.message?.json))}
              </div>
            </AlertBox>
          }
          type="success"
          closable
          // onClose={handleCloseAlert}
        />
      )}
    </div>
  );
}
