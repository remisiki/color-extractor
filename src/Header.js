import React from "react";
import { ReactComponent as Logo } from "./static/darkness.svg";

export const Header = () => {
  return (
    <header className={"primary"}>
      <a href={"#"} aria-label={"logo"} id={"logo-link"}>
        <Logo id={"logo"} />
      </a>
      <h1>Color Extractor</h1>
    </header>
  );
};
