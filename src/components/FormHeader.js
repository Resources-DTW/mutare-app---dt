import React from "react";
import { Logo, Rsubtitle, Rtitle } from "../styles/Styles";

export default function FormHeader({ image, title, subTitle }) {
  return (
    <>
      <Logo src={image} />
      <Rtitle>{title}</Rtitle>
      <Rsubtitle>{subTitle}</Rsubtitle>
    </>
  );
}
