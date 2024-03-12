import React from "react";
import {
  MainContainer,
  Nav,
  RightContainer,
  Signin,
  Signintext,
} from "../styles/Styles";
import image from "../assests/image.png";
import FormBanner from "../components/FormBanner";
import FormHeader from "../components/FormHeader";
import ForgetForm from "../components/ForgetForm";

export default function Forget() {
  return (
    <div>
      <MainContainer>
        <FormBanner />
        <RightContainer>
          <FormHeader
            image={image}
            title="Forgot Token"
            subTitle="Please enter your registered email address"
          />
          <ForgetForm
            emailpattern={"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"}
          />
          <Signin>
            <Signintext>Don’t have an account?</Signintext>
            <Nav to="/signup">Sign up</Nav>
          </Signin>
        </RightContainer>
      </MainContainer>
    </div>
  );
}
