import { Card, Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import environmental from "../assests/environmental_icon 1.png";
import health from "../assests/Health_icon 1.png";
import safety from "../assests/Safety_icon 1.png";
import sustainability from "../assests/Sustainability_icon 1.png";
import Link from "antd/es/typography/Link";

export default function Categories({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState(null);

  // useEffect(() => {
  //   const fetchAllCategories = async () => {
  //     const url =
  //       "https://api.contentstack.io/v3/taxonomies/ehss_category/terms";

  //     const headers = {
  //       api_key: "blt6f0f282d20bbe00b",
  //       authorization: "cs126192b9f72c7fcf7ec544c3",
  //     };
  //     try {
  //       const res = await axios.get(url, { headers });
  //       setCategories(res.data);
  //       console.log(res.data);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   fetchAllCategories();
  // }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Link onClick={() => setSelectedCategory("environment")}>
            <Card
              className="facility_wrapper mt-4"
              style={{
                backgroundColor: `${
                  selectedCategory === "environment" ? "#3ac1cb" : "#fff"
                }`,
              }}
            >
              <div className="text-center">
                <img
                  alt="Environment"
                  src={environmental}
                  className="card_img"
                  height={90}
                />
                <h2
                  style={{
                    color: `${
                      selectedCategory === "environment" ? "#fff" : "#548235"
                    }`,
                  }}
                >
                  ENVIRONMENT
                </h2>
              </div>
            </Card>
          </Link>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Link onClick={() => setSelectedCategory("health")}>
            <Card
              className="facility_wrapper mt-4"
              style={{
                backgroundColor: `${
                  selectedCategory === "health" ? "#3ac1cb" : "#fff"
                }`,
              }}
            >
              <div className="text-center">
                <img
                  alt="Health"
                  src={health}
                  className="card_img"
                  height={90}
                />
                <h2
                  style={{
                    color: `${
                      selectedCategory === "health" ? "#fff" : "#548235"
                    }`,
                  }}
                >
                  HEALTH
                </h2>
              </div>
            </Card>
          </Link>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Link onClick={() => setSelectedCategory("safety")}>
            <Card
              className="facility_wrapper mt-4"
              style={{
                backgroundColor: `${
                  selectedCategory === "safety" ? "#3ac1cb" : "#fff"
                }`,
              }}
            >
              <div className="text-center">
                <img
                  alt="Safety"
                  src={safety}
                  className="card_img"
                  height={90}
                />
                <h2
                  style={{
                    color: `${
                      selectedCategory === "safety" ? "#fff" : "#548235"
                    }`,
                  }}
                >
                  SAFETY
                </h2>
              </div>
            </Card>
          </Link>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <Link onClick={() => setSelectedCategory("esg")}>
            <Card
              className="facility_wrapper mt-4"
              style={{
                backgroundColor: `${
                  selectedCategory === "esg" ? "#3ac1cb" : "#fff"
                }`,
              }}
            >
              <div className="text-center">
                <img
                  alt="Sustainability"
                  src={sustainability}
                  className="card_img"
                  height={90}
                />
                <h2
                  style={{
                    color: `${selectedCategory === "esg" ? "#fff" : "#548235"}`,
                  }}
                >
                  SUSTAINABILITY
                </h2>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
