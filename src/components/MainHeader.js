import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import React from "react";
import { BsBoxArrowRight, BsQuestionCircle } from "react-icons/bs";
import { PiUserCircleLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import Link from "antd/es/typography/Link";
import { resetUserData } from "../redux/actions/userAction";

export default function MainHeader({ collapsed, handleToggleCollapsed }) {
  const { Header } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(resetUserData(user));
    localStorage.removeItem("userData");
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div className="header_wrapper pe-3">
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined onClick={handleToggleCollapsed} />
            ) : (
              <MenuFoldOutlined onClick={handleToggleCollapsed} />
            )
          }
          onClick={handleToggleCollapsed}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <div className="d-flex align-items-center">
          <Link href="">
            <BsQuestionCircle className="question me-3" />
          </Link>
          <Link href="" className="d-flex align-items-center user_profile">
            <PiUserCircleLight className="user me-1" />
            <h6 className="me-3 mb-0">{userData?.user_name}</h6>
          </Link>
          <Link href="/" onClick={handleLogout}>
            <BsBoxArrowRight className="log_out" />
          </Link>
        </div>
      </div>
    </Header>
  );
}
