import React, { FC } from "react";
import { chakra, Link } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";

type Props = {
  text: string;
  href: string;
};

const NavbarLink: FC<Props> = ({ text, href }) => {
  const asPath = "/foo";

  const wrapperStyle =
    asPath === href
      ? {
          color: "brand.lightPurple",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }
      : { color: "white" };

  return (
    <chakra.a
      href={href}
      transition="0.2s all"
      px="2"
      py="8"
      whiteSpace="nowrap"
      _hover={{
        color: "brand.lightPurple",
      }}
      {...wrapperStyle}
    >
      {text}
    </chakra.a>
  );
};

export default NavbarLink;
