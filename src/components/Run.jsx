import { useState } from "react";
import { useSigner, useProvider, usePrepareContractWrite, useContractWrite, useContractRead } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Run.css";
export default function Run({ election }) {
  const [name, setName] = useState("");
  const { data: candidateFee } = useContractRead({
    address: election.election,
    abi: eAbi,
    functionName: "candidateFee",
  });
  const { config, error } = usePrepareContractWrite({
    address: election.election,
    abi: eAbi,
    functionName: "runForElection",
    args: [name],
    overrides: {
      value: candidateFee,
    },
    chainId: 43113,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div className="Run">
      <h1 className="electionTitle">{election.name}</h1>

      <div className="voteRow">
        <p>Enter your name:</p>
        <input placeholder="John Doe" type="text" onChange={(event) => setName(event.target.value)} value={name} />
        <button onClick={write}>Run For Office</button>
      </div>
    </div>
  );
}
