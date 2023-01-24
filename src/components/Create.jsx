import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";
import emAbi from "../abi/emAbi";
import "../styles/Create.css";
import { useNotification } from "@web3uikit/core";

export default function Create({ electionManager, handleSuccess, callback }) {
  const [name, setName] = useState("");
  const [end, setEnd] = useState("");
  const { data: singer } = useSigner();
  const dispatch = useNotification();

  function unixTime(dateString) {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60;
    return Math.floor(date.getTime() / 1000 + timezoneOffset);
  }

  async function handleCreate() {
    const electionManagerContract = new ethers.Contract(electionManager, emAbi, singer);
    try {
      const tx = await electionManagerContract.createElection(name, unixTime(end));
      handleSuccess(tx, callback);
    } catch (error) {
      let miniError = error.reason.replace("execution reverted: ", "");
      dispatch({
        type: "error",
        message: miniError,
        title: "Error",
        position: "topR",
      });
    }
  }

  return (
    <div className="Create">
      <h1 className="electionTitle">Create</h1>
      <div className="nameRow">
        <p>Election name: </p>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)}></input>
      </div>
      <div className="nameRow">
        <p>End date: </p>
        <input type="date" onChange={(event) => setEnd(event.target.value)} value={end}></input>
      </div>
      <button className="txButton glass" onClick={handleCreate}>
        Create Election
      </button>
    </div>
  );
}
