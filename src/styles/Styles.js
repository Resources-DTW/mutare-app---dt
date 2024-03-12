import styled from "styled-components";
import BG from "../assests/bg.png";
import { Input, Form, Button } from "antd";
import { Link } from "react-router-dom";

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  background-color: #dcf0ec;
  margin: 0;
  padding: 2%;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 5%;
    height: 100%;
  }
`;
export const LeftContainer = styled.div`
  padding-left: 6%;
  padding-right: 3%;
  padding-top: 5%;
  padding-bottom: 1%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url(${BG});
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 1%;
  @media screen and (max-width: 768px) {
    order: 2;
    margin-top: 3%;
    padding-bottom: 8%;
  }
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  @media screen and (max-width: 768px) {
    order: 1;
  }
`;

export const Logo = styled.img`
  width: 25%;
  height: 25%;
  object-fit: contain;
  @media screen and (max-width: 768px) {
    width: 35%;
    height: 25%;
    object-fit: contain;
  }
`;

export const Title = styled.p`
  font-size: 58px;
  font-weight: 700;
  color: #ffffff;
  line-height: 100%;
  @media screen and (max-width: 768px) {
    font-size: 24px;
    line-height: 36px;
  }
`;

export const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  opacity: 80%;
  width: 100%;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
export const Cta = styled.a`
  color: #ffffff;
`;
export const CopyRight = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  opacity: 60%;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Rtitle = styled.p`
  font-size: 38px;
  font-weight: 600;
  color: #333333;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Rsubtitle = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #1b1b1b;
  opacity: 60%;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Signin = styled.div`
  font-size: 15px;
  opacity: 60%;
  display: flex;
  gap: 10px;
`;

export const Signintext = styled.p`
  color: #1b1b1b;
  font-weight: 400;
`;

export const ForgotToken = styled.a`
  float: right;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  color: #1b1b1b;
  opacity: 60%;
  margin-top: -6%;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin-top: -7%;
  }
`;
export const Buttonfield = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  padding-top: 5%;
  padding-bottom: 5%;
  margin-top: -10%;
  text-transform: uppercase;
  text-decoration: none;
  @media screen and (max-width: 768px) {
    margin-top: -12%;
  }
`;
export const Formfield = styled(Form)`
  width: 60%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
export const InputField = styled(Input)`
  height: 44px;
  gap: 5px;
`;

export const Nav = styled(Link)`
  color: #088f99;
  text-decoration: none;
  font-weight: 500;
`;
export const Logintext = styled.div`
   display: flex,
   flex-direction: row,
    alignItems: center,
    justify-content:center,
    font-size:16px;
    font-weight:600;
    @media screen and (max-width: 768px){
       font-size:14px;
     }
`;

export const AlertBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 100%;
  gap: 5px;
  color: #1b1b1b;
  opacity: 60%;
  font-size: 16px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    flex-direction: column;
    align-items: start;
  }
`;

export const Textarea = styled.textarea`
  width: 93%;
  padding: 1%;
  border-radius: 10px;
  resize: none;
  overflow-y: hidden;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 4%;
  }
`;
export const Charlimit = styled.div`
  position: relative;
  width: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
