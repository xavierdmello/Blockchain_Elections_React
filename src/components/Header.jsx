import React, { useEffect, useState } from "react";

import "../styles/Header.css";
import logo from "../assets/logo.png";
import logo_smol from "../assets/logo-smol.png";
import overflow_menu from "../assets/overflow_menu.svg";
import useIsSmol from "../useIsSmol";

import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";

export default function Header() {
  const [navButtons, setNavButtons] = useState({
    vote: { text: "Vote", onClick: () => console.log("Vote"), visible: true },
    run: { text: "Run", onClick: () => console.log("Run"), visible: true },
    manage: { text: "Manage", onClick: () => console.log("Manage"), visible: true },
    create: { text: "Create", onClick: () => console.log("Create"), visible: true },
    faucet: { text: "Faucet", onClick: () => console.log("Faucet"), visible: true },
    github: { text: "Github", onClick: () => console.log("Github"), visible: true },
  });

  const smol = useIsSmol();

  // Map header buttons to JSX elements
  const navButtonElements = [];
  const overflowElements = [];
  Object.keys(navButtons).forEach(function (key, index) {
    const button = navButtons[key];
    const style = {
      visibility: button.visible ? "visible" : "hidden",
    };

    let element = (
      <b className="nav-button" id={key} key={key} style={style} onClick={button.onClick}>
        {button.text}
      </b>
    );
    navButtonElements.push(element);
    if (!button.visible) {
      element = (
        <b className="nav-button" id={key} key={key} style={{ visibility: "visible" }} onClick={button.onClick}>
          {button.text}
        </b>
      );
      overflowElements.push(element);
    }
  });
  const overflowMenuStyle = {
    visibility: overflowElements.length ? "visible" : "hidden",
  };

  // Setup event listeners that sync button visibility with react state
  // i.e is the button overflowing & therefore not visible?
  useEffect(() => {
    let options = {
      threshold: 1,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setNavButtons((prevNavButtons) => {
          const newNavButtons = { ...prevNavButtons };
          const newNavButton = newNavButtons[entry.target.id];
          newNavButtons[entry.target.id] = { ...newNavButton, visible: entry.isIntersecting };
          return newNavButtons;
        });
      });
    }, options);

    const elements = document.querySelectorAll(".nav-button");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="Header">
      <span className="right">
        <img className="logo" src={logo}></img>
        <img className="logo_smol" src={logo_smol}></img>
        {navButtonElements}
      </span>

      <div className="web3buttons">
        <div className="overflowContainer">
          <img className="overflow_menu" src={overflow_menu} style={overflowMenuStyle} />
          <div className="overflowElements">{overflowElements}</div>
        </div>

        <Web3NetworkSwitch className="w3NetworkSwitch w3button" style={{ display: smol ? "none" : "inline" }} />

        <Web3Button className="w3button" icon={smol ? "hide" : "show"} label={smol ? "Connect" : "Connect Wallet"} balance={smol ? "hide" : "show"} />
      </div>
    </div>
  );
}
