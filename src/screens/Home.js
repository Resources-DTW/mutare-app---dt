import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Card,
  Modal,
  Pagination,
  Spin,
  Tooltip,
} from "antd";
import {
  AiFillDislike,
  AiFillFile,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineFile,
  AiOutlineLike,
  AiOutlineReload,
  AiOutlineSend,
} from "react-icons/ai";
import { FaBuffer } from "react-icons/fa";
import Link from "antd/es/typography/Link";
import image from "../assests/image.png";
import AlertMessage from "../components/AlertMessage";
import MainHeader from "../components/MainHeader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import ReactHtmlParser from "react-html-parser";
import { Charlimit, Textarea } from "../styles/Styles";
import Categories from "../components/Categories";

const { Sider, Content } = Layout;
// const onFinish = (values) => {
//   console.log("Success:", values);
// };
// const onFinishFailed = (errorInfo) => {
//   console.log("Failed:", errorInfo);
// };

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedCardIndex, setClickedCardIndex] = useState(null);
  const [articleData, setArticleData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const textareaRef = useRef(null);

  const parseResponseData = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  // const userDataString = localStorage.getItem("userData");
  // const userData = JSON.parse(userDataString);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const updateArticleViews = async (articleId) => {
    try {
      const headers = {
        api_key: "blt6f0f282d20bbe00b",
        authorization: "cs126192b9f72c7fcf7ec544c3",
      };

      const response = await axios.get(
        `https://api.contentstack.io/v3/content_types/articles/entries/${articleId}`,
        { headers }
      );

      const currentViews = response.data.entry.number_of_views || 0;
      const updatedViews = currentViews + 1;

      const payload = {
        entry: {
          number_of_views: updatedViews,
        },
      };
      await axios.put(
        `https://api.contentstack.io/v3/content_types/articles/entries/${articleId}`,
        payload,
        { headers }
      );
    } catch (error) {
      console.error("Error updating article views:", error);
    }
  };

  const handleOpenModal = (index) => {
    const clickedArticle = articleData[index];
    if (clickedArticle) {
      updateArticleViews(clickedArticle.uid);
    }
    setModalVisible(true);
    setClickedCardIndex(index);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setClickedCardIndex(null);
  };

  const handleSearchInputChange = (event) => {
    const input = event.target.value;
    if (input.length <= 8192) {
      setSearchInput(input);
    }
  };

  useEffect(() => {
    const fetchAllArticles = async () => {
      let endpoint = `https://cdn.contentstack.io/v3/content_types/articles/entries?query=`;
      if (selectedCategory) {
        endpoint += `{"taxonomies.ehss_category" : { "$in" : ["${selectedCategory}"] }}`;
      } else {
        endpoint += `{"taxonomies.ehss_category" : { "$in" : ["environment", "health", "safety", "esg"] }}`;
      }
      const headers = {
        api_key: "blt6f0f282d20bbe00b",
        access_token: "cs534278b3e38a059d0cd52cdc",
      };
      try {
        const res = await axios.get(endpoint, { headers });
        setArticleData(res.data.entries);
        setResponseData(null);
        setSearchInput("");
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchAllArticles();
  }, [selectedCategory, currentPage]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (searchInput.trim() !== "") {
        const response = await axios.post(
          "https://chemaid.mutare.ai/api/query",
          { question: searchInput }
        );
        setResponseData(response.data);
        setClickedCardIndex(-1);
        setLiked(false);
        setDisliked(false);
        setCopy(false);
      } else {
        setResponseData(null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const setSelectCategoryAndResetPage = (category) => {
    setCurrentPage(1);
    setSelectedCategory(category);
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [searchInput]);

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

  const PostQnA = async (action) => {
    if (!responseData) return;

    const endpoint =
      "https://api.contentstack.io/v3/content_types/qanda/entries";
    const headers = {
      api_key: "blt6f0f282d20bbe00b",
      authorization: "cs126192b9f72c7fcf7ec544c3",
    };
    const userDataString = localStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    const RandomTitle = generateRandomString(8);

    try {
      const existingEntryResponse = await axios.get(endpoint, { headers });
      const existingEntries = existingEntryResponse.data.entries;

      const existingEntry = existingEntries.find((entry) => {
        return entry.question === searchInput && entry.answer === responseData;
      });

      if (existingEntry) {
        const updatedData = {
          ...existingEntry,
          action: action,
        };
        await axios.put(
          `${endpoint}/${existingEntry.uid}`,
          { entry: updatedData },
          {
            headers,
          }
        );
      } else {
        const data = {
          entry: {
            title: RandomTitle,
            qanda_user: userData?.title,
            question: searchInput,
            answer: responseData,
            action: action,
          },
        };
        await axios.post(endpoint, data, { headers });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const copyResponseData = (data) => {
    const textarea = document.createElement("textarea");
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopy(true);
    setDisliked(false);
    setLiked(false);
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
      setCopy(false);
    }
  };

  const handleToggleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
      setCopy(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {/* // <Layout> */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        pauseOnHover={false}
      />
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={handleToggleCollapsed}
        style={{ maxWidth: "12%" }}
      >
        <div className="demo-logo-vertical text-center m-1 my-3">
          <img src={image} width={95} alt="Logo" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <FaBuffer />,
              label: "Home",
              style: {
                fontSize: "16px",
                fontWeight: 500,
                color: "#1B1B1B",
              },
            },
          ]}
          onClick={() => setResponseData(null) || setSelectedCategory(null)}
        />
      </Sider>

      <Layout>
        <MainHeader
          collapsed={collapsed}
          handleToggleCollapsed={handleToggleCollapsed}
        />
        <Content
          style={{
            margin: "24px 16px",
            minHeight: 280,
            borderRadius: borderRadiusLG,
          }}
        >
          <div>
            <AlertMessage currentPage={currentPage} />
            <Categories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectCategoryAndResetPage}
            />
            <div className="my-4 pb-3">
              <div className="d-flex justify-content-between align-items-end responce_search">
                <Textarea
                  ref={textareaRef}
                  placeholder="How can I help you?"
                  rows={1}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <Charlimit>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 5,
                      right: 30,
                      fontSize: 13,
                      color: searchInput.length <= 8192 ? "gray" : "red",
                    }}
                  >
                    {searchInput.length}/8192
                  </span>
                </Charlimit>
                <Link
                  onClick={handleSubmit}
                  className="search_button text-center"
                  htmltype="submit"
                >
                  {!loading ? (
                    <AiOutlineSend />
                  ) : (
                    <Spin size="large" fullscreen />
                  )}
                </Link>
              </div>
            </div>
            {!responseData && (
              <div className="mt-4">
                <Row gutter={[10, 10]}>
                  {articleData
                    .slice((currentPage - 1) * 4, currentPage * 4)
                    .map((card, index) => (
                      <Col md={12} span={24} key={index}>
                        <Card
                          className={`content_wrapper ${
                            index === clickedCardIndex ? "clicked" : ""
                          }`}
                          onClick={() => handleOpenModal(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <h4>{card.title}</h4>
                          <div className="mb-0">
                            {ReactHtmlParser(
                              jsonToHtml(card?.article_description)
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                </Row>
                <Pagination
                  defaultCurrent={1}
                  total={articleData.length}
                  size="default"
                  onChange={handlePageChange}
                  current={currentPage}
                  className="text-end mt-2"
                  pageSize={4}
                />
              </div>
            )}
            {responseData && (
              <>
                <div className="pt-1">
                  <Row className={responseData ? "no-select" : ""}>
                    <Col span={24}>
                      <Card className="responce_wrapper">
                        <h4>
                          <img
                            alt="chemaid-logo"
                            src={image}
                            width={30}
                            className="me-3"
                          />
                          Response
                        </h4>
                        <div
                          className="response_scroll"
                          style={{ whiteSpace: "pre-line" }}
                          dangerouslySetInnerHTML={{
                            __html: parseResponseData(responseData),
                          }}
                        ></div>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div className="mt-3 d-flex justify-content-end">
                  <Tooltip title="Like">
                    <div
                      onClick={() => {
                        handleToggleLike();
                        PostQnA("Like");
                      }}
                      className="content-icon me-2"
                    >
                      <Link>{!liked ? <AiOutlineLike /> : <AiFillLike />}</Link>
                    </div>
                  </Tooltip>
                  <Tooltip title="Dislike">
                    <div
                      onClick={() => {
                        handleToggleDislike();
                        PostQnA("Dislike");
                      }}
                      className="content-icon me-2"
                    >
                      <Link>
                        {!disliked ? <AiOutlineDislike /> : <AiFillDislike />}
                      </Link>
                    </div>
                  </Tooltip>
                  <Tooltip title="Regenerate">
                    <div
                      onClick={() => {
                        PostQnA("Regenerate");
                      }}
                      className="content-icon me-2"
                    >
                      <Link onClick={handleSubmit}>
                        <AiOutlineReload />
                      </Link>
                    </div>
                  </Tooltip>
                  <Tooltip title="Copy to clipboard">
                    <div
                      className="content-icon"
                      onClick={() => {
                        copyResponseData(responseData);
                        PostQnA("Copy");
                      }}
                    >
                      <Link>{!copy ? <AiOutlineFile /> : <AiFillFile />}</Link>
                    </div>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        </Content>
      </Layout>

      <MyModal
        visible={modalVisible}
        onClose={handleCloseModal}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        articleData={articleData}
        clickedCardIndex={clickedCardIndex}
      />
    </Layout>
  );
}

function MyModal({ visible, onClose, articleData, clickedCardIndex }) {
  let clickedCard = null;
  let convertedFormat = null;

  if (
    clickedCardIndex !== null &&
    clickedCardIndex >= 0 &&
    clickedCardIndex < articleData.length
  ) {
    clickedCard = articleData[clickedCardIndex];
    const articleContent = clickedCard?.article_content;
    convertedFormat = jsonToHtml(articleContent);
    // console.log(convertedFormat);
  }

  return (
    <Modal
      key={clickedCardIndex}
      open={visible}
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      width={1000}
      centered
      className="modal_content"
    >
      <div>
        <div className="content_modal">{ReactHtmlParser(convertedFormat)}</div>
      </div>
    </Modal>
  );
}
