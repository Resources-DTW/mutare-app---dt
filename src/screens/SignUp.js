import React from "react";
import {
  MainContainer,
  Nav,
  RightContainer,
  Signin,
  Signintext,
} from "../styles/Styles";
import image from "../assests/image.png";
import "react-toastify/dist/ReactToastify.css";
import SignUpForm from "../components/SignUpForm";
import FormBanner from "../components/FormBanner";
import FormHeader from "../components/FormHeader";

export default function SignUp() {
  return (
    <MainContainer>
      <FormBanner />
      <RightContainer>
        <FormHeader
          image={image}
          title="Get Started"
          subTitle="Please enter your details below"
        />
        <SignUpForm
          emailpattern={"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"}
        />
        <Signin>
          <Signintext>Already have an account?</Signintext>
          <Nav to="/">Sign in</Nav>
        </Signin>
      </RightContainer>
    </MainContainer>
  );
}
