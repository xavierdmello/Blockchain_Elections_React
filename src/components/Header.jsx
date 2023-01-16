import React from "react";

import "../styles/Header.css";
import logo from "../assets/logo.png";
import logo_smol from "../assets/logo-smol.png"
import overflow_menu from "../assets/overflow_menu.svg"

import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
export default function Header() {
  return (
    <div className="Header">
      <span className="right">
        <img className="logo" src={logo}></img>
        <img className="logo_smol" src={logo_smol}></img>
        <b>Vote</b>
        <b>Run</b>
        <b>Manage</b>
        <b>Faucet</b>
        <b>Github</b>
      </span>

      <div className="web3buttons">
        <img className="overflow_menu" src={overflow_menu} />
        <Web3NetworkSwitch className="w3button" />
        <Web3Button className="w3button" icon="show" balance="show" />
      </div>
    </div>
  );
}
