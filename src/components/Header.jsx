import React from "react";
import Connect from "./Connect"
import "../styles/Header.css";
import logo from "../assets/logo.png";


export default function Header({handleAccount}) {
  return (
    <div className="Header">
      <img src={logo}></img>
      <div className="web3buttons">
        <Connect handleAccount={handleAccount}/>
      </div>
    </div>
  );
}
