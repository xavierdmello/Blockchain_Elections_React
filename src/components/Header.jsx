import React from "react";

import "../styles/Header.css";
import logo from "../assets/logo.png";

import { Web3Button } from "@web3modal/react";
export default function Header() {
  return (
    <div className="Header">
      <span className="right">
        <img src={logo}></img>
        <b>Vote</b>
        <b>Run For Office</b>
        <b>Manage Elections</b>
      </span>

      <div className="web3buttons">
        <Web3Button />
      </div>
    </div>
  );
}
