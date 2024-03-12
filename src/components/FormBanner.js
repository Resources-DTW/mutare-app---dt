import React, { useEffect, useState } from "react";
import { CopyRight, LeftContainer, SubTitle, Title } from "../styles/Styles";
import axios from "axios";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import ReactHtmlParser from "react-html-parser";

export default function FormBanner() {
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    const fetchWelcomeMsgData = async () => {
      try {
        const data = {
          query: `query WelcomeMsg {
            all_welcome(where: {active: true}) {
              items {
                title
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
        // console.log(response.data);
        setWelcomeData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWelcomeMsgData();
  }, []);

  return (
    <LeftContainer>
      <div>
        {welcomeData &&
          welcomeData.data &&
          welcomeData.data.all_welcome &&
          welcomeData.data.all_welcome.items &&
          welcomeData.data.all_welcome.items.length > 0 && (
            <>
              <Title>{welcomeData.data.all_welcome.items[0].title}</Title>
              <SubTitle>
                {ReactHtmlParser(
                  jsonToHtml(welcomeData.data.all_welcome.items[0].message.json)
                )}
              </SubTitle>
            </>
          )}
      </div>
      <CopyRight>
        2023 CHEM&#8226;AID<sup>TM</sup>&#9135; All rights reserved.
      </CopyRight>
    </LeftContainer>
  );
}
