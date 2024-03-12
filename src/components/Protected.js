import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Protected(props) {
  const navigate = useNavigate();
  const { Component } = props;
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  // const blockedUser = userData.blocked === true;

  useEffect(() => {
    if (!userData || userData?.blocked === true) {
      navigate("/", { replace: true });
    }
  }, []);

  return <Component />;
}
