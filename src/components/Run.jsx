import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Run.css";
import useIsSmol from "../useIsSmol";
import { useNotification } from "@web3uikit/core";
export default function Run({ election, electionData, handleSuccess, callback }) {
  const [name, setName] = useState("");
  const smol = useIsSmol();
  const { data: singer } = useSigner();
  const dispatch = useNotification();

  let candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters;
  if (electionData) {
    ({ candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters } = electionData);
  }

  async function handleRun() {
    const electionContract = new ethers.Contract(election.election, eAbi, singer);
    try {
      const tx = await electionContract.runForElection(name, { value: candidateFee });
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

  let formattedStartTime, formattedEndTime;
  if (electionData) {
    formattedStartTime = new Date(electionStartTime.toNumber() * 1000).toLocaleString();
    formattedEndTime = new Date(electionEndTime.toNumber() * 1000).toLocaleString();
  }

  return (
    <div className="Run">
      <h1 className="electionTitle">Run: {election.name}</h1>
      {!smol && (
        <p className="vote-dates">
          {formattedStartTime} - {formattedEndTime}
        </p>
      )}
      {smol && (
        <>
          <p className="vote-dates">Open: {formattedStartTime}</p>
          <p className="vote-dates">Close: {formattedEndTime}</p>
        </>
      )}
      <div className="voteRow">
        <p>Enter your name:</p>
        <input placeholder="John Doe" type="text" onChange={(event) => setName(event.target.value)} value={name} />
      </div>
      <p>Candidate fee: {ethers.utils.formatEther(candidateFee)} AVAX</p>
      <button className="txButton glass" onClick={handleRun}>
        Run For Office
      </button>
    </div>
  );
}
