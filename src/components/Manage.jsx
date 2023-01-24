import { useEffect, useState } from "react";
import { useProvider, useSigner, useAccount } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Manage.css";
import { ethers } from "ethers";
import useIsSmol from "../useIsSmol";
import { useNotification } from "@web3uikit/core";
export default function Manage({ election, electionData, handleSuccess }) {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [revenue, setRevenue] = useState("");
  const smol = useIsSmol();
  const dispatch = useNotification();
  let candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters;
  if (electionData) {
    ({ candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters } = electionData);
  }

  async function loadRevenue() {
    const rawRevenue = await provider.getBalance(election.election);
    setRevenue(ethers.utils.formatEther(rawRevenue));
  }

  useEffect(() => {
    loadRevenue();
  }, [election]);

  let formattedStartTime, formattedEndTime;
  if (electionData) {
    formattedStartTime = new Date(electionStartTime.toNumber() * 1000).toLocaleString();
    formattedEndTime = new Date(electionEndTime.toNumber() * 1000).toLocaleString();
  }

  async function handleWithdraw() {
    const electionContract = new ethers.Contract(election.election, eAbi, signer);

    try {
      const tx = await electionContract.withdrawRevenue();
      handleSuccess(tx, loadRevenue);
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
    <div className="Manage">
      <h1 className="electionTitle">Manage: {election.name}</h1>
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
      <div className="manageRow">
        <p>Current Revenue: {revenue} AVAX</p>

        <button className="txButton glass" onClick={handleWithdraw}>
          Withdraw Revenue
        </button>
      </div>
    </div>
  );
}
