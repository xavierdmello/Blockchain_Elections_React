import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useProvider, usePrepareContractWrite, useContractWrite } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Run.css";

export default function Run({ election, eda, handleSuccess}) {
  const [name, setName] = useState("");
  const [electionData, setElectionData] = useState();
  const smol = useIsSmol();

  async function load() {
    const data = await eda.getElectionData(election.election);
    setElectionData(data);
  }

  useEffect(() => {
    if (election) {
      load();
    }
  }, [election]);

  const { config, error } = usePrepareContractWrite({
    address: election.election,
    abi: eAbi,
    functionName: "runForElection",
    args: [name],
    overrides: {
      value: candidateFee,
    },
    chainId: 43113,
    onSuccess: (tx) => handleSuccess(tx, load),
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  if (electionData) {
    formattedStartTime = new Date(electionStartTime.toNumber() * 1000).toLocaleString();
    formattedEndTime = new Date(electionEndTime.toNumber() * 1000).toLocaleString();
  }
  {
    !smol && (
      <p className="vote-dates">
        {formattedStartTime} - {formattedEndTime}
      </p>
    );
  }
  {
    smol && (
      <>
        <p className="vote-dates">Open: {formattedStartTime}</p>
        <p className="vote-dates">Close: {formattedEndTime}</p>
      </>
    );
  }
  return (
    <div className="Run">
      <h1 className="electionTitle">Run - {election.name}</h1>

      <div className="voteRow">
        <p>Enter your name:</p>
        <input placeholder="John Doe" type="text" onChange={(event) => setName(event.target.value)} value={name} />
      </div>
      <button onClick={write}>Run For Office</button>
    </div>
  );
}
